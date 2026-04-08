# Implementation Plan: UI Enhancements & CTA Diversification

Standardize the curriculum display, update module branding, and diversify call-to-action (CTA) button text across all landing pages to improve user engagement and clarity.

## User Review Required

> [!IMPORTANT]
> - The same eligibility modal will still open for all updated CTAs. Only the visible text is changing.
> - **Curriculum Tiers**: Reverting the Delhi page to v1 as requested.
> - **Module 11**: "Placement Readiness" will be rebranded to "Career Readiness" globally across all components.

## Proposed Changes

### [Component] Curriculum & Global Text Updates

#### [MODIFY] [CurriculumTiers.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/CurriculumTiers.tsx)
- Rename "Placement Readiness" to "Career Readiness".

#### [MODIFY] [CurriculumTiersV2.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/CurriculumTiersV2.tsx)
- Rename "Placement Readiness" to "Career Readiness".

#### [MODIFY] [CourseInfoSection.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/CourseInfoSection.tsx)
- Update label from "Placement Readiness" to "Career Readiness".

#### [MODIFY] [DetailedCurriculum.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/DetailedCurriculum.tsx)
- Update title to "Career Readiness (8 Weeks)".

#### [MODIFY] [FAQ.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/FAQ.tsx)
- Update answer text mentioning "Placement Readiness Programme" to "Career Readiness Programme".

---

### [Component] CTA Button Text Standardization (Global)

#### [MODIFY] [HowToEnrol.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/HowToEnrol.tsx)
- Change hardcoded button text from "Check Your Eligibility →" to "**Talk to a Learning Advisor →**".

#### [MODIFY] [BottomCTA.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/BottomCTA.tsx)
- Change hardcoded button text from "Check Your Eligibility →" to "**Reserve Your Spot →**".

---

### [Pages] City-Specific Landing Page Updates

#### [MODIFY] [Delhi Page](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-delhi/page.tsx)
- Revert import of `CurriculumTiers` from `CurriculumTiersV2` back to `CurriculumTiers`.
- **Career Assurance Section**: Change "Check Eligibility" to "**See If You Qualify →**".
- **Certificate Section**: Change "Check Your Eligibility →" to "**Get Started →**".

#### [MODIFY] [Other Pages](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-gurgaon/page.tsx) (Gurgaon, Noida, Bangalore, LG)
- **Career Assurance Section**: Change "Check Eligibility" to "**See If You Qualify →**".
- **Certificate Section**: Change "Check Your Eligibility →" to "**Get Started →**".

## Verification Plan

### Automated Checks
- Grep for "Placement Readiness" to ensure total elimination.
- Grep for "Check Your Eligibility" in sections 2 and 3 of all pages to ensure updates were applied.

### Manual Verification
- Visual inspection of the Delhi page to confirm v1 curriculum layout.
- Click-test of new buttons to ensure they still trigger the eligibility modal.
