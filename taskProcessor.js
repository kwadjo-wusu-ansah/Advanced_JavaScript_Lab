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
