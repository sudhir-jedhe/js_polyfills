import FolderTree from "./FolderTree";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import React, { useState } from "react";
import React, { useState } from "react";
import React from "react";
import React, { useState } from "react";
import React from "react";
import Tree from "./Tree";

// src/App.js

const App = () => {
    const [checkedItems, setCheckedItems] = useState([false, false, false]);

    const handleChange = (index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = !newCheckedItems[index];
        setCheckedItems(newCheckedItems);
    };

    // Calculate the indeterminate state
    const indeterminate = checkedItems.some(item => item) && !checkedItems.every(item => item);

    return (
        <div>
            <h1>Indeterminate Checkbox Example</h1>
            <IndeterminateCheckbox
                checked={checkedItems.every(item => item)}
                indeterminate={indeterminate}
                onChange={() => {
                    const newCheckedItems = checkedItems.every(item => item)
                        ? [false, false, false]
                        : [true, true, true];
                    setCheckedItems(newCheckedItems);
                }}
            />
            <div>
                {checkedItems.map((checked, index) => (
                    <div key={index}>
                        <IndeterminateCheckbox
                            checked={checked}
                            indeterminate={false}
                            onChange={() => handleChange(index)}
                        />
                        Item {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;

/********************************************************** */

// src/Tree.js

const TreeNode = ({ node, toggleCheck }) => {
    return (
        <div style={{ marginLeft: '20px' }}>
            <input
                type="checkbox"
                checked={node.checked}
                onChange={() => toggleCheck(node)}
            />
            {node.name}
            {node.children && node.children.length > 0 && (
                <div>
                    {node.children.map((childNode) => (
                        <TreeNode key={childNode.id} node={childNode} toggleCheck={toggleCheck} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Tree = ({ data }) => {
    const [treeData, setTreeData] = useState(data);

    const toggleCheck = (node) => {
        const updateCheckState = (nodes) => {
            return nodes.map((n) => {
                if (n.id === node.id) {
                    return { ...n, checked: !n.checked };
                }
                if (n.children) {
                    return { ...n, children: updateCheckState(n.children) };
                }
                return n;
            });
        };

        setTreeData(updateCheckState(treeData));
    };

    return (
        <div>
            {treeData.map((node) => (
                <TreeNode key={node.id} node={node} toggleCheck={toggleCheck} />
            ))}
        </div>
    );
};

export default Tree;


// src/App.js

const App = () => {
    const treeData = [
        {
            id: 1,
            name: 'Node 1',
            checked: false,
            children: [
                { id: 2, name: 'Node 1.1', checked: false, children: [] },
                {
                    id: 3,
                    name: 'Node 1.2',
                    checked: false,
                    children: [
                        { id: 4, name: 'Node 1.2.1', checked: false, children: [] },
                    ],
                },
            ],
        },
        {
            id: 5,
            name: 'Node 2',
            checked: false,
            children: [],
        },
    ];

    return (
        <div>
            <h1>Tree Checkbox Example</h1>
            <Tree data={treeData} />
        </div>
    );
};

export default App;


/********************************************** */
// src/FolderTree.js

const FolderNode = ({ node }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFolder = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div style={{ marginLeft: '20px' }}>
            <div onClick={toggleFolder} style={{ cursor: 'pointer' }}>
                {node.children && node.children.length > 0 && (
                    <span>{isOpen ? '[-]' : '[+]'}</span>
                )}
                {node.name}
            </div>
            {isOpen && node.children && (
                <div>
                    {node.children.map((childNode) => (
                        <FolderNode key={childNode.id} node={childNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FolderTree = ({ data }) => {
    return (
        <div>
            {data.map((node) => (
                <FolderNode key={node.id} node={node} />
            ))}
        </div>
    );
};

export default FolderTree;


// src/App.js

const App = () => {
    const folderData = [
        {
            id: 1,
            name: 'Folder 1',
            children: [
                { id: 2, name: 'File 1-1' },
                { id: 3, name: 'File 1-2' },
                {
                    id: 4,
                    name: 'Folder 1-1',
                    children: [
                        { id: 5, name: 'File 1-1-1' },
                        { id: 6, name: 'File 1-1-2' },
                    ],
                },
            ],
        },
        {
            id: 7,
            name: 'Folder 2',
            children: [
                { id: 8, name: 'File 2-1' },
                { id: 9, name: 'File 2-2' },
            ],
        },
        {
            id: 10,
            name: 'Folder 3',
            children: [],
        },
    ];

    return (
        <div>
            <h1>Folder Structure Tree Example</h1>
            <FolderTree data={folderData} />
        </div>
    );
};

export default App;
