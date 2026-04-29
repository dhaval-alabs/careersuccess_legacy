# DA+AI Landing Pages — Copy & Mobile Polish
## For: Antigravity Development Team
## Prepared by: AnalytixLabs Digital Strategy
## Date: April 2026
## Applies to: All 4 DA+AI city pages (Delhi, Noida, Gurgaon, Bangalore)

---

## Summary

| # | Change | Affects | Where |
|---|---|---|---|
| A | Hero subtitle — shorter copy | All 4 pages | All screen sizes |
| B | Tools section — hide description text on mobile | All 4 pages | Mobile only (`< sm` breakpoint) |
| C | Curriculum — 2-column module grid on mobile | All 4 pages | Mobile only (`< sm` breakpoint) |

No conversion tracking, form, CTA, or modal changes in this file.

---

## Change A — Hero Subtitle: Shorter Copy (All 4 Pages, All Screen Sizes)

**Problem:** Current subtitle is 3 lines on desktop and wraps to 4-5 lines on mobile. Too long.

**Rule:** The subtitle `<p>` tag below the H1 subheadline. Replace the full text per page with the shortened version below. Do not change the H1, badge strip, CTA buttons, or any other element.

**Per-page replacement:**

### Delhi
**Find:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. NASSCOM-certified course with 100% placement support at our Delhi centre.
```
**Replace with:**
```
SQL, Power BI, Python, and Generative AI — all in one NASSCOM-FutureSkills Prime certified programme. Classroom and online batches in Delhi.
```

### Noida
**Find:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. NASSCOM-certified course with 100% placement support at our Sector 15, Noida centre.
```
**Replace with:**
```
SQL, Power BI, Python, and Generative AI — all in one NASSCOM-FutureSkills Prime certified programme. Classroom and online batches in Noida.
```

### Gurgaon
**Find (visible in screenshot):**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, and AI-assisted analytics. Complete course with 100% placement support at our Sector 44, Gurgaon centre.
```
**Replace with:**
```
SQL, Power BI, Python, and Generative AI — all in one NASSCOM-FutureSkills Prime certified programme. Classroom and online batches in Gurgaon.
```

### Bangalore
**Find:**
```
Master Data Analytics with Generative AI. Learn SQL, Power BI, Python, Tableau, and AI-assisted analytics — tools that Bangalore's product companies, startups, and BFSI firms use every day. NASSCOM-FutureSkills Prime certified. Classroom training at HSR Layout.
```
**Replace with:**
```
SQL, Power BI, Python, and Generative AI — all in one NASSCOM-FutureSkills Prime certified programme. Classroom and online batches in Bangalore.
```

> Note: The Bangalore version drops the startup/BFSI framing from the subtitle — that framing is better placed in the persona cards and classroom card (already done in the master instructions) rather than the subtitle, which needs to stay scannable.

---

## Change B — Tools Section: Hide Description Text on Mobile (All 4 Pages)

**Problem:** On mobile, each tool card shows icon + title + 2-3 lines of description text. This makes every card ~300px tall, requiring excessive scrolling through the section.

**Fix:** Hide the description `<p>` tag inside each tool card on mobile. Icon and title remain. The card height drops to ~120px, making the section scannable without scrolling.

**Implementation:** Add the Tailwind class `hidden sm:block` to the description `<p>` element inside each tool card.

Find the description paragraph inside the tool card component. It currently has classes like:
```
text-[#4A6275] text-sm leading-relaxed text-center
```

Add `hidden sm:block` to that element:
```
hidden sm:block text-[#4A6275] text-sm leading-relaxed text-center
```

This hides the text on screens narrower than the `sm` breakpoint (640px) and shows it on tablet and desktop.

**Do not change:** icon, title, card border, card background, card sizing, or desktop layout. This is a mobile-only hide — one class addition per card.

**Verify:** On desktop, tool cards look identical to before. On mobile (< 640px viewport), tool cards show icon + title only, no description text.

---

## Change C — Curriculum: 2-Column Module Grid on Mobile (All 4 Pages)

**Problem:** Module cards stack in a single column on mobile (visible in screenshot). Each card is tall with a lot of whitespace, requiring excessive scroll through the curriculum.

**Fix:** Change the module grid to 2 columns on mobile. The odd module (last card in any section with an odd count) spans full width so it does not sit orphaned in the left column.

### Implementation

The module grid wrapper currently has classes like:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

Update to:
```
grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4
```

(i.e. change `grid-cols-1` to `grid-cols-2` — mobile becomes 2-col, tablet/desktop unchanged)

### Handling the odd module

**Core tab (7 modules):** Module 07 (Placement Readiness) is the last card and will sit orphaned in the left column of the 2-col mobile grid.

Add `col-span-2 sm:col-span-1` to Module 07's wrapper `<div>` to make it span the full width on mobile only:

```
col-span-2 sm:col-span-1
```

This centres Module 07 across the full row on mobile, then reverts to normal single-column span on tablet and above.

**AI-Integrated tab — Zone A (5 modules: 01-05):** Module 05 (Industry Analytics) is the odd one. Apply the same treatment:
```
col-span-2 sm:col-span-1
```
on Module 05's wrapper.

**AI-Integrated tab — Zone B (4 module cards: 05A, 05B, 05C, 07):** 4 is even — no odd-module handling needed. All 4 will sit in a clean 2x2 grid on mobile.

### Summary of col-span-2 additions

| Tab | Module | Class to add |
|---|---|---|
| Core | Module 07 — Placement Readiness | `col-span-2 sm:col-span-1` |
| AI-Integrated Zone A | Module 05 — Industry Analytics | `col-span-2 sm:col-span-1` |
| AI-Integrated Zone B | No odd module | No change needed |

### Do not change

Desktop and tablet grid layout. The `lg:grid-cols-4` and `sm:grid-cols-2` values stay exactly as they are. Only the mobile (`grid-cols-1` → `grid-cols-2`) value changes.

---

## Post-Change Verification

Check each page in a browser with responsive dev tools at 390px width (iPhone 14 viewport).

**Change A — Hero subtitle:**
- [ ] Subtitle is 1-2 lines on mobile (not 4-5)
- [ ] Subtitle contains "NASSCOM-FutureSkills Prime"
- [ ] Subtitle contains correct city name
- [ ] H1, badge strip, CTAs unchanged

**Change B — Tools section:**
- [ ] Mobile: tool cards show icon + title only — no description text
- [ ] Mobile: all 6 tool cards visible without excessive scroll
- [ ] Desktop (1280px): tool cards still show full description text
- [ ] Desktop layout of tools section is visually identical to before

**Change C — Curriculum:**
- [ ] Mobile: modules render in 2-column grid
- [ ] Mobile: Core tab — Module 07 spans full width (not orphaned in left column)
- [ ] Mobile: AI-Integrated Zone A — Module 05 spans full width
- [ ] Mobile: AI-Integrated Zone B — clean 2x2 grid
- [ ] Tablet (768px) and desktop: curriculum grid layout unchanged
- [ ] Toggle button still works on mobile
- [ ] Zone B teal background and card treatments visible on mobile

---

## Commit Message

```
fix(da-ai-pages): hero subtitle shortened, tools mobile text hidden, curriculum 2-col mobile grid

- Hero: subtitle reduced to 1-2 lines per city page
- Tools: description text hidden on mobile (sm:block) — icon + title only
- Curriculum: grid-cols-1 → grid-cols-2 on mobile; odd modules span full width
```
