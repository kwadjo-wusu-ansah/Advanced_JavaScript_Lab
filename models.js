export class Task {
  #id;
  #userId;
  constructor(id, userId, title, complete = false) {
    this.#id = id;
    this.#userId = userId;
    this.title = title;
    this.complete = complete;
  }

  get id() {
    return this.#id;
  }
  get userId() {
    return this.#userId;
  }


  // Toggle the completion status of the task
  toggle() {
    this.complete = !this.complete;
  }

  isOverdue() {
    throw new TypeError(
      `The 'isOverdue' method is not implemented in the Task class and must be overridden in subclasses.`
    );
  }

  getStatus() {
    return this.complete ? "Complete" : "Incomplete";
  }
}

export class PriorityTask extends Task {
  constructor(id, userId, title, complete, priority, dueDate = null) {
    super(id, userId, title, complete);
    this.priority = priority; // 'low', 'medium', 'high'
    this.dueDate = dueDate;
  }

  isOverdue() {
    if (!this.dueDate || this.dueDate === null) {
      return false; // No due date means it can't be overdue
    } else {
      const now = new Date();
      return now > this.dueDate && !this.complete; //  this check if it is complete then not overdue but if not complete and past due date then overdue
    }
  }

  getStatus() {
    let status = super.getStatus();

    if (this.isOverdue()) {
      status += " (Overdue)";
    }
    return status;
  }
}

export class User {
  #id;
  #name;
  #email;
  #tasks;
  constructor(id, name, email, tasks = []) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#tasks = tasks;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get email() {
    return this.#email;
  }

  get tasks() {
    return this.#tasks;
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  getCompletionRate() {
    if (this.#tasks.length === 0) return 0;
    const completedTasks = this.#tasks.filter((task) => task.complete).length;
    return (completedTasks / this.#tasks.length) * 100;

    //Modified to return percentage of completed tasks get the Day, Month and Year
  }

  getTasksByStatus(status) {
    return this.#tasks.filter((task) => {
      if (status === "Complete") return task.complete;
      if (status === "Incomplete") return !task.complete;
      return false;
    });
  }

  getOverdueTasks() {
    return this.#tasks.filter((task) => {
      if (task instanceof PriorityTask) {
        return task.isOverdue();
      }
    });
  }

  getTasksByPriority(priority) {
    return this.#tasks.filter((task) => {
      if (task instanceof PriorityTask) {
        return task.priority === priority;
      }
      return false;
    });
  }

  getTasksDueBefore(date) {
    return this.#tasks.filter((task) => {
      if (task instanceof PriorityTask && task.dueDate) {
        return task.dueDate < date;
      }
      return false;
    });
  }
}
