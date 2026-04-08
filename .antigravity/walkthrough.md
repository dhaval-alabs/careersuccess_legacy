# Walkthrough: UI Enhancements & CTA Diversification

Successfully implemented branding updates, reverted curriculum layouts, and diversified call-to-action (CTA) button labels across the entire landing page suite.

## 1. Branding: "Placement" to "Career" Readiness
Replaced all occurrences of "Placement Readiness" with "**Career Readiness**" to better reflect the programme's value proposition.
- **Affected Components**: `CurriculumTiers`, `CurriculumTiersV2`, `CourseInfoSection`, `DetailedCurriculum`, `FAQ`.
- **Affected Pages**: All 5 city-specific and global landing pages.

## 2. Delhi Page Curriculum Revert
As requested, the Delhi landing page has been switched back to the **Version 1** curriculum layout.
- **File**: `app/data-science-ai-course-delhi/page.tsx`
- **Change**: Imported `CurriculumTiers` from `../../components/CurriculumTiers` instead of `CurriculumTiersV2`.

## 3. CTA Button Diversification
Diversified the repetitive "Check Your Eligibility" text with section-appropriate labels. All buttons still correctly open the eligibility modal.

| Section | New Button Text | Scope |
| :--- | :--- | :--- |
| **Career Assurance** | `See If You Qualify →` | All 5 Pages |
| **Certificate Section** | `Get Started →` | All 5 Pages |
| **How to Enrol** | `Talk to a Learning Advisor →` | Shared Component |
| **Bottom CTA** | `Reserve Your Spot →` | Shared Component |

> [!NOTE]
> **What stayed the same:**
> - Hero Section CTA: "Check Your Eligibility →"
> - Sticky Footer CTA: "Check Eligibility"
> - Tracking Logic: `ctaSource`, `fireConversion`, and CRM mappings remain unchanged.

## 4. Verification
- **Visual Audit**: Confirmed the Delhi page now displays the V1 curriculum.
- **Consistency Check**: Verified that no "Placement Readiness" strings remain in the components or page files.
- **Formatting**: Fixed a minor formatting issue in the LeadGen page button code to ensure clean rendering.
