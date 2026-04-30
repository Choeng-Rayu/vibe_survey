---
name: "Survey Frontend"
description: "Skill to guide creation of Survey Frontend with Soft Luxury design"
agent: code
model: anthropic/claude-sonnet
---

# Concept 02 — Soft Luxury SaaS Product

## What Kind of Website Is This?
This is a **software product (SaaS) landing page**. SaaS stands for "Software as a Service" — it means a web-based app that people pay monthly to use (like Notion, Figma, or Spotify). This design style is used by premium, well-funded products that want to feel trustworthy, modern, and slightly expensive. Visitors come to understand what the product does and sign up for a free trial.

---

## Visual Style: Warm Luxury Minimal

Imagine walking into a very expensive, quiet hotel lobby. Everything is cream-colored. The furniture is low and wide. Nothing shouts. The quality speaks for itself. This is the digital version of that feeling. It is minimal but warm — not cold like a tech company, not loud like an agency.

**Mood:** High-end calm. Like a perfume advertisement that never tells you what the perfume smells like.

---

## Primary Color Guide

### Main Color: Warm Sage Green
```
HEX: #7C9E8A
RGB: 124, 158, 138
```
Sage green is a desaturated, earthy green. It feels natural, premium, and calming — not corporate. It is the perfect primary because it reads as "quality" without being aggressive. It works beautifully against cream backgrounds.

**Where to use it:**
- CTA buttons (primary action)
- Active navigation indicator
- Icon accents and decorative lines
- Hover borders on cards

### Supporting Colors
```
Background:      #FAF7F2  (warm cream — the main page background)
Text primary:    #1C1C1A  (warm near-black — all headings)
Text secondary:  #6B6860  (warm grey — body copy and labels)
Card surface:    #F2EDE5  (slightly darker cream — for card backgrounds)
Accent warm:     #C4956A  (terracotta bronze — used sparingly for highlights)
```

### What Color to Avoid
Avoid pure white (#FFFFFF) — it is too cold for this palette. Avoid blue completely. Avoid neon or highly saturated colors. The entire palette should feel like it could be printed on thick, uncoated paper.

---

## Typography

- **Headline font:** `Cormorant Garamond` — elegant serif, feels editorial and expensive
- **Body font:** `DM Sans` — clean, friendly, modern sans-serif
- Headlines at medium weight (500–600), never ultra-bold. The elegance comes from size, not weight.
- Large amounts of whitespace between sections — at least 120px padding vertically.

---

## Layout Rules

1. **Very generous whitespace.** Sections should breathe. Nothing feels crowded.
2. **Rounded corners everywhere** — 16px to 24px on cards and buttons.
3. **Soft, barely-visible borders** — 1px, the color slightly darker than the background.
4. **No harsh shadows.** If using shadows, they must be warm-tinted and very subtle.
5. **Images are warm-filtered** or shown as illustrations — no cold photography.
6. **Feature sections alternate:** text left / image right, then image left / text right.

---

## Sections to Build

1. **Hero** — Centered headline, one-line subtext, email signup field + CTA button
2. **Social proof bar** — Logos of companies using the product (greyscale)
3. **Features** — 3 alternating rows with icon, headline, and description
4. **Pricing** — 3 cards: Free / Pro / Team. Pro card highlighted in sage green.
5. **Testimonials** — 3 quote cards in a row
6. **Footer CTA** — "Start for free today" with email input

---

## How to Implement (Step by Step)

1. Replace `:root` CSS variables with:
   ```css
   --bg:        #FAF7F2;
   --surface:   #F2EDE5;
   --primary:   #7C9E8A;
   --primary-h: #6A8C78;
   --text:      #1C1C1A;
   --muted:     #6B6860;
   --accent:    #C4956A;
   ```
2. Set `body { background: var(--bg); color: var(--text); }`.
3. Change all `border-radius` to `16px` on cards, `999px` on buttons (pill shape).
4. Import `Cormorant Garamond` for headings and `DM Sans` for body from Google Fonts.
5. Replace hero graph SVG with a soft illustration or a blurred product screenshot mockup.
6. Remove the dark background. The page is light cream throughout.
7. Add `letter-spacing: -0.02em` to all headings for a refined, tight feel.

---

## Inspiration Keywords (for searching references)
`premium SaaS landing page`, `Notion website design`, `Linear app website`, `warm minimal product page`
