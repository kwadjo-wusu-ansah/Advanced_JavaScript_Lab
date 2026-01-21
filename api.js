export class APIClient {
  #baseURL;
  constructor(baseURL) {
    this.#baseURL = baseURL;
  }
// Fetch users from the API
  async fetchUsers() {
    try {
      const response = await fetch(`${this.#baseURL}/users`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }
// Fetch todos from the API
  async fetchTodos() {
    try {
      const response = await fetch(`${this.#baseURL}/todos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      throw error;
    }
  }

  // Fetch todos for a specific user

  async fetchUsersTodos(userId) {
    try {
      const response = await this.fetchTodos();
      const data = await response;
      return data.filter((todo) => todo?.userId === userId);
    } catch (error) {
      console.error("Failed to fetch user's todos:", error);
      throw error;
    }
  }
// Load both users and their todos
  async loadData() {
    try {
      const users = await this.fetchUsers();
      const todos = users.map(async (user) => {
        const userTodos = await this.fetchUsersTodos(user?.id);
        return userTodos;
      });
      const allUserTodos = await Promise.all(todos);
      return [users, allUserTodos];
    } catch (error) {
      console.error("Failed to load data:", error);
      throw error;
    }
  }
}
