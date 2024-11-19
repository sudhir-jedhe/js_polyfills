class Task {
    constructor(taskId, taskDescription, dueDate, tags) {
        this.taskId = taskId;
        this.taskName = taskDescription;
        this.dueDate = dueDate;
        this.tags = new Set(tags);
        this.finish = false;
    }
}

class TodoList {
    constructor() {
        this.taskIdCounter = 1; // to generate sequential task ids
        this.tasks = new Map(); // stores userId -> Set of tasks
    }

    // Add a new task for a given user
    addTask(userId, taskDescription, dueDate, tags) {
        const task = new Task(this.taskIdCounter++, taskDescription, dueDate, tags);
        
        if (!this.tasks.has(userId)) {
            this.tasks.set(userId, []);
        }

        this.tasks.get(userId).push(task);
        
        return task.taskId;
    }

    // Get all uncompleted tasks for a given user, sorted by due date
    getAllTasks(userId) {
        if (!this.tasks.has(userId)) return [];
        
        const tasks = this.tasks.get(userId);
        const uncompletedTasks = tasks.filter(task => !task.finish);
        
        // Sort by due date
        uncompletedTasks.sort((a, b) => a.dueDate - b.dueDate);
        
        return uncompletedTasks.map(task => task.taskName);
    }

    // Get all uncompleted tasks for a given user that have the specific tag
    getTasksForTag(userId, tag) {
        if (!this.tasks.has(userId)) return [];
        
        const tasks = this.tasks.get(userId);
        const taggedTasks = tasks.filter(task => task.tags.has(tag) && !task.finish);
        
        // Sort by due date
        taggedTasks.sort((a, b) => a.dueDate - b.dueDate);
        
        return taggedTasks.map(task => task.taskName);
    }

    // Mark a task as completed
    completeTask(userId, taskId) {
        if (!this.tasks.has(userId)) return;
        
        const tasks = this.tasks.get(userId);
        for (let task of tasks) {
            if (task.taskId === taskId && !task.finish) {
                task.finish = true;
                break;
            }
        }
    }
}

// Example Usage
const todoList = new TodoList();
console.log(todoList.addTask(1, "Task1", 50, [])); // Output: 1
console.log(todoList.addTask(1, "Task2", 100, ["P1"])); // Output: 2
console.log(todoList.getAllTasks(1)); // Output: ["Task1", "Task2"]
console.log(todoList.getAllTasks(5)); // Output: []
console.log(todoList.addTask(1, "Task3", 30, ["P1"])); // Output: 3
console.log(todoList.getTasksForTag(1, "P1")); // Output: ["Task3", "Task2"]
todoList.completeTask(1, 2); // Marks task 2 as complete
console.log(todoList.getTasksForTag(1, "P1")); // Output: ["Task3"]
console.log(todoList.getAllTasks(1)); // Output: ["Task3", "Task1"]
