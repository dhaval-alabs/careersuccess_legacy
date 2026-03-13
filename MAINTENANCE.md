# Maintenance & Design Guidelines

This document provides guidelines for maintaining the design integrity and layout of the AnalytixLabs Landing Page. Follow these specifications when updating content or adding new features.

## 1. Design System

### Color Palette
- **Primary (Green)**: `#1DE5B5` (Used for primary CTAs, accents, and highlights)
- **Secondary (Navy)**: `#09263F` (Used for text, backgrounds, and headers)
- **Translucency Rules**:
  - **StatsBar Backgrounds**: Use RGB with 50% opacity (e.g., `rgba(135, 240, 215, 0.5)`).
  - **Pricing Cards**: Always use `rgba(255, 255, 255, 0.7)` to maintain the translucent look over the background gradient.

### Typography
- **Headings**: Use **Outfit** (`var(--font-outfit)`) with `font-extrabold` and `tracking-tight`.
- **Body Text**: Use **Inter** or **DM Sans** for readability.
- **Micro-copy**: Typically uses 70-75% opacity of the text color for hierarchy.

## 2. Component Guidelines

### CTA Buttons (Primary)
All primary action buttons must be uniform.
- **Classes**: `px-8 py-4 rounded-xl text-base font-bold transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] active:scale-95`
- **Colors**: Background `#1DE5B5`, Text `#09263F`.
- **Exceptions**: Secondary buttons (like Phone) use Yellow `#FFEA79`.

### Pricing Section (`LearningModes.tsx`)
- **Ordering**: Keep cards sorted by price in **increasing order**.
- **Badges**: Use the uniform Blue (`#239bf5`) badge style for all tags (`tagColor: blue`).
- **Icons**: Ensure SVG icons follow the 44x44 viewBox pattern for consistent alignment.

### StatsBar (`StatsBar.tsx`)
- **Font Size**: Keep value font size limited to `clamp(2rem, 4vw, 2.5rem)` to prevent layout breaking on mobile.
- **Transitions**: Maintain the `useCountUp` hook for interactive entrance.

## 3. Layout Principles
- **Grid Layouts**: Use `max-w-5xl mx-auto` for section containers.
- **Responsive Design**: Always test with `grid-cols-1 md:grid-cols-2` or `md:grid-cols-3` to ensure stackability on mobile devices.
- **Pill Gradients**: Section sub-headers (pills) should use the specific `#e8f4fd` background with the teal/blue gradient text for the "Premium" feel.

## 4. Technical Maintenance
- **Server Actions**: When using `createLeadAction`, ensure absolute URLs are resolved using the host header helper to avoid "Internal Server Error" in production.
- **Environment Variables**: `NEXT_PUBLIC_APP_URL` should be set in production for fastest performance, but the fallback logic handles dynamic hosts.
