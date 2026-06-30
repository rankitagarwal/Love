# For Ria ❤️

A cute, premium, romantic single-page React website for Ria, designed for a Roka moment and built to host freely on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

## Build locally

```bash
npm run build
```

The production files are generated in `dist/`.

## Free GitHub Pages hosting

This repo already includes `.github/workflows/deploy.yml`, so it can deploy automatically to GitHub Pages.

1. Push this project to a GitHub repository.
2. In GitHub, open the repository settings.
3. Go to `Pages`.
4. Set `Build and deployment` source to `GitHub Actions`.
5. Push to the `main` branch.
6. After the workflow finishes, GitHub will publish it at your `github.io` URL.

Because Vite is configured with `base: "./"`, the website works on both:

- `https://yourname.github.io/repository-name/`
- `https://yourname.github.io/`

## Replace the celebration image

Replace `public/pikachu-placeholder.svg` with your own image or GIF, or update the image path in `src/App.jsx`.

Look for this comment:

```jsx
{/* PLACE CUSTOM IMAGE HERE */}
```
