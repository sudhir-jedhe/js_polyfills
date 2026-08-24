# Snippet: `aspect-ratio` for Responsive Media

```html
<div class="video-wrapper">
  <iframe src="https://example.com/embed" title="Demo video"></iframe>
</div>
<img class="avatar" src="user.jpg" alt="" />
<div class="thumbnail" style="background-image: url(photo.jpg)"></div>
```

```css
.video-wrapper {
  aspect-ratio: 16 / 9;
  width: 100%;
}
.video-wrapper iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.avatar {
  aspect-ratio: 1;       /* 1/1 — keeps it square/circular regardless of intrinsic image dimensions */
  width: 56px;
  border-radius: 50%;
  object-fit: cover;      /* crops to fill the square without distortion */
}

.thumbnail {
  aspect-ratio: 4 / 3;
  width: 100%;
  background-size: cover;
  background-position: center;
}
```

`object-fit: cover` paired with `aspect-ratio` is the modern replacement for manually cropping images to a fixed ratio server-side — the box stays a locked 1:1 (or 4:3, or 16:9) ratio at any width, and the image content is cropped, not stretched, to fill it.
