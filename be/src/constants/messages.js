const MESSAGES = {
  // Task
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  TASK_FOUND: 'Task retrieved successfully',
  TASKS_FOUND: 'Tasks retrieved successfully',
  TASK_NOT_FOUND: 'Task not found',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_ONBOARDING_UPDATED: 'Onboarding status updated',
  INVALID_ONBOARDING_FLAG: 'Field "completed" must be a boolean',

  // Auth
  AUTH_REGISTERED: 'Account created successfully',
  AUTH_LOGGED_IN: 'Logged in successfully',
  AUTH_ME: 'Current user retrieved successfully',
  AUTH_EMAIL_IN_USE: 'Email is already registered',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_UNAUTHORIZED: 'Unauthorized',
  AUTH_INVALID_TOKEN: 'Invalid or expired token',

  // Validation
  TITLE_REQUIRED: 'Title is required',
  INVALID_PRIORITY: 'Priority must be one of: low, medium, high',
  INVALID_STATUS: 'Status must be one of: active, completed',
  INVALID_CATEGORY: 'Category must be one of: work, personal, health, learning, shopping',
  EMAIL_REQUIRED: 'Valid email is required',
  PASSWORD_REQUIRED: 'Password must be at least 6 characters',
  NAME_REQUIRED: 'Name is required',

  // General
  INTERNAL_ERROR: 'Internal server error',
  ROUTE_NOT_FOUND: 'Route not found',
};

module.exports = { MESSAGES };
