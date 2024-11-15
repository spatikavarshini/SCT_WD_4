document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const dueDateInput = document.getElementById("due-date");
    const todoList = document.getElementById("todo-list");

    let taskToEdit = null; // Tracks the task being edited

    // Add Task or Update Existing Task
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const task = todoInput.value.trim();
        const dueDate = dueDateInput.value;

        if (!task || !dueDate) return; // Ensure both fields are filled

        if (taskToEdit) {
            // Update existing task
            const taskDetails = taskToEdit.querySelector(".task-details");
            taskDetails.querySelector("strong").textContent = task;
            taskDetails.querySelector("span").textContent = `Due: ${formatDate(dueDate)}`;
            taskToEdit = null; // Clear the edit tracking
        } else {
            // Add new task
            const listItem = createTaskElement(task, dueDate);
            todoList.appendChild(listItem);
        }

        // Reset form fields
        todoInput.value = "";
        dueDateInput.value = "";
    });

    // Create Task Element
    function createTaskElement(task, dueDate) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <div class="task-completed">
                <input type="checkbox" class="task-check">
            </div>
            <div class="task-details">
                <strong>${task}</strong>
                <span>Due: ${formatDate(dueDate)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Attach event listeners
        listItem.querySelector(".delete-btn").addEventListener("click", () => {
            listItem.remove();
        });

        listItem.querySelector(".edit-btn").addEventListener("click", () => {
            startEditTask(listItem);
        });

        listItem.querySelector(".task-check").addEventListener("change", (e) => {
            toggleTaskCompletion(listItem, e.target.checked);
        });

        return listItem;
    }

    // Start editing a task
    function startEditTask(listItem) {
        const taskDetails = listItem.querySelector(".task-details");
        const task = taskDetails.querySelector("strong").textContent;
        const dueDateText = taskDetails.querySelector("span").textContent.split("Due: ")[1];

        todoInput.value = task; // Set the task name in the input
        dueDateInput.value = parseDateForInput(dueDateText); // Set the due date in the input

        taskToEdit = listItem; // Mark the task for editing
    }

    // Toggle task completion
    function toggleTaskCompletion(listItem, isCompleted) {
        const taskDetails = listItem.querySelector(".task-details");
        if (isCompleted) {
            taskDetails.classList.add("completed");
        } else {
            taskDetails.classList.remove("completed");
        }
    }

    // Format date for display
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // Parse date for datetime-local input
    function parseDateForInput(dateStr) {
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
    }
});
