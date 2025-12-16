import { APIClient } from "./api.js";
import { Task, PriorityTask, User } from "./models.js";
import * as processor from "./taskProcessor.js";
import promptSync from "prompt-sync";

// Simple memorizer function to cache results of async functions
const memorizer = (fn) => {
  const cache = new Map();
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

const apiClient = new APIClient("https://jsonplaceholder.typicode.com/");

const memorizedLoadData = memorizer(apiClient.loadData.bind(apiClient));

const [usersData, UsersTodosData] = await memorizedLoadData(1);

const todos = UsersTodosData.map((userTodos) => {
  return userTodos.map((todo) => {
    return new Task(todo?.id, todo?.userId, todo?.title, todo?.completed);
  });
});

const users = usersData.map((user, index) => {
  return new User(user?.id, user?.name, user?.email, todos[index]);
});

const prompt = promptSync();

console.log("Welcome to the Task Management System");
console.log("==================================================================");
console.log("Please Select a User to Continue:");
console.log("------------------------------------------------------------------");
console.log("User List:");
users.forEach((user, index) => {
  console.log(
    `${index + 1}. ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`
  );
});

let userId = prompt("Please enter the user ID:");
const selectedUser = users.find((user) => user.id === parseInt(userId));

if (!selectedUser) {
  console.log("Invalid User ID. Exiting...");
  process.exit(1);
}
console.log(`You selected: ${selectedUser.name} (ID: ${selectedUser.id})`);
console.log("Loading tasks...");
const userTasks = selectedUser.tasks;
console.log(`You have ${userTasks.length} tasks.`);
console.log("==================================================================");
// Further interaction logic can be added here


