function executeTasksInParallel(tasks) {
    // Ensure tasks is an array of functions returning promises
    if (!Array.isArray(tasks) || !tasks.every(task => typeof task === 'function')) {
        throw new TypeError('Tasks should be an array of functions that return promises.');
    }

    // Map each task to a promise
    const promises = tasks.map(task => task());

    // Return a promise that resolves when all tasks are complete
    return Promise.all(promises);
}

// Example task functions
const task1 = () => new Promise(resolve => setTimeout(() => resolve('Task 1 completed'), 1000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve('Task 2 completed'), 2000));
const task3 = () => new Promise(resolve => setTimeout(() => resolve('Task 3 completed'), 1500));

// Example usage
const tasks = [task1, task2, task3];

executeTasksInParallel(tasks)
    .then(results => {
        console.log('All tasks completed:', results);
    })
    .catch(error => {
        console.error('Error in executing tasks:', error);
    });


    /*********************************** */

    async function executeTasksInParallel(tasks) {
        // Ensure tasks is an array of functions returning promises
        if (!Array.isArray(tasks) || !tasks.every(task => typeof task === 'function')) {
            throw new TypeError('Tasks should be an array of functions that return promises.');
        }
    
        // Map each task to a promise
        const promises = tasks.map(task => task());
    
        // Await the completion of all tasks
        return await Promise.all(promises);
    }
    
    // Example task functions
    const task1 = () => new Promise(resolve => setTimeout(() => resolve('Task 1 completed'), 1000));
    const task2 = () => new Promise(resolve => setTimeout(() => resolve('Task 2 completed'), 2000));
    const task3 = () => new Promise(resolve => setTimeout(() => resolve('Task 3 completed'), 1500));
    
    // Example usage
    const tasks = [task1, task2, task3];
    
    executeTasksInParallel(tasks)
        .then(results => {
            console.log('All tasks completed:', results);
        })
        .catch(error => {
            console.error('Error in executing tasks:', error);
        });
    

        async function fetchUrlsInParallel(urls) {
            // Ensure urls is an array of strings
            if (!Array.isArray(urls) || !urls.every(url => typeof url === 'string')) {
                throw new TypeError('URLs should be an array of strings.');
            }
        
            // Create an array of fetch promises
            const fetchPromises = urls.map(url => fetch(url).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse JSON if response is OK
            }));
        
            // Await the completion of all fetch promises
            return await Promise.all(fetchPromises);
        }
        
        // Example usage
        const apiUrls = [
            'https://jsonplaceholder.typicode.com/posts/1',
            'https://jsonplaceholder.typicode.com/posts/2',
            'https://jsonplaceholder.typicode.com/posts/3'
        ];
        
        fetchUrlsInParallel(apiUrls)
            .then(results => {
                console.log('All API calls completed:', results);
            })
            .catch(error => {
                console.error('Error in fetching data:', error);
            });
        