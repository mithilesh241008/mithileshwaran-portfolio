# Mithileshwaran.D — Personal Portfolio

My personal portfolio, built for the Coding Ninjas 10X SRM web development recruitment task.

I'm a first-year ECE student at SRM IST, Kattankulathur. I wanted this page to show the three things I actually spend my time on: building for the web, experimenting with AI automation, and art and design. It also links to projects I've built.

It's one page, written in plain HTML, CSS and JavaScript. No frameworks, no build step, no libraries.

## What's on the page

| Section | What it shows |
| --- | --- |
| 00 — Hero | Name, roles (Developer · Builder · Artist), portrait, college / course / year / city |
| 01 — Identity | A short bio and the basic facts |
| 02 — Practice | Build, Automate, Create: what each one means for me |
| 03 — Toolkit | Tools I use, things I'm exploring, and interests |
| 04 — Selected work | Akram Perfumes, SRM IST Canteen, CareLink AI and Arcus, with honest status labels |
| 05 — Connect | GitHub, LinkedIn, Instagram and email |

## Features

- Editorial layout on a 12-column CSS Grid, with Flexbox for smaller pieces
- Fluid type with `clamp()`. The hero name uses container query units (`cqi`) so it always fills exactly one line.
- Responsive at three sizes: desktop (≥1100px), tablet (700–1099px) and mobile (<700px). The mobile layout is rearranged, not just shrunk.
- Fixed top bar with a live Madurai clock and a nav link that highlights the current section
- Full-screen menu on mobile
- Accessible by default: skip link, semantic landmarks, one `h1`, visible focus styles, keyboard support for every interaction, and `prefers-reduced-motion` support
- Still readable with JavaScript turned off. Animation starting states only apply once JS adds a `js` class to `<html>`.

## Interactive details

- **Load sequence:** the name rises letter by letter, then the portrait, roles and details follow. It's all done in about a second.
- **Scroll reveals:** headings and rows fade up once as they enter the screen (`IntersectionObserver`).
- **Scroll-linked motion:** subtle portrait parallax, a band of text that slides as you scroll, and a progress rail with a `02 / 05` section counter. On phones the rail becomes a thin bar at the top.
- **Practice rows:** on hover or keyboard focus, the word shifts, an accent dot appears, a small CSS-only glyph animates, and the other rows fade back. On touch screens, the row in the middle of the screen becomes active.
- **Toolkit:** hovering a skill shows whether it belongs to Build, Automate or Create.
- **Portrait:** a slight zoom and pointer-follow on hover. Clicking opens the full, uncropped photo in a native `<dialog>` (Escape closes it).
- **Custom cursor:** a dot with a trailing ring that grows over links and turns into "View" over the portrait. Desktop mouse only; it turns itself off for touch and reduced motion.
- **Magnetic links:** the connect arrows, the Copy button and a few links lean slightly (up to 8px) towards the pointer.
- **Copy email:** copies the address and shows "Copied ✓" for two seconds, with a screen-reader announcement.

## Tech

- HTML5
- CSS3 (Grid, Flexbox, custom properties, container queries, `clamp()`, transitions and keyframes)
- Vanilla JavaScript (`IntersectionObserver`, `requestAnimationFrame`, Clipboard API, `Intl.DateTimeFormat`)
- One web font: [Inter Tight](https://fonts.google.com/specimen/Inter+Tight) from Google Fonts

Animations only use `transform` and `opacity` where possible. Scroll effects share one `requestAnimationFrame` update, and the cursor loop stops once the ring catches up with the pointer.

## Project structure

```
profile web /
├── index.html      page content and structure
├── style.css       design tokens, layout, components, motion, breakpoints
├── script.js       interactions (split into small named functions)
├── README.md
└── assets/
    └── profile.jpg
```

## Running it locally

You can open `index.html` directly in a browser. The clipboard API works best over `http://`, though, so a tiny local server is better:

```bash
cd "profile web "
python3 -m http.server 8000
```

Then open http://localhost:8000.

(The folder name ends with a space, so keep the quotes.)

## Deployment

It's a static site, so any static host works:

- **GitHub Pages:** push to a repository, then go to Settings → Pages and deploy from the `main` branch root.
- **Vercel / Netlify:** import the repository. No build command, and the output directory is the project root.

## Author

**Mithileshwaran.D**
First-year ECE (Core), SRM Institute of Science and Technology, Kattankulathur

- GitHub: https://github.com/mithilesh241008
- LinkedIn: https://www.linkedin.com/in/mithileshwaran-d-322497394/
- Instagram: https://www.instagram.com/mithil_eshwaran/
- Email: mithileshwaran.d@gmail.com
