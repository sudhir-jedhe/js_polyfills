### 1. **Best Approaches to Reduce HTTP Requests on a Webpage:**
Reducing HTTP requests is a key factor in improving web performance. Here are some effective strategies to achieve that:

- **Combine and Minify CSS and JS Files:** 
  - Combining CSS and JS files reduces the number of HTTP requests. Minification removes unnecessary characters, like spaces and comments, which reduces file sizes.
  
- **Use Image Sprites:**
  - Combine multiple small images (e.g., icons) into a single image, which reduces the number of requests. CSS background-image can then be used to display the individual sections of the sprite.
  
- **Lazy Loading of Images & Videos:**
  - Load images and videos only when they are about to be displayed in the viewport. This reduces initial page load time and resource consumption.
  
- **Use a Content Delivery Network (CDN):**
  - Distribute content like images, videos, and static files through a CDN to serve assets from locations geographically closer to the user, reducing latency and HTTP requests to your main server.

- **Implement Browser Caching:**
  - Use caching to store static files (CSS, JS, images) on the user's device so they don't need to be downloaded again on subsequent visits.

- **Use Inline CSS and JS for Critical Resources:**
  - Place critical CSS and JS directly in the HTML to avoid additional HTTP requests for those resources during page load. This is especially important for the "above-the-fold" content.
  
- **Use Data URLs:**
  - Instead of requesting external images or files, you can embed them directly into the HTML or CSS using Base64 encoded data URIs. This reduces HTTP requests but may increase the size of the document.

### 2. **Optimizing Performance When Certain Web Metrics Need Improvement:**
In addition to the above-mentioned strategies, optimizing for specific metrics involves:

- **Reduce File Size & Page Size:**
  - Compress images (e.g., using WebP format), minify CSS and JavaScript files, and ensure HTML is also compressed using Gzip or Brotli compression.
  
- **Optimize Images by Retaining Quality:**
  - Use modern image formats like WebP for high-quality and smaller file sizes. Tools like ImageOptim or Squoosh can help achieve this without losing quality.

- **Prioritize Loading Content:**
  - Load critical content first, such as the "hero section" or "above-the-fold" content, to improve **Largest Contentful Paint (LCP)** and **Time to Interactive (TTI)**.

- **Asynchronous Loading for Non-Critical Content:**
  - Load less critical resources (such as third-party scripts or lower-priority images) asynchronously to avoid blocking the rendering of important content.

### 3. **Measuring Website Performance:**
To measure and monitor website performance, various tools are available:

- **Chrome Developer Tools (Network, Audit Tools, Profiling, Lighthouse):**
  - Provides in-depth performance analysis, including network requests, page load times, JavaScript profiling, and audits based on best practices.

- **Third-Party Tools:**
  - **GTMetrix:** Provides insights into load time, page performance scores, and recommendations for improvement.
  - **PageSpeed Insights:** Offers performance reports based on Google’s Lighthouse tool, providing detailed insights into performance and recommendations.
  - **WebPageTest:** Provides advanced performance testing including the ability to test from multiple locations and devices.
  - **Sitespeed.io:** An open-source tool for measuring and analyzing web performance metrics.
  - **Real User Monitoring (RUM):** Collects data on real users' experiences to measure the actual performance of the site.

### 4. **Core Performance Web Vitals:**
Web Vitals are key metrics to measure the quality of user experience. Core Web Vitals include:

- **Largest Contentful Paint (LCP):**
  - Measures how long it takes for the largest content element (e.g., an image, video, or text block) to become visible within the viewport. A good LCP score is under 2.5 seconds.
  
- **First Input Delay (FID):**
  - Measures the time it takes from the first user interaction (click, tap, etc.) until the browser responds to it. A good FID score is under 100 milliseconds.
  
- **Cumulative Layout Shift (CLS):**
  - Measures the visual stability of a page, calculating how much the content shifts around while the page is loading. A CLS score of less than 0.1 is considered good.

### 5. **Non-Core Performance Web Vitals:**
These are other important metrics that affect performance but are not part of the Core Web Vitals:

- **Time to First Byte (TTFB):**
  - Measures how long it takes for the first byte of a response to be received from the server. Lower TTFB indicates faster server response time.

- **Speed Index:**
  - Measures how quickly the contents of a page are visually displayed during page load. The lower the Speed Index, the better.

- **Time to Interactive (TTI):**
  - Measures how long it takes for the page to become fully interactive (i.e., all resources have loaded, and the page is responsive to user input).

- **Total Blocking Time (TBT):**
  - Measures the amount of time between FCP and TTI during which the main thread is blocked and unable to respond to user input.

- **First Contentful Paint (FCP):**
  - Measures the time it takes for the first text or image content to appear on the screen. Faster FCP means the page starts rendering faster.

- **First Meaningful Paint (FMP):**
  - Measures when the most important content (e.g., text or images) becomes visible to the user. It helps track how quickly the user sees usable content.

- **Last Meaningful Paint (LMP):**
  - Measures when the last piece of meaningful content is rendered, typically used for SPAs to track when the page is considered fully loaded.

### 6. **Impact of Placing JS Files `<script>` Tags in the Body Tag:**
Placing `<script>` tags inside the body can negatively affect web performance:

- **Blocking Rendering:** 
  - When the browser encounters a `<script>` tag in the body, it stops parsing the HTML, executes the script, and then resumes parsing. This can block the rendering of other content, increasing load time and making the page appear slower.

- **Ideal Placement:** 
  - To avoid blocking the rendering process, it's recommended to place `<script>` tags at the end of the body tag or use the `async` or `defer` attributes to load scripts without blocking the page rendering.

### 7. **Making JS Files `<script>` Tags Unblocking:**
You can make JavaScript files non-blocking to improve page load performance:

- **Async Attribute:**
  - The `async` attribute causes the browser to load the script asynchronously, without blocking the page load. However, the script executes as soon as it’s downloaded, which might affect the order of script execution.
  
  ```html
  <script src="script.js" async></script>
  ```

- **Defer Attribute:**
  - The `defer` attribute allows the script to load asynchronously, but it defers execution until the HTML document is fully parsed. This ensures that scripts are executed in order after the document is loaded.

  ```html
  <script src="script.js" defer></script>
  ```

### Summary:

- **Reducing HTTP Requests:** Combine files, use lazy loading, optimize media files, and implement CDN and caching.
- **Web Vitals:** Focus on optimizing LCP, FID, and CLS, as well as non-core metrics like TTI, TTB, and Speed Index.
- **JS Loading:** Place scripts in the right order and use async/defer attributes to avoid blocking rendering.