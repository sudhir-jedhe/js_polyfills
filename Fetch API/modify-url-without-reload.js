A pretty common task in web development is to modify the URL of the current page without reloading it. This can be useful when you want to update the URL to reflect the current state of the application, without causing a full page reload. In this article, we will explore the different options JavaScript provides for this task and the pros and cons of each.

Using the History API
The HTML5 History API is definitely the way to go for modern websites. It accomplishes the task at hand, while also providing additional functionality. You can use either history.pushState() or history.replaceState() to modify the URL in the browser, depending on your needs:

// Current URL: https://my-website.com/page_a
const nextURL = 'https://my-website.com/page_b';
const nextTitle = 'My new page title';
const nextState = { additionalInformation: 'Updated the URL with JS' };

// This will create a new entry in the browser's history, without reloading
window.history.pushState(nextState, nextTitle, nextURL);

// This will replace the current entry in the browser's history, without reloading
window.history.replaceState(nextState, nextTitle, nextURL);
The arguments for both methods are the same, allowing you to pass a customized serializable state object as the first argument, a customized title (although most browsers will ignore this parameter) and the URL you want to add/replace in the browser's history. Bear in mind that the History API only allows same-origin URLs, so you cannot navigate to an entirely different website.

Using the Location API
The older Location API is not the best tool for the job. It reloads the page, but still allows you to modify the current URL and might be useful when working with legacy browsers. You can modify the URL, using either Window.location.href, location.assign() or location.replace():

// Current URL: https://my-website.com/page_a
const nextURL = 'https://my-website.com/page_b';

// This will create a new entry in the browser's history, reloading afterwards
window.location.href = nextURL;

// This will replace the current entry in the browser's history, reloading afterwards
window.location.assign(nextURL);

// This will replace the current entry in the browser's history, reloading afterwards
window.location.replace(nextURL);
As you can see, all three options will cause a page reload, which can be undesirable. Unlike the History API, you can only set the URL, without any additional arguments. Finally, the Location API doesn't restrict you to same-origin URLs, which can cause security issues if you are not careful.