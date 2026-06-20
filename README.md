# Vedant Kini's website

This folder is the local checkout of:

`https://github.com/vedantkini21/vedantkini21.github.io`

GitHub Pages publishes the website at:

`https://vedantkini21.github.io`

## Preview locally

Open `index.html` in a browser, or run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Add project images

Create image files inside `assets/images/`, then replace the corresponding placeholder in
`index.html` with:

```html
<div class="project-image">
  <img src="assets/images/your-image.jpg" alt="Describe the project image" />
</div>
```

Recommended image width: 900–1400 pixels.

## Publish changes

From this folder:

```powershell
git status
git add .
git commit -m "Update website"
git push
```

GitHub Pages will redeploy automatically after the push.
