# Vedant Kini's website

This folder is the local checkout of:

`https://github.com/vedantkini21/vedantkini21.github.io`

GitHub Pages publishes the website at:

`https://vedantkini21.github.io`

## Preview locally

The most reliable preview method is to run a local server from this folder:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

You can also open `index.html` directly, but browser security settings can occasionally block
local assets when a site is opened through a `file://` address.

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

If the website briefly shows an error immediately after a push, wait a minute and refresh.
GitHub Pages can take a short time to finish deploying the new commit.
