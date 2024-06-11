function traverseDOMLevelByLevel(root) {
    const result = [];
    if (!root) return result; // Return empty array if root is null or undefined

    const queue = [root]; // Initialize queue with root node

    while (queue.length > 0) {
        const levelSize = queue.length; // Get the number of nodes at the current level
        const levelNodes = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift(); // Dequeue node from front of queue
            levelNodes.push(node); // Add node to current level array

            // Enqueue children of the current node
            if (node.children) {
                for (const child of node.children) {
                    queue.push(child);
                }
            }
        }

        result.push(levelNodes); // Add current level array to result
    }

    return result;
}

// Example usage:
// Assuming `root` is the reference to the root node of the DOM tree
// const result = traverseDOMLevelByLevel(root);
// console.log(result);
