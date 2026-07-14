# ArivuPMO — Landing Page Redesign

Single-file React component: **`LandingPage.jsx`**

## Live preview
https://anirudhatalmale6-alt.github.io/arivupmo-landing/

## Drop-in usage

```jsx
import LandingPage from './LandingPage';

export default function App() {
  return <LandingPage />;
}
```

## Notes
- **Zero dependencies.** React only — no Tailwind, no styled-components, no icon library, no chart library.
- All CSS is scoped under the `.lp` root class and injected by the component, so it cannot leak into or collide with the rest of the app.
- Fonts (Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono) load from Google Fonts via `@import`.
- All existing site copy is preserved verbatim — all 28 features, 6 roles, admin, why-us, training, settings, CTA and footer.
- Hero product window auto-rotates Gantt → RAID → Scrum → EVM; the sidebar highlights the active screen. Hover pauses it; the dots below let you jump between screens.
- Fully responsive (desktop / tablet / mobile) and honours `prefers-reduced-motion`.
