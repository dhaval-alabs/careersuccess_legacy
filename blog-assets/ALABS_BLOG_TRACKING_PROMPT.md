# Prompt: Advanced Tracking Implementation for alabs-blog

This prompt is designed for the `alabs-blog` project to implement a high-resolution visitor tracking system based on the `alabs-lp` architecture.

> [!TIP]
> All the files mentioned in this prompt have been pre-prepared in the `/blog-assets` directory. You can share these directly with your developer.

---

## The Prompt

### Task: Implement Advanced First-Party Behavioral Tracking & CRM Integration

We need to implement a high-resolution visitor tracking system for the blog that mirrors the logic used in our main Landing Page (`alabs-lp`) but adds deep behavioral insights. The goal is to capture everything a visitor does and push it to the LeadSquared CRM "Additional Notes" section when they submit a lead.

#### Core Tracking Requirements:

1.  **Visitor Identity & Session**:
    *   Initialize a `session_id` on first visit and persist it in `sessionStorage`.
    *   Capture UTM parameters (`source`, `medium`, `campaign`, etc.) and the `gclid` using the pattern from `alabs-lp/utils/captureUtm.ts`.

2.  **Behavioral Analytics (The "Sensor" Layer)**:
    *   **Scroll Depth**: Track maximum scroll percentage reached.
    *   **Time on Page**: Accurate session duration tracking.
    *   **Section Engagement**: Use an `IntersectionObserver` to track which blog sections (H2/H3 areas) the user enters, how long they stay there, and the sequence of navigation (e.g., "Intro -> Curriculum -> Pricing").
    *   **TOC Usage**: Specifically log when a user interacts with the Table of Contents and which link they clicked.
    *   **Rage Clicks**: Detect "rage clicks" (3+ clicks within 500ms on the same element or area) and log them as a frustration signal.

3.  **The "Data Snapshot" Utility**:
    *   Create a utility `getAdvancedBehaviourSnapshot()` (extending the `trackBehaviour.ts` logic) that bundles all the above into a clean JSON object.
    *   Capture technical metadata: Device type, viewport width, browser info, and referrer.

4.  **Backend & CRM Integration**:
    *   In the Lead Submission Server Action (API call to `/api/submit-lead`), take the behavioral snapshot.
    *   **Consolidation**: Map all behavioral data into a human-readable string for the `mx_Extra_Notes` field in LeadSquared. Format it like this:
        ```text
        --- BLOG BEHAVIOR LOG ---
        Session ID: [id]
        TOC Used: Yes (Clicked: Section 3)
        Path: Intro > Section 1 > TOC > Section 3
        Rage Clicks: None
        Scroll Depth: 85%
        Time on Page: 145s
        Referrer: [url]
        ```

#### Implementation Reference (from `alabs-lp`):
*   **Client Initialization**: Use a `ClientInit` component to trigger UTM/Identity capture.
*   **Lead Form**: The `LeadCaptureForm` should pull the `behaviour` snapshot at the moment of submission (or at the moment of OTP request).
*   **API Route**: Use the `/api/submit-lead/route.ts` pattern to handle the LeadSquared payload, ensuring `Notes` and `mx_Extra_Notes` are populated with the consolidated summary.

**Next Steps**: 
Please audit the blog's `LeadCaptureForm` and create the `utils/trackAdvancedBehaviour.ts` logic to start logging these patterns immediately on page load.
