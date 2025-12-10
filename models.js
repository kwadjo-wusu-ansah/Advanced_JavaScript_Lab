export class Task {
  constructor(id, userId, title, complete = false) {
    this._id = id;
    this._userId = userId;
    this.title = title;
    this._complete = complete;
  }

  // Toggle the completion status of the task
  toggle() {
    this._complete = !this._complete;
  }

  isOverdue(dueDate) {
    throw new TypeError(
      `The 'isOverdue' method is not implemented in the Task class and must be overridden in subclasses.`
    );
  }

  getStatus() {
    return this._complete ? "Complete" : "Incomplete";
  }
}

export class PriorityTask extends Task {
  constructor(id, userId, title, complete, priority, dueDate = null) {
    super(id, userId, title, complete);
    this.priority = priority; // 'Low', 'Medium', 'High'
    this.dueDate = dueDate;
  }

  isOverdue() {
    if (!this.dueDate) {
      return false; // No due date means it can't be overdue
    } else {
      const now = new Date();
      return now > this.dueDate && !this._complete; //  this check if it is complete then not overdue but if not complete and past due date then overdue
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
  constructor(id, name, email, tasks = []) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._tasks = tasks;
  }

  addTask(task) {
    this._tasks.push(task);
  }

  getCompletionRate() {
    if (this._tasks.length === 0) return 0;
    const completedTasks = this._tasks.filter((task) => task._complete).length;
    return (completedTasks / this._tasks.length) * 100;

    //Modified to return percentage of completed tasks get the Day, Month and Year
  }

  getTasksByStatus(status) {
    return this._tasks.filter((task) => {
      if (status === "Complete") return task._complete;
      if (status === "Incomplete") return !task._complete;
      return false;
    });
  }
}
