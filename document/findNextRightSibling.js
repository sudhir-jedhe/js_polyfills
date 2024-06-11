function findNextRightSibling(root, target) {
    if (!root || !target) return null; // Return null if root or target is null or undefined

    const queue = [root]; // Initialize queue with root node
    let foundTarget = false;

    while (queue.length > 0) {
        const levelSize = queue.length;

        for (let i = 0; i < levelSize; i++) {
            const currentNode = queue.shift(); // Dequeue node from front of queue

            if (foundTarget && i > 0) {
                return currentNode; // Return the next right sibling if target has been found and it's not the first node in the level
            }

            if (currentNode === target) {
                foundTarget = true; // Set flag to indicate that target has been found
            }

            // Enqueue children of the current node
            if (currentNode.left) queue.push(currentNode.left);
            if (currentNode.right) queue.push(currentNode.right);
        }
    }

    return null; // Return null if target node is not found or it's the last node in its level
}

// Example usage:
// Assuming `root` is the reference to the root node of the binary tree
// Assuming `target` is the reference to the target node whose right sibling is to be found
// const rightSibling = findNextRightSibling(root, target);
// console.log(rightSibling);
