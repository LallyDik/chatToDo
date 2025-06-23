
const API_BASE_URL = 'http://localhost:8000'; // שנה לכתובת השרת שלך

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
}

export interface ApiTask {
  id: string;
  code: string;
  title: string;
  description: string;
  type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
}

const convertToApiFormat = (task: Omit<Task, 'id'>): Omit<ApiTask, 'id'> => ({
  code: task.code,
  title: task.title,
  description: task.description,
  type: task.type,
  start_date: task.startDate ? task.startDate.toISOString().split('T')[0] : null,
  end_date: task.endDate ? task.endDate.toISOString().split('T')[0] : null,
  status: task.status
});

const convertFromApiFormat = (apiTask: ApiTask): Task => ({
  id: apiTask.id,
  code: apiTask.code,
  title: apiTask.title,
  description: apiTask.description,
  type: apiTask.type,
  startDate: apiTask.start_date ? new Date(apiTask.start_date) : null,
  endDate: apiTask.end_date ? new Date(apiTask.end_date) : null,
  status: apiTask.status
});

export const apiService = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/get_tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const apiTasks: ApiTask[] = await response.json();
      return apiTasks.map(convertFromApiFormat);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/add_task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertToApiFormat(task))
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const apiTask: ApiTask = await response.json();
      return convertFromApiFormat(apiTask);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    try {
      const taskUpdate = {
        ...updates,
        start_date: updates.startDate ? updates.startDate.toISOString().split('T')[0] : undefined,
        end_date: updates.endDate ? updates.endDate.toISOString().split('T')[0] : undefined,
        startDate: undefined,
        endDate: undefined
      };
      
      const response = await fetch(`${API_BASE_URL}/update_task`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...taskUpdate })
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const apiTask: ApiTask = await response.json();
      return convertFromApiFormat(apiTask);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/delete_task`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
