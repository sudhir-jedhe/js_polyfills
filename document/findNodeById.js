function findNodeById(node, id) {
    if (node.id === id) {
        return node; // Return the node if it matches the id
    }

    if (node.children) {
        for (const child of node.children) {
            const result = findNodeById(child, id);
            if (result) {
                return result; // Return the result if found in the child
            }
        }
    }

    return null; // Return null if no matching node is found
}

// Example usage
const nodeIdToFind = 3;
const foundNode = findNodeById(tree, nodeIdToFind);

console.log(foundNode);


const tree = {
    id: 1,
    name: 'Root',
    children: [
        {
            id: 2,
            name: 'Child 1',
            children: [
                { id: 3, name: 'Grandchild 1', children: [] },
                { id: 4, name: 'Grandchild 2', children: [] }
            ]
        },
        {
            id: 5,
            name: 'Child 2',
            children: [
                { id: 6, name: 'Grandchild 3', children: [] }
            ]
        }
    ]
};

{ id: 3, name: 'Grandchild 1', children: [] }
