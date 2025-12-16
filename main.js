
import { APIClient } from "./api.js";
import { Task, PriorityTask, User } from "./models.js";
import * as processor from "./taskProcessor.js";
import promptSync from "prompt-sync";
import chalk from "chalk";

const prompt = promptSync({ sigint: true });

/* -------------------- Setup -------------------- */


const memorizer = (fn) => {
  const cache = new Map();
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

const apiClient = new APIClient("https://jsonplaceholder.typicode.com");
const memorizedLoadData = memorizer(apiClient.loadData.bind(apiClient));

const [usersData, usersTodosData] = await memorizedLoadData();

const todos = usersTodosData.map((userTodos) =>
  userTodos.map(
    (todo) => new Task(todo.id, todo.userId, todo.title, todo.completed)
  )
);

const users = usersData.map(
  (user, index) => new User(user.id, user.name, user.email, todos[index])
);

/* -------------------- Helpers -------------------- */

const statusColor = (task) => {
  if (task.complete) return chalk.green(task.getStatus());
  if (task instanceof PriorityTask && task.isOverdue())
    return chalk.red(task.getStatus());
  return chalk.yellow(task.getStatus());
};

const printTasks = (tasks) => {
  if (tasks.length === 0) {
    console.log(chalk.gray("No tasks found."));
    return;
  }

  tasks.forEach((task) => {
    console.log(
      chalk.cyan(`[${task.id}]`) + " " + task.title + " — " + statusColor(task)
    );

    if (task instanceof PriorityTask) {
      console.log(
        chalk.gray(
          `    Priority: ${task.priority} | Due: ${
            task.dueDate ? task.dueDate.toDateString() : "None"
          }`
        )
      );
    }
  });
};

const pause = () => prompt("\nPress Enter to continue...");

/* -------------------- User Selection -------------------- */

console.log("\nWelcome to the Task Management System");
console.log("====================================");

users.forEach((user) => {
  console.log(`${user.id}. ${user.name} (${user.email})`);
});

const userId = Number(prompt("\nSelect user ID: "));
const selectedUser = users.find((user) => use.id === userId);

if (!selectedUser) {
  console.log("Invalid user. Exiting...");
  process.exit(1);
}

console.log(`\nHello, ${selectedUser.name}!`);
let running = true;

/* -------------------- Main Menu Loop -------------------- */

while (running) {
  console.clear();
  console.log(`User: ${selectedUser.name}`);
  console.log("====================================");
  console.log("1. View all tasks");
  console.log("2. View completed tasks");
  console.log("3. View incomplete tasks");
  console.log("4. Toggle task completion");
  console.log("5. Create priority task");
  console.log("6. Search tasks");
  console.log("7. View completion statistics");
  console.log("0. Exit");

  console.log("====================================");

  const choice = prompt("Choose an option: ");

  switch (choice) {
    case "1": {
      printTasks(selectedUser.tasks);
      pause();
      break;
    }

    case "2": {
      const completed = selectedUser.getTasksByStatus("Complete");
      printTasks(completed);
      pause();
      break;
    }

    case "3": {
      const incomplete = selectedUser.getTasksByStatus("Incomplete");
      printTasks(incomplete);
      pause();
      break;
    }

    case "4": {
      const id = Number(prompt("Enter task ID to toggle: "));
      const task = selectedUser.tasks.find((t) => t.id === id);

      if (!task) {
        console.log("Task not found.");
      } else {
        task.toggle();
        console.log(`Task "${task.title}" updated.`);
      }

      pause();
      break;
    }
    case "5": {
      const title = prompt("Task title: ");
      const priority = prompt("Priority (low / medium / high): ").toLowerCase();

      if (!["low", "medium", "high"].includes(priority)) {
        console.log(chalk.red("Invalid priority."));
        pause();
        break;
      }

      const dueInput = prompt("Due date (YYYY-MM-DD) or leave empty: ");

      const dueDate = dueInput ? new Date(dueInput) : null;

      const newTask = new PriorityTask(
        Date.now(), // simple unique ID
        selectedUser.id,
        title,
        false,
        priority,
        dueDate
      );

      selectedUser.addTask(newTask);

      console.log(chalk.green("Priority task added successfully."));
      pause();
      break;
    }

    case "6": {
      const keyword = prompt("Enter keyword: ");
      const results = processor.searchTasks(selectedUser.tasks, keyword);
      printTasks(results);
      pause();
      break;
    }

    case "7": {
      const rate = selectedUser.getCompletionRate();
      console.log(`Completion Rate: ${rate.toFixed(2)}%`);
      pause();
      break;
    }

    case "0":
      running = false;
      break;

    default:
      console.log("Invalid option.");
      pause();
  }
}

console.log("\nGoodbye!");
