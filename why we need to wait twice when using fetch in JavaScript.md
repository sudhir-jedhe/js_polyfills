Do you know why we need to "wait" twice when using fetch in JavaScript?

Let me try to explain:
In the first line, const response = await fetch("url"), the fetch function retrieves the response headers, including the status code and other metadata, but not the actual body of the response. The body can be larger and take more time to process.

In the second line, const data = await response.json(), we wait again to parse the response body as JSON. This two-step process ensures that we first get the response status before processing the potentially lengthy body because it can take some time.