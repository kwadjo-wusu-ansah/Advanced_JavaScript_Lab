import { APIClient } from "./api.js";
import { Task, PriorityTask, User } from "./models.js";
import * as processor from "./taskProcessor.js";

const apiClient = new APIClient("https://jsonplaceholder.typicode.com/");
console.log("API Client and Models imported successfully.");

const [usersData, UsersTodosData] = await apiClient.loadData();

console.log(UsersTodosData);

const todos = UsersTodosData.map((userTodos) => {
  return userTodos.map((todo) => {
    return new Task(todo.id, todo.userId, todo.title, todo.completed);
  });
});

console.log(todos);

const users = usersData.map((user, index) => {
  return new User(user.id, user.name, user.email, todos[index]);
});
