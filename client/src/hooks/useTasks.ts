
import { useState, useEffect } from 'react';
import { apiService, Task } from '../services/api';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "שגיאה בטעינת משימות",
        description: "לא ניתן לטעון את המשימות מהשרת",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await apiService.addTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast({
        title: "משימה נוספה בהצלחה",
        description: "המשימה נוספה לרשימה"
      });
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "שגיאה בהוספת משימה",
        description: "לא ניתן להוסיף את המשימה",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await apiService.updateTask(id, updates);
      setTasks(prevTasks => 
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
      toast({
        title: "משימה עודכנה",
        description: "השינויים נשמרו בהצלחה"
      });
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "שגיאה בעדכון משימה",
        description: "לא ניתן לעדכן את המשימה",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await apiService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast({
        title: "משימה נמחקה",
        description: "המשימה הוסרה מהרשימה"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "שגיאה במחיקת משימה",
        description: "לא ניתן למחוק את המשימה",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks
  };
};
