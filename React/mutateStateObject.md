Manipulate Object in State
When updating, never mutate the object directly — always create a new one by spreading the previous state ({ ...previousUser, age: newAge }). This ensures React detects the change and re-renders properly.

import { useState } from "react";
 
export default function ObjectExample() {
    // Set default object
    const [user, setUser] = useState({ name: "Alice", age: 25 });
 
    // Update object prop
    function updateUserAge(newAge) {
        setUser((previousUser) => ({ ...previousUser, age: newAge }));
    };
 
    ...
}


Manipulate Array in State
Each time you add, update, or delete an element, return a new array using methods like .map(), .filter(), or the spread operator ([...]). Never push or splice the original array — those mutate it and can cause bugs.

import { useState } from "react";
 
export default function ArrayExample() {
    // Set default array
    const [tasks, setTasks] = useState(["Learn React", "Practice JS"]);
 
    // Add new array item
    function addTask(newTask) {
        setTasks((previousTasks) => [...previousTasks, newTask]);
    };
 
    // Update array item by index
    function updateTask(taskIndex, updatedTask) {
        setTasks((previousTasks) =>
            previousTasks.map((task, currentIndex) =>
                currentIndex === taskIndex ? updatedTask : task
            )
        );
    };
 
    // Delete array item
    function deleteTask(taskIndex) {
        setTasks((previousTasks) =>
            previousTasks.filter((_, currentIndex) => currentIndex !== taskIndex)
        );
    };
 
    ...
}


Manipulate Array of Objects in State
You typically identify which object to update or remove using a unique key like id. When updating, use

.map() to return a new array where only the matching object is replaced with an updated copy.

import { useState } from "react";
 
export default function ArrayOfObjectsExample() {
    // Set default array of objects
    const [products, setProducts] = useState([
        { id: 1, name: "Phone", price: 500 },
        { id: 2, name: "Laptop", price: 1200 },
    ]);
 
    // Add new object into array
    function addProduct(newProduct) {
        setProducts((previousProducts) => [    
            ...previousProducts, 
            { id: Date.now(), ...newProduct }
        ]);
    };
 
    // Update object prop in the array by id 
    function updateProductPrice(productId, newPrice) {
        setProducts((previousProducts) =>
            previousProducts.map((product) =>
                product.id === productId
                    ? { ...product, price: newPrice }
                    : product
            )
        );
    };
 
    // Delete object from the array by id 
    function deleteProduct(productId) {
        setProducts((previousProducts) =>
            previousProducts.filter((product) => product.id !== productId)
        );
    };
 
    ...
}

```js
import React from 'react'
import { getRandomEmoji } from './utilities.js'

// Don't change constants	
export const emojisDefault = [
    { id: 1, value: "🍋" },
    { id: 2, value: "🍒" },
    { id: 3, value: "🍊" },
    { id: 4, value: "💎" },
    { id: 5, value: "🍉" },
]

// Don't rename the "App" component 
function App() {
	const [emojis, setEmojis] = React.useState(emojisDefault)
	
	function updateEmoji(id, value) {
    const newEmoji = { id, value }
    
    setEmojis((prevEmojis) =>
        prevEmojis.map((emoji) =>
            emoji.id === id ? newEmoji : emoji
        )
    )
}
	
	// Don't change `handleGenerate` function	
	function handleGenerate() {
	    for (let i = 0; i < emojis.length; i++) {
            setTimeout(() => {
                updateEmoji(emojis[i].id, getRandomEmoji());
            }, i * 100);
        }
	}
    
    // Don't change the implemnetation
    return (
        <section>
            <h2>Check you luck or dev skills</h2>
            <p>Create the line of identical emojis</p>
            <ul>
                {emojis.map(({ id, value }, index) => (
                    <li key={id}>{value}</li>
                ))}
            </ul> 
            
            <button onClick={handleGenerate}>Generate</button>
        </section>
    )
}

export default App;

// Don't change `getRandomEmoji` function
export function getRandomEmoji() {
    const emojisIcon = ["🍋", "🍒", "🍊", "💎", "🍉"]
    const randomIndex = Math.floor(Math.random() * emojisIcon.length);
    return emojisIcon[randomIndex]
}

```

```html
import React from 'react'

// Don't rename the "App" component 
function App() {
    const [todos, setTodos] = React.useState([
        { id: 1, value: 'Todo item 1' },
        { id: 2, value: 'Todo item 2' },
        { id: 3, value: 'Todo item 3' },
    ])

    function handleAddTodo(event) {
        const id = (todos[todos.length - 1]?.id || 0) + 1

        const newTodo = {
            id,
            value: `Todo item ${id}`
        }

        // ✅ Add new todo
        setTodos((prevTodos) => [
            ...prevTodos,
            newTodo
        ])
    }

    function handleDeleteTodo(todoId) {
        // ✅ Delete todo
        setTodos((prevTodos) =>
            prevTodos.filter(todo => todo.id !== todoId)
        )
    }

    // Don't change the implementation
    return (
        <section>
            <button onClick={handleAddTodo}>Add new todo</button>
            <h2>Todos</h2>
            {todos.length > 0 ? (
                <ul>
                    {todos.map(({ id, value }) => (
                        <li key={id}>
                            {value}{' '}
                            <button onClick={() => handleDeleteTodo(id)}>delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven't added any todo</p>
            )}
        </section>
    )
}

export default App
```

```js
import React from 'react'

// Don't rename the "App" component 
function App() {
    const [size, setSize] = React.useState({ width: '50', height: '50' })
    
    function handleChange(event) {
        const { value, name } = event.target
        
        // TODO: Set new size using 'setSize' function. Remember, only one dimension (width or height) changed by one time.
        
        
 setSize((prevSize) => ({
        
...prevSize,
        [name]: Number(value)

    }))

    }
    
    // Don't change the implementation 
    return (
        <>
            <div className="Container">
                <div className="Shape" style={{ width: `${size.width || 0}%`, height: `${size.height || 0}%` }} />
            </div>
            
            <h2>Change shape size</h2>
            
            <label>
                width 
                <input type="range" name="width" min="1" max="100" value={size.width || 0} step="1" onChange={handleChange} />
            </label><br />
            
            <label>
                height
                <input type="range" name="height" min="1" max="100" value={size.height || 0} step="1" onChange={handleChange} />
            </label>
        </>
    )
}

export default App;

```

```js
import React from 'react'

// Don't rename the "getRandomNumbers" component 
function getRandomNumbers() {
     return [
         Math.floor(Math.random() * 100) + 1,
         Math.floor(Math.random() * 100) + 1,
         Math.floor(Math.random() * 100) + 1
     ]
}

// Don't rename the "App" component 
function App() {
    const [sum, setSum] = React.useState(0)
    const [numbers, setNumbers] = React.useState(getRandomNumbers())
    
    function handleSum() {
        setSum(0)
        numbers.forEach((number) => {
            // TODO: Calculate sum correctly here
            setSum((prevSum) => prevSum + number)
        })
    }
    
    // Don't change the implementation 
    return (
        <>
            <h2>Random numbers</h2>
            <ul>
                {numbers.map((number, index) => (
                    <li key={index}>{number}</li>
                ))}
            </ul>
            <h3>Sum: {sum}</h3>
            <button onClick={handleSum}>Calculate sum</button>
            <button onClick={() => setSum(0)}>Reset</button>
        </>
    )
}

export default App;

```

