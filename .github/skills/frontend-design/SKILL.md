---
name: frontend-design
description: "Use when designing or refactoring premium SaaS landing pages, marketing websites, hero sections, pricing tables, testimonial blocks, and soft luxury product pages. Applies a warm minimal visual system with cream backgrounds, sage green accents, elegant serif headlines, and generous whitespace."
argument-hint: "design a premium SaaS landing page"
---

# Frontend Design

## When To Use
Use this skill for frontend work that needs a polished, premium landing-page feel, especially SaaS marketing pages. It is tuned for warm luxury minimal layouts, with calm editorial spacing and a soft, trustworthy visual tone.

## Core Style Direction
- Build around a warm, cream-first palette.
- Use sage green as the primary action color.
- Keep the page quiet, elegant, and expensive-looking rather than loud or technical.
- Prefer soft surfaces, subtle borders, and nearly invisible shadows.
- Avoid pure white, neon accents, saturated blues, and heavy contrast.

## Design Tokens
Set the page variables first:
- `--bg: #FAF7F2`
- `--surface: #F2EDE5`
- `--primary: #7C9E8A`
- `--primary-h: #6A8C78`
- `--text: #1C1C1A`
- `--muted: #6B6860`
- `--accent: #C4956A`

Apply them consistently:
- Page background should use `--bg`.
- Card surfaces should use `--surface`.
- Primary buttons and active indicators should use `--primary`.
- Hover states should deepen toward `--primary-h`.
- Use `--accent` only for restrained highlights.

## Typography
- Use `Cormorant Garamond` for headlines.
- Use `DM Sans` for body text and UI labels.
- Headlines should feel refined through size and spacing, not heavy weight.
- Add `letter-spacing: -0.02em` to headings.
- Keep body copy clean, readable, and understated.

## Layout Rules
1. Use very generous vertical spacing, usually 120px or more between major sections.
2. Keep corners rounded: 16px on cards, 999px on pill buttons.
3. Use 1px borders that are slightly darker than the background.
4. Keep shadows warm and minimal if used at all.
5. Prefer centered hero layouts for landing pages.
6. Alternate feature rows left/right to keep the page visually alive.
7. Avoid crowded compositions; let whitespace do most of the work.

## Section Recipe
When building a landing page, prefer this order:
1. Hero with centered headline, short subtext, email field, and primary CTA.
2. Social proof bar with muted greyscale logos.
3. Three alternating feature rows with icon, headline, and description.
4. Three pricing cards, with the middle plan highlighted in sage green.
5. Three testimonial cards in a row.
6. Footer CTA with a final email field and clear signup action.

## Implementation Checklist
1. Replace default root colors with the warm palette.
2. Set `body` to the cream background and near-black text.
3. Import the two fonts before styling content.
4. Remove dark backgrounds and cold visual treatments.
5. Replace hard-edged SVGs or charts with soft illustrations or blurred product mockups.
6. Style primary actions as pills and secondary actions as subtle outlined controls.
7. Ensure all cards and sections feel cohesive with the same radius, border, and spacing system.

## Component Guidance
- Hero: Keep the copy short, confident, and centered.
- Logos: Use muted monochrome treatment so they support the design rather than compete with it.
- Features: Pair compact icons with short, benefit-oriented descriptions.
- Pricing: Make the Pro card feel selected without becoming loud.
- Testimonials: Use simple quote cards with restrained emphasis.
- Footer CTA: Repeat the primary conversion action with minimal friction.

## Quality Bar
Before finishing, check that the page feels:
- warm rather than cold
- minimal rather than empty
- premium rather than generic
- calm rather than loud
- intentional rather than templated

## Guardrails
- Do not use pure white backgrounds.
- Do not use blue as a primary brand color.
- Do not use oversized shadows or glossy effects.
- Do not make headlines heavy or aggressive.
- Do not crowd sections or compress spacing.

## Reuse Pattern
Adapt this style to the existing project structure, components, and framework conventions. Keep the visual language consistent, but do not force the same markup if a cleaner local component pattern already exists.
