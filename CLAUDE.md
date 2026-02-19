# Homes

A visual essay exploring where people live. Built as a full-screen, scroll-driven photo feed with animated captions and an image modal.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `"use client"` components)
- **Styling**: Tailwind CSS v4 (PostCSS), OKLCH color tokens
- **UI**: shadcn (Button only), lucide-react icons
- **Images**: Next.js `<Image>` with `picsum.photos` placeholders

## Project Structure

```
src/
  app/
    page.tsx           — Main feed: image list, scroll buttons, modal state
    layout.tsx         — Root layout with Geist fonts
    globals.css        — Tailwind imports, OKLCH theme tokens
  components/
    image-card.tsx     — Viewport-height card with fade-in + typewriter caption
    image-modal.tsx    — Fullscreen modal with scale animation + caption replay
    scroll-button.tsx  — Glassy up/down nav buttons
    ui/button.tsx      — shadcn Button
```

## Current Features

- Full-viewport-height image cards with intersection-observer fade-in
- Typewriter caption animation (30ms/char, triggers on scroll visibility)
- Click-to-open modal with scale + blur + typewriter replay
- Glassy scroll-up/down buttons that hide at boundaries
- Glassy X close button on modal with fade animation

## Design Improvements Plan

### Phase 1 — Narrative Structure ✓
- [x] **Title card**: Full-screen opening with essay title, subtitle, and a scroll prompt
- [x] **Unique captions**: Replace lorem ipsum with real or realistic captions per image (each should feel like a sentence from an essay)
- [x] **Closing card**: Final screen with a concluding thought or credit

### Phase 2 — Typography & Polish
- [ ] **Serif font for captions**: Swap monospace for a serif (e.g. Playfair Display or Lora) to feel more editorial
- [ ] **Caption positioning variety**: Alternate caption placement (bottom-left, top-right, centered) to break visual monotony
- [ ] **Image number / progress**: Subtle "3 / 12" counter so readers know where they are

### Phase 3 — Layout Variety
- [ ] **Mixed layouts**: Not every card needs to be the same — some images could bleed full-width, some could be smaller with more text
- [ ] **Parallax or subtle scroll effects**: Slight vertical parallax on images as you scroll past
- [ ] **Transition between cards**: Crossfade or staggered entrance instead of uniform fade

### Phase 4 — Real Content
- [ ] Replace picsum placeholders with actual photos of homes
- [ ] Write the real essay text as captions
- [ ] Tune image aspect ratios per photo (not all 1200x800)

## Commands

```bash
bun dev        # Start dev server
bun run build  # Production build
bun run lint   # ESLint
```
