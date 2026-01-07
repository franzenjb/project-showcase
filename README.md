# Project Showcase

Master portfolio showcasing 100+ live projects across multiple platforms.

## Live Site
**https://project-showcase-snowy.vercel.app/**

---

## Claude Code CLI: Managing Two Showcases

This user manages **TWO separate portfolio showcases** from Claude Code:

### 1. Vercel Showcase (This Repo)
- **Path:** `/Users/jefffranzen/project-showcase`
- **Live URL:** https://project-showcase-snowy.vercel.app/
- **Tech:** React + Vite
- **Data file:** `src/projects.json`
- **Deploy:** `npm run build && vercel --prod`

### 2. Portfolio Showcase (GitHub Pages)
- **Path:** `/Users/jefffranzen/portfolio-showcase`
- **Live URL:** https://franzenjb.github.io/portfolio-showcase/
- **Tech:** Vanilla HTML/JS (single index.html)
- **Data:** Projects array inside `index.html`
- **Deploy:** `git add . && git commit -m "message" && git push`

### Quick Reference for Claude Code
- "Add to Vercel showcase" → Edit `/Users/jefffranzen/project-showcase/src/projects.json`
- "Add to portfolio showcase" → Edit `/Users/jefffranzen/portfolio-showcase/index.html`
- "Deploy Vercel" → Run build and vercel --prod in project-showcase
- "Deploy GitHub Pages" → Git push in portfolio-showcase

---

## Features

- **Multi-Platform Support**: Vercel, GitHub Pages, AI Studio, Opal, Netlify
- **Smart Filtering**: Filter by platform, tags, and search
- **Star Ratings**: Rate and sort projects (persisted in localStorage)
- **Dark Mode**: Toggle between light and dark themes
- **Grid/List Views**: Switch between card gallery and compact list
- **25+ Tags**: ArcGIS, AI, Red Cross, Disaster, Climate, Data, and more

## Tech Stack

- React + Vite
- CSS Grid/Flexbox
- LocalStorage for preferences
- Deployed on Vercel

## Project Categories

| Platform | Description |
|----------|-------------|
| Vercel | Production web applications |
| GitHub Pages | Static sites and tools |
| AI Studio | Google AI Studio apps |
| Opal | Google Opal applications |
| Netlify | Netlify-hosted sites |

## Default Sort

Projects are sorted by **Rating High-Low** by default, making it easy to find top-rated tools first.

## Local Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
vercel --prod
```

## Author

Jeff Franzen - American Red Cross GIS & Emergency Response Solutions
