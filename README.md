# Swastika Khatua — AI/ML Engineer Portfolio

Dark neural-themed portfolio: animated plexus background, Three.js neural globe, scroll reveals, and animated skill bars. Plain HTML + CSS + JS — no build step.

## Structure

```
index.html        # all content & structure
css/style.css     # theme, layout, animations, responsive rules
js/main.js        # plexus background, Three.js globe, reveals, contact form
assets/
  Swastika_Khatua_Resume.pdf  # resume
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
npx serve .
```

## Deploy on GitHub Pages

1. Push this folder to a repo (e.g. `Swastika-prog.github.io` or any repo).
2. Repo → Settings → Pages → Source: `main` branch, `/ (root)`.
3. Done — the site is live at your Pages URL.

## Customizing

- **Globe color** — `GLOBE_COLOR` at the top of `js/main.js`.
- **Theme colors** — CSS variables in `:root` of `css/style.css`.
- **Skill chips** — `.skill-chips` lists in `index.html`.
- **Content** — everything is plain HTML in `index.html`.
