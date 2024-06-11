function prettyHTML(string, styles) {
    // Create a temporary div element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = string;

    // Apply styles to elements
    applyStyles(tempDiv, styles);

    // Serialize the modified DOM back to an HTML string
    return tempDiv.innerHTML;
}

function applyStyles(element, styles) {
    // Iterate through each style rule
    for (const [selector, style] of Object.entries(styles)) {
        // Find elements matching the selector
        const matchedElements = element.querySelectorAll(selector);
        // Apply styles to matched elements
        matchedElements.forEach(matchedElement => {
            Object.assign(matchedElement.style, style);
        });
    }
}

// Example usage:
// const htmlString = '<div class="container"><p>Hello, world!</p></div>';
// const styles = {
//     '.container': {
//         backgroundColor: 'lightblue',
//         padding: '10px'
//     },
//     'p': {
//         color: 'green',
//         fontSize: '20px'
//     }
// };
// const result = prettyHTML(htmlString, styles);
// console.log(result);
