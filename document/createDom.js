function createDom(root) {
    if (!root || !root.tag) return null; // Return null if root is null or undefined, or if tag is missing

    const element = document.createElement(root.tag); // Create DOM element based on tag
    if (root.attributes) {
        // Set attributes if available
        for (const [key, value] of Object.entries(root.attributes)) {
            element.setAttribute(key, value);
        }
    }

    if (root.children) {
        // Recursively create children
        for (const child of root.children) {
            const childElement = createDom(child);
            if (childElement) {
                element.appendChild(childElement); // Append child element to parent element
            }
        }
    }

    return element;
}

// Example usage:
// const root = { tag: 'div', attributes: { id: 'root' }, children: [...] };
// const domTree = createDom(root);
// document.body.appendChild(domTree);
