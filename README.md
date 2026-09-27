# sketchfolio

A hand-drawn, sketchbook-style portfolio for **Azharul Islam**, a software engineer working across native Android, native iOS, Flutter, Go, SQL, PostgreSQL and SQLite.

The headings are written with pen strokes drawn as SVG paths, not a handwriting font. Every border has a bit of wobble on purpose.

## Features

- Handwritten lettering that draws itself, with a replay button
- Light/dark theme with a sun-to-moon sky transition
- An interactive mobile playground (Android / iOS / Flutter)
- A request-path architecture walkthrough
- Case-study pages that turn like paper
- A pencil portrait that reveals the original photo
- A letter you can draft, a safe terminal, and a sketch mode
- A paper plane that flies along with in-page navigation
- Reduced-motion support (follows the OS setting, with a manual toggle too)

No frameworks, no build step, no analytics, and no external requests.

## Run locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly in a browser also works.

## Structure

```
index.html   page markup
css/         styles, loaded in order (later files override earlier ones)
js/          plain scripts, loaded in order
assets/      portraits, illustrations, favicon and paper texture
```

The order of the CSS and JS files in `index.html` matters. Keep it when you add new files.

## Contact

[LinkedIn](https://www.linkedin.com/in/azharcse/)
