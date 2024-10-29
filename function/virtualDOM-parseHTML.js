function parseHTMLCode(htmlString) {
    // Create a temporary DOM element to parse the HTML string
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Function to recursively convert DOM nodes to virtual DOM objects
    function createVirtualDOM(node) {
        // If it's a text node, return its text content
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        // Create a virtual DOM object for the element
        const virtualNode = {
            tag: node.tagName.toLowerCase(),
            attributes: {},
            children: []
        };

        // Get attributes
        Array.from(node.attributes).forEach(attr => {
            virtualNode.attributes[attr.name] = attr.value;
        });

        // Recursively process child nodes
        Array.from(node.childNodes).forEach(child => {
            virtualNode.children.push(createVirtualDOM(child));
        });

        return virtualNode;
    }

    // Start the recursive conversion from the tempDiv
    const virtualDOM = createVirtualDOM(tempDiv.firstChild);

    return virtualDOM;
}

// Example usage (uncomment to test)
// const htmlString = '<div class="container"><p>Hello, <strong>world!</strong></p></div>';
// const virtualDOM = parseHTMLCode(htmlString);
// console.log(JSON.stringify(virtualDOM, null, 2));

// Do not edit below this line
export default parseHTMLCode;
