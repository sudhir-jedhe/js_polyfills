function querySelectorAll(selector, node = document) {
    const results = [];

    // Helper function to match elements
    const matchesSelector = (element, selector) => {
        if (selector.startsWith('.')) {
            // Class selector
            return element.classList.contains(selector.slice(1));
        } else if (selector.startsWith('#')) {
            // ID selector
            return element.id === selector.slice(1);
        } else {
            // Tag selector
            return element.tagName.toLowerCase() === selector.toLowerCase();
        }
    };

    // Recursive function to traverse the DOM
    const traverse = (currentNode) => {
        // Check if the current node matches the selector
        if (matchesSelector(currentNode, selector)) {
            results.push(currentNode);
        }

        // Traverse child nodes
        currentNode.childNodes.forEach(child => traverse(child));
    };

    // Start traversal from the provided node
    traverse(node);

    return results;
}

// Do not edit below this line
export default querySelectorAll;
