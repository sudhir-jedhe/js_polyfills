Does not have a tag with width or initial-scale 

bookmark_border
Without a viewport meta tag, mobile devices render pages at typical desktop screen widths and then scale the pages down, making them difficult to read.

Setting the viewport meta tag lets you control the width and scaling of the viewport so that it's sized correctly on all devices.

How the Lighthouse viewport meta tag audit fails
Lighthouse flags pages without a viewport meta tag:

Lighthouse audit shows page is missing a viewport
A page fails the audit unless all of these conditions are met: - The document's <head> contains a <meta name="viewport"> tag. - The viewport meta tag contains a content attribute. - The content attribute's value includes the text width=.

How to add a viewport meta tag
Add a viewport <meta> tag with the appropriate key-value pairs to the <head> of your page:


<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …
Here's what each key-value pair does: - width=device-width sets the width of the viewport to the width of the device. - initial-scale=1 sets the initial zoom level when the user visits the page.

Initial-scale of less than 1
Where the initial-scale is set to less than 1, this can cause browsers to enable a double tap to zoom feature, typically used for desktop sites that are not mobile optimized. This adds a 300 millisecond delay to any tap interactions while the browser waits to check if a second "double" tap happens. The audit therefore also fails when the initial-scale is set to less than 1.