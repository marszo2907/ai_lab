document.addEventListener("DOMContentLoaded", function () {
    class Task {
        constructor(name, date, done = false) {
            this.name = name;
            this.date = date;
            this.done = done;
        }

        toggleDone() {
            this.done = !this.done;
        }

        updateName(newName) {
            if (newName.length >= 3 && newName.length <= 255) {
                this.name = newName;
            }
        }

        updateDate(newDate) {
            if (newDate && newDate >= new Date().toISOString().split("T")[0]) {
                this.date = newDate;
            }
        }
    }

    class ToDo {
        constructor() {
            this.todoListElement = document.getElementById("todo-list");
            this.searchInput = document.getElementById("search");
            this.newTaskNameInput = document.getElementById("new-task-name");
            this.newTaskDateInput = document.getElementById("new-task-date");
            this.addTaskButton = document.getElementById("add-task-btn");
            this.tasks = this.loadTasks();

            this.addTaskButton.addEventListener("click", () => this.addTask());
            this.searchInput.addEventListener("input", () => this.searchTasks());

            this.renderTasks();
        }

        loadTasks() {
            const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
            return tasksData.map(task => new Task(task.name, task.date, task.done));
        }

        saveTasks() {
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }

        renderTasks() {
            this.todoListElement.innerHTML = "";
            const searchValue = this.searchInput.value.toLowerCase();

            this.tasks.forEach((task, index) => {
                if (searchValue.length >= 2 && !task.name.toLowerCase().includes(searchValue)) return;

                const taskItem = document.createElement("li");
                taskItem.classList.add("todo-item");
                if (task.done) taskItem.classList.add("done");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = task.done;
                checkbox.addEventListener("change", () => this.toggleTaskDone(index));

                const taskName = document.createElement("span");
                taskName.classList.add("task-name");
                taskName.innerHTML = this.highlightSearch(task.name, searchValue);
                taskName.addEventListener("click", () => this.editTask(index, "name"));

                const taskDate = document.createElement("span");
                taskDate.classList.add("task-date");
                taskDate.textContent = task.date;
                taskDate.addEventListener("click", () => this.editTask(index, "date"));

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Usuń";
                deleteButton.classList.add("delete-btn");
                deleteButton.addEventListener("click", () => this.deleteTask(index));

                taskItem.append(checkbox, taskName, taskDate, deleteButton);
                this.todoListElement.appendChild(taskItem);
            });
        }

        highlightSearch(text, searchValue) {
            if (!searchValue || searchValue.length < 2) return text;
            const regex = new RegExp(`(${searchValue})`, "gi");
            return text.replace(regex, "<span class='highlight'>$1</span>");
        }

        toggleTaskDone(index) {
            this.tasks[index].toggleDone();
            this.saveTasks();
            this.renderTasks();
        }

        editTask(index, field) {
            const task = this.tasks[index];
            const input = document.createElement("input");
            input.type = field === "date" ? "date" : "text";
            input.value = field === "date" ? task.date : task.name;

            const finishEdit = () => {
                if (field === "date") {
                    task.updateDate(input.value);
                } else {
                    task.updateName(input.value.trim());
                }
                this.saveTasks();
                this.renderTasks();
            };

            input.addEventListener("blur", finishEdit);
            input.addEventListener("keydown", (e) => e.key === "Enter" && finishEdit());

            const target = field === "date" ? document.querySelectorAll(".task-date")[index] : document.querySelectorAll(".task-name")[index];
            target.replaceWith(input);
            input.focus();
        }

        deleteTask(index) {
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.renderTasks();
        }

        addTask() {
            const name = this.newTaskNameInput.value.trim();
            const date = this.newTaskDateInput.value;
            if (name.length >= 3 && name.length <= 255 && date && date >= new Date().toISOString().split("T")[0]) {
                this.tasks.push(new Task(name, date));
                this.saveTasks();
                this.renderTasks();
                this.newTaskNameInput.value = "";
                this.newTaskDateInput.value = "";
            } else {
                alert("Nieprawidłowa nazwa zadania lub data.");
            }
        }

        searchTasks() {
            if (this.searchInput.value.length >= 2) {
                this.renderTasks();
            } else {
                this.renderTasks();
            }
        }
    }

    new ToDo();
});
