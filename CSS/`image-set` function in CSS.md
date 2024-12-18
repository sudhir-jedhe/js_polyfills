The `image-set` function in CSS is used to provide multiple image sources for different display conditions, such as varying screen resolutions. It is particularly useful for responsive images, allowing the browser to select the most appropriate image based on the device's resolution or display density (e.g., retina displays).

### Syntax of `image-set`:

```css
image-set(url1 size1, url2 size2, ...)
```

- **url**: The path to the image file.
- **size**: Specifies the pixel density (usually in `x`), indicating the resolution at which the image should be used (e.g., `1x`, `2x`, `3x`).

### Example Usage:

```css
background-image: image-set(
  url('image-1x.jpg') 1x,
  url('image-2x.jpg') 2x,
  url('image-3x.jpg') 3x
);
```

### Explanation:
- The browser will first attempt to load `image-2x.jpg` for devices with a screen resolution of 2x (like most modern smartphones with Retina displays).
- For standard displays (1x), it will use `image-1x.jpg`.
- For devices with higher resolutions (e.g., 3x screens), it will use `image-3x.jpg`.

### Common Use Cases:
1. **Responsive Images**: You can use `image-set` to specify different images for various screen densities.
   
2. **Icons**: For websites using icons, you can provide different image files for different display densities (1x, 2x, 3x).

### Full Example:

```css
.icon {
  background-image: image-set(
    url('icon-1x.png') 1x,
    url('icon-2x.png') 2x,
    url('icon-3x.png') 3x
  );
  width: 50px;
  height: 50px;
}
```

### Browser Support:
- **`image-set`** has broad support in modern browsers but is not as widely supported as the more common `srcset` attribute for responsive images in HTML. However, `image-set` can be useful in CSS for background images.

### Notes:
- The `image-set` function can be used in CSS properties such as `background-image` and `list-style-image`.
- For HTML `<img>` tags, you would typically use the `srcset` attribute instead of `image-set`.

### Conclusion:
The `image-set` function in CSS allows you to specify different image resolutions for different display conditions, improving the visual quality of images on high-density screens without unnecessarily loading larger images on standard screens.