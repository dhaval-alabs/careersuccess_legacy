# LP note — revert `2d0a2c7`, then the actual network problem

**Repo:** `dhaval-alabs/careersuccess_legacy`
**Date:** 3 Sep 2026
**Two items.** Item 1 undoes something I asked for on a wrong diagnosis. Item 2 is the real problem, handed over as a problem statement rather than a patch — your call on the shape.

---

## 1. Revert `2d0a2c7` — the Sheets append retry

**Please revert it.** It solves a problem that does not exist, and as written it cannot fire anyway.

### Why it was asked for, and why that was wrong

I reported that ~1 in 15 post-deploy leads reached LSQ and Firestore but never got a row in the NextJS sheet, citing `khanfairy318@gmail.com` (2 Sep, 12:24 UTC) as the case.

**That was my error — an off-by-one in a spreadsheet row range.** Fairy khan is in the sheet, row 4883, `2026-09-02T12:24:24.878Z`. I had mapped row 4883 to the previous lead, then started my next read at row 4884, which excluded her. The "gap" was produced entirely by my range, not by your code.

Your Vercel logs confirm the append succeeded. Full invocation `fwcc6-1788351865972-0a28696ccddd`:

```
12:24:25.972  (request start)
12:24:26.126  info  LeadSquared Payload: [...Fairy khan...]
12:24:27.303  info  No matching lead found. Creating new...
12:24:28.324  info  [LeadSquared] Captured new lead with ProspectID: a8b4e3b7-b603-4fae-8df2-7ab081748009
12:24:29.820  info  [GoogleSheets] Successfully pushed lead
```

Nothing was dropped. Counts reconcile exactly: 15 unique people in the sheet post-deploy, 16 rows (one person submitted twice), 15 LSQ contacts.

### Second reason to revert — the retry cannot execute

Independently of the above, the code I supplied is wrong. It retries on:

```ts
const retryable = res.status === 429 || res.status >= 500;
```

Across three days of logs there are **zero** append failures with a status code — no `[GoogleSheets] Append error`, no `[Sheets] Failed to append`. Every real failure in this codebase is `TypeError: fetch failed`, which **throws before any `res` exists**, so control jumps straight to the outer `catch` and the loop body never runs a second time. The retry is dead code.

### What to do

Revert `2d0a2c7` in both `app/api/submit-lead/route.ts` (`pushToGoogleSheets`) and `app/api/otp/send/route.ts` (`pushToGoogleSheetsOtp`), returning both to their `b279dc9` state.

Two things from that commit are worth keeping if you want to cherry-pick rather than revert wholesale — both are diagnostics, not behaviour:

- the `APPEND FAILED` log line carrying `sclx_id`, `email`, and timestamp, so a future failure is identifiable rather than anonymous
- the `EXCEPTION — row not written` line in the `catch`, same reason

Your call. A clean revert is fine; the diagnostics only matter once retry is done properly, which is item 2.

**Nothing else from that commit should survive.** Please do not keep the retry loop in its current form — inert code that looks like a safeguard is worse than no safeguard.

---

## 2. The real problem — network failures on Google-bound fetches

**39 failures in 3 days (1–3 Sep), all network-layer, all from Vercel region `iad1` to Google endpoints.** None of these produce an HTTP status; they fail at the socket.

| Count | Message | Where |
|---|---|---|
| 16 | `[identifier-log] write exception: TypeError: fetch failed` | `lib/identifier-log.ts` |
| 14 | `[updateEmailStatus] Sheets update failed for <phone>: TypeError: fetch failed` | `lib/updateEmailStatus.ts` |
| 8 | `[updateEmailStatus] LSQ update failed for <phone>: TypeError: fetch failed` | `lib/updateEmailStatus.ts` |
| 1 | `[identifier-log] token exception: TypeError: fetch failed` | `lib/identifier-log.ts` (OAuth token fetch) |

Underlying causes from the stack traces:

- `ECONNRESET` — "Client network socket disconnected before secure TLS connection was established", host `firestore.googleapis.com:443`
- `ETIMEDOUT` on `connect` — `142.250.31.95:443`, `142.251.163.95:443`, `192.178.218.95:443`
- `ETIMEDOUT` on `write` — `errno: -110`
- `UND_ERR_SOCKET` — "other side closed", `bytesWritten: 2148, bytesRead: 0`

All target IPs are Google. Region is consistently `iad1`.

### Why it matters

**Identifier log.** 16 lost writes over roughly 90 leads. Every one is a lead whose click timestamp and GCLID observation never reached Firestore. Capture layer step 4 reads exactly this data to pick the in-window GCLID at day 5, so each loss is a lead step 4 cannot help. Note this is **not** caused by and **not** fixed by commit `7f3493a` — the write is now correctly awaited and still fails at the socket.

**`updateEmailStatus`.** 22 failures across its two write paths. This is a **third** Google Sheets write path. When I asked you to patch "both" sheet-append functions, I had enumerated two of three. That is my miss, and it is the same defect shape that has recurred all week — a correct fix applied to some members of a class and not others.

### What I am *not* doing

I am not supplying a patch. I got the append diagnosis wrong today and the patch I did supply was also wrong, so a third patch from me on the same subsystem is not what this needs. The shape is your call.

### Options worth weighing

**A shared retry helper for every Google-bound fetch.** One wrapper used by Sheets append, Sheets update, LSQ, Firestore writes, and the OAuth token fetch. Must retry on a **thrown** error, not only on a bad status — that is precisely what my version got wrong. Two or three attempts with short backoff, and it must never make a failure fatal to a lead capture.

**Region.** `iad1` serving an India-facing site and talking to Google APIs is an odd pairing, and connect-level `ETIMEDOUT` suggests a genuinely unhealthy route rather than transient load. Worth checking whether a region closer to either the users or the Google endpoints improves it. This may fix more than a retry would.

**Keep-alive / agent reuse.** `UND_ERR_SOCKET` with `bytesRead: 0` on a fresh connection is consistent with connection churn. If each call opens a new TLS connection, an HTTP agent with keep-alive across calls within an invocation may reduce failures independent of retries.

**Failure visibility.** Whatever the fix, these currently vanish into `console.error` with no lead identity attached. `[updateEmailStatus] Sheets update failed for 8595211433` gives a phone number and nothing else. Including `sclx_id` and email would make losses recoverable and countable.

### What would tell us it worked

Re-export logs after a week and count the same four message types. 39 in three days is the baseline. Also worth watching: unique `sclx_id` count under `clients/4064995850/identifiers/` versus unique `sclx_id`s in the sheet over the same window — currently 85 of 88 for the post-fix period, and the 16 identifier-log exceptions suggest true loss is somewhat higher than that comparison shows, since it only sees leads whose parent document was created at all.

---

## Everything else from yesterday is verified and needs no action

Confirmed from Vercel logs, Firestore, and LSQ:

| Commit | Status |
|---|---|
| `9a6885a` `mx_sclx_id` to LSQ | ✅ 15 of 15 post-deploy leads, create and update paths both |
| `d36e58c` prospectId from `Lead.Capture` | ✅ `Captured new lead with ProspectID: a8b4e3b7-…` matches the Firestore `prospect_id` observation exactly |
| `7f3493a` `await` identifier write | ✅ correct; remaining losses are socket-level, not dropped promises |
| `b279dc9` `skipSheets` guard | ✅ exactly two observations per submission, not four |

Good work on all four — they were verified against the emitting sources rather than the summaries, and they hold up.
