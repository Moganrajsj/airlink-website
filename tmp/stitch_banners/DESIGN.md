# Design System Document

## 1. Overview & Creative North Star: "The Kinetic Stream"

This design system is engineered to move beyond the static, "utility company" aesthetic. For a broadband provider, the visual language must embody **The Kinetic Stream**: an experience that feels instantaneous, frictionless, and premium. 

We reject the rigid, boxed-in layouts of traditional web design. Instead, we embrace a **High-End Editorial** approach characterized by intentional asymmetry, vast breathing room, and "Glassmorphism" to simulate the transparency and speed of fiber-optic data. The system prioritizes tonal depth over structural lines, creating a digital environment that feels sophisticated, reliable, and invisible—much like the high-speed connectivity it represents.

---

## 2. Colors & Tonal Architecture

Our palette transitions from the deep, authoritative foundations of `#0A192F` to the energetic clarity of `#FBBF24`. 

### The "No-Line" Rule
**Designers are strictly prohibited from using 1px solid borders to define sections.** Boundaries must be established through:
- **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
- **Tonal Transitions:** Using subtle shifts in the neutral scale to signal a change in content context.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent layers. 
- Use `surface-container-lowest` (#ffffff) for the most elevated, actionable cards.
- Place these cards on a `surface-container-low` (#f2f4f6) or `surface` (#f8f9fb) base.
- This "nested" depth creates a natural hierarchy that guides the eye without the "noise" of traditional grids.

### The Glass & Gradient Rule
To achieve a signature look, utilize **Glassmorphism** for floating UI elements (like navigation bars or hovering action cards). 
- Use semi-transparent `surface` colors with a `backdrop-blur` (12px–20px).
- **Signature Gradients:** Apply a linear gradient from `primary` (#795900) to `primary-container` (#fbbf24) for Hero CTAs. This creates a "glow" effect, suggesting the pulse of live data.

---

## 3. Typography: Editorial Authority

The typography system pairs the technical precision of **Inter** with the geometric friendliness of **Poppins** to balance "High-Tech" with "High-Touch."

*   **Display & Headlines (Inter):** High-contrast sizing is mandatory. Large `display-lg` (3.5rem) headers should use tight letter-spacing (-0.02em) to feel impactful and "headline" driven.
*   **Body & Labels (Inter):** Focused on legibility. Use `body-lg` (1rem) for general information to ensure the interface feels airy and accessible.
*   **The Power of Weight:** Use bold weights for `title-lg` to create clear anchors in the layout. Inter’s neutrality allows the vibrant `primary` color to act as the primary "voice" of the brand.

---

## 4. Elevation & Depth: Tonal Layering

Shadows and borders are crutches; tonal layering is craftsmanship.

*   **The Layering Principle:** Depth is achieved by stacking the `surface-container` tiers. A `surface-container-lowest` card sitting on a `surface-container-high` section creates a sophisticated, soft lift.
*   **Ambient Shadows:** If a floating effect is required (e.g., a modal), use a "Sunken Shadow": 
    *   **Blur:** 40px–60px.
    *   **Opacity:** 4%–8%.
    *   **Color:** Use a tinted version of `on-surface` (#191c1e) to avoid "muddy" grey shadows.
*   **The "Ghost Border" Fallback:** If a container needs more definition, use a `1px` stroke of `outline-variant` at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism Depth:** For high-speed indicators or "Plan Comparison" cards, use `surface-container-lowest` at 70% opacity with a heavy blur. This makes the UI feel integrated into the background, not "pasted" on top.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary-container`) with `on-primary` text. Use `xl` (0.75rem) or `full` (9999px) roundedness to suggest fluid movement.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. No background, `on-surface` text, becomes `primary` on hover with a subtle underline.

### Cards & Lists
*   **The Rule of Zero Lines:** Forbid the use of divider lines. Separate items using `spacing-6` (1.5rem) or by alternating background tones (e.g., `surface` to `surface-container-low`).
*   **Interactive Cards:** Should "lift" on hover by transitioning from `surface-container-low` to `surface-container-lowest` and increasing the Ambient Shadow spread.

### Input Fields
*   **Modern State:** Use a `surface-container-highest` fill with a `Ghost Border`. Upon focus, the border transitions to a 2px `primary` underline or a subtle `primary` glow.

### Speed Indicators (App Specific)
*   **The Kinetic Meter:** Use a large `display-lg` font for the speed number (e.g., "500") paired with a `label-md` for the unit ("Mbps"). Use a `primary` to `secondary` gradient arc to visualize bandwidth.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. A text block on the left balanced by a floating "Glass" card on the right creates a premium, bespoke feel.
*   **Do** lean into white space. Use `spacing-20` (5rem) between major sections to let the brand "breathe."
*   **Do** use the `primary` yellow (#FBBF24) sparingly for "Moment of Delight" elements—icon accents, toggle states, and CTA highlights.

### Don’t
*   **Don’t** use 1px solid black or dark grey borders. They break the fluid "Kinetic Stream" aesthetic.
*   **Don’t** use standard "Drop Shadows" from default software settings. They feel dated and heavy.
*   **Don’t** crowd the interface. If a screen feels busy, increase the background-color-stepping (tonal layering) rather than adding more boxes or lines.
*   **Don’t** use pure black (#000000). Always use `on-surface` (#191c1e) or `secondary-fixed` (#0d1c32) to maintain the premium navy depth.