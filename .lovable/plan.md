
# Light/Dark Theme Toggle

Token-only theme swap. Images, fonts, layout untouched. Accent slightly deepened in light mode for better contrast on white.

## Changes

**1. `src/styles.css`**
- Keep current `:root` dark tokens as default
- Add `.light` class block overriding the same CSS variables:
  - `--background`: near-white warm (`oklch(0.98 0.005 60)`)
  - `--surface`: `oklch(0.95 0.006 60)`
  - `--ink`: deep charcoal (`oklch(0.18 0.01 30)`)
  - `--ink-dim` / `--ink-mute`: mid grays
  - `--line` / `--line-soft`: light warm grays
  - `--accent`: deeper red `oklch(0.52 0.22 25)` (Option B — darker than dark-mode's 0.62 for AA contrast on white)
  - `--accent-dim`: `oklch(0.42 0.18 25)`
- Mirror shadcn fallback tokens so cards/popovers/buttons follow

**2. `src/store/content.ts`**
- Add `theme: 'dark' | 'light'` to store state (default `'dark'`)
- Add `setTheme(t)` and `toggleTheme()` actions
- Persist via `localStorage` key `mq-theme` (read on store init)
- On change, toggle `.light` class on `document.documentElement`

**3. `src/routes/__root.tsx`**
- Inject inline `<script>` in `<head>` (via `head().scripts`) that reads `localStorage.mq-theme` and adds `light` class to `<html>` before hydration — prevents flash on light-mode reloads

**4. Toggle button**
- Add small icon button (Sun / Moon from `lucide-react`) in the header nav of `src/routes/index.tsx`
- Place next to existing nav links, uses `accent` on hover, hairline border to match site language
- Calls `useContent(s => s.toggleTheme)()`

## What stays unchanged
- All images (hero, blog, projects) — photos work on both backgrounds
- Cormorant Garamond + JetBrains Mono fonts
- Layout, spacing, corner marks, hairlines, dotted dividers
- Every component — they already consume tokens, no `text-white`/`bg-black` rewrites

## Files
- edit `src/styles.css`
- edit `src/store/content.ts`
- edit `src/routes/__root.tsx`
- edit `src/routes/index.tsx`
