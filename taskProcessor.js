// Filter tasks by their completion status
export const filterByStatus = (tasks, status) => {
  return tasks.filter((task) => {
    let taskStatus = task.getStatus();
    return taskStatus.startsWith(status);
  });
};

export const filterByUser = (tasks, userId) => {
  return tasks.filter((task) => task._userId === userId); 
};

export const calculateStatistics = (tasks) => {
  taskCount = tasks.length;
  completedCount = tasks.filter((task) => task.getComplete()).length;
  incompleteCount = taskCount - completedCount;
  completionRate = taskCount === 0 ? 0 : (completedCount / taskCount) * 100;

  return { tasksCount, completedCount, incompleteCount, completionRate };
};

export const groupByUser = (tasks) => {
  UserIdToTasks = new Map();
  tasks.forEach((task) => {
    if (!UserIdToTasks.has(task.getUserId())) {
      UserIdToTasks.set(task.getUserId(), []);
    }
    UserIdToTasks.get(task.getUserId()).push(task);
  });
  return UserIdToTasks;
};

export const searchTasks = (tasks, keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return tasks.filter((task) =>
    task.title.toLowerCase().includes(lowerKeyword)
  );
};

// Sort tasks by their due date
export const sortByDueDate = (tasks, ascending = true) => {
  return tasks.slice().sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : null;
    const dateB = b.dueDate ? new Date(b.dueDate) : null;
if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    if (ascending) {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};