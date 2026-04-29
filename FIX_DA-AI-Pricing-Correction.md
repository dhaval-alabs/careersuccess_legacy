# DA+AI Landing Pages — Pricing Correction
## For: Antigravity Development Team
## Date: April 2026
## Priority: CRITICAL — fix before PPC goes live
## Applies to: All 4 DA+AI city pages (Delhi, Noida, Gurgaon, Bangalore)

---

## Source of Truth

The authoritative pricing is on the organic course page:
https://www.analytixlabs.co.in/data-analyst-certification-courses/

**Correct prices (ascending order — cheapest first):**

| Position | Mode | Correct Price |
|---|---|---|
| 1st | Blended eLearning | ₹47,200 incl. taxes |
| 2nd | Interactive Live Online | ₹53,100 incl. taxes |
| 3rd | Classroom & Bootcamp | ₹61,360 incl. taxes |

**Current prices on live pages are wrong:**

| Mode | Wrong (live) | Correct |
|---|---|---|
| Blended eLearning | ₹35,400 | ₹47,200 |
| Interactive Live Online | ₹41,300 | ₹53,100 |
| Classroom & Bootcamp | ₹53,100 | ₹61,360 |

---

## Note on Previous Instruction File

The file referenced as `Update_DA-AI-Mobile-Polish-Instructions.md` contained
incorrect prices. Disregard those figures entirely. The organic page above is
the only valid pricing source.

---

## Also Note — Master Instructions Pricing Order Correction

The master instructions file (`DA-AI-Master-Instructions.md`) Change 1 specified
Classroom as the first card. This is now superseded.

**Current card order on the live pages (Blended → Live Online → Classroom)
is correct** — it follows ascending price order. Do not reorder the cards.
Only fix the price amounts.

---

## Two Locations to Fix (Both Required)

### Fix 1 — Pricing Card Fee Amounts

In the `LearningModes` / pricing card component, update the fee display
on all 3 cards:

```
Blended eLearning:          ₹47,200* incl. taxes
Interactive Live Online:    ₹53,100* incl. taxes
Classroom & Bootcamp:       ₹61,360* incl. taxes
```

Keep the `<sup>*</sup>` asterisk already added per the master instructions.

---

### Fix 2 — FAQ Answer Referencing Pricing

The FAQ array in each `page.tsx` file contains a hardcoded answer with the
wrong prices. Find the FAQ that mentions specific fee amounts (it will contain
"35,400" or "41,300" or "53,100") and update all three figures:

**Find (in FAQ array, all 4 page.tsx files):**
```
Rs.35,400 (incl. taxes) for Blended eLearning, Rs.41,300 for Live Online,
and Rs.53,100 for Classroom
```

**Replace with:**
```
Rs.47,200 (incl. taxes) for Blended eLearning, Rs.53,100 for Interactive
Live Online, and Rs.61,360 for Classroom and Bootcamp
```

Search all 4 page.tsx files for "35,400" to locate every instance.

---

## Verification

After deploying, check on all 4 pages:

- [ ] Blended eLearning card shows ₹47,200 incl. taxes
- [ ] Interactive Live Online card shows ₹53,100 incl. taxes
- [ ] Classroom & Bootcamp card shows ₹61,360 incl. taxes
- [ ] Card order: Blended → Live Online → Classroom (unchanged)
- [ ] No instance of "35,400", "41,300" remaining anywhere on any page
- [ ] FAQ answer referencing prices shows the 3 correct figures

---

## Commit Message

```
fix(da-ai-pages): correct pricing to match organic page on all 4 city pages

- Blended: ₹35,400 → ₹47,200 | Live Online: ₹41,300 → ₹53,100
- Classroom: ₹53,100 → ₹61,360
- Fix pricing cards + FAQ hardcoded answer in all 4 page.tsx files
- Card order unchanged (ascending price order already correct)
```
