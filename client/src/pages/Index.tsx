import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Edit, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/services/api";

const Index = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, refreshTasks } = useTasks();
  const [quickTaskText, setQuickTaskText] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    code: "",
    title: "",
    description: "",
    type: "",
    startDate: null,
    endDate: null,
    status: "pending"
  });

  const taskTypes = ["פיתוח", "עיצוב", "בדיקה", "תיעוד", "אחר"];
  const taskStatuses = ["pending", "in-progress", "completed", "cancelled"];

  const addQuickTask = async () => {
    if (!quickTaskText.trim()) return;
    
    const taskData: Omit<Task, 'id'> = {
      code: `T-${tasks.length + 1}`,
      title: quickTaskText,
      description: "",
      type: "אחר",
      startDate: new Date(),
      endDate: null,
      status: "pending"
    };
    
    try {
      await addTask(taskData);
      setQuickTaskText("");
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const addDetailedTask = async () => {
    if (!newTask.title.trim()) return;
    
    const taskData = {
      ...newTask,
      code: newTask.code || `T-${tasks.length + 1}`
    };
    
    try {
      await addTask(taskData);
      setNewTask({
        code: "",
        title: "",
        description: "",
        type: "",
        startDate: null,
        endDate: null,
        status: "pending"
      });
      setIsAddingTask(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "ממתין";
      case "in-progress": return "בביצוע";
      case "completed": return "הושלם";
      case "cancelled": return "בוטל";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">טוען משימות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ניהול משימות
          </h1>
          <p className="text-gray-600">נהל את המשימות שלך בצורה יעילה ומסודרת</p>
          <Button 
            onClick={refreshTasks}
            variant="outline"
            className="mt-4 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן משימות
          </Button>
        </div>

        {/* Quick Task Addition */}
        <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">הוספה מהירה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="הקלד משימה חדשה..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addQuickTask()}
                className="flex-1 border-purple-200 focus:border-purple-400"
              />
              <Button 
                onClick={addQuickTask}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4 ml-2" />
                הוסף
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Task Addition */}
        <Card className="bg-white/70 backdrop-blur border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-gray-800">הוספת משימה מפורטת</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              {isAddingTask ? "סגור" : "הוסף משימה מפורטת"}
            </Button>
          </CardHeader>
          
          {isAddingTask && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">קוד משימה</Label>
                  <Input
                    id="code"
                    placeholder="T-001"
                    value={newTask.code}
                    onChange={(e) => setNewTask({...newTask, code: e.target.value})}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">כותרת</Label>
                  <Input
                    id="title"
                    placeholder="כותרת המשימה"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">תיאור</Label>
                <Textarea
                  id="description"
                  placeholder="תיאור מפורט של המשימה"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>סוג משימה</Label>
                  <Select onValueChange={(value) => setNewTask({...newTask, type: value})}>
                    <SelectTrigger className="border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="בחר סוג" />
                    </SelectTrigger>
                    <SelectContent>
                      {taskTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>תאריך התחלה</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-purple-200",
                          !newTask.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.startDate ? format(newTask.startDate, "dd/MM/yyyy") : "בחר תאריך"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.startDate || undefined}
                        onSelect={(date) => setNewTask({...newTask, startDate: date || null})}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>תאריך סיום</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-purple-200",
                          !newTask.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTask.endDate ? format(newTask.endDate, "dd/MM/yyyy") : "בחר תאריך"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTask.endDate || undefined}
                        onSelect={(date) => setNewTask({...newTask, endDate: date || null})}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <Button 
                onClick={addDetailedTask}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                הוסף משימה
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">רשימת משימות</h2>
          
          {tasks.length === 0 ? (
            <Card className="bg-white/50 backdrop-blur border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 text-lg">אין משימות עדיין. הוסף משימה ראשונה!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="bg-white/70 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {task.code}
                          </span>
                          <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(task.status))}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                        {task.description && (
                          <p className="text-gray-600 mb-3">{task.description}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingTask(task.id)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">סוג: </span>
                        <span className="text-gray-800">{task.type || "לא צוין"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">התחלה: </span>
                        <span className="text-gray-800">
                          {task.startDate ? format(task.startDate, "dd/MM/yyyy") : "לא צוין"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">סיום: </span>
                        <span className="text-gray-800">
                          {task.endDate ? format(task.endDate, "dd/MM/yyyy") : "לא צוין"}
                        </span>
                      </div>
                      <div>
                        <Select
                          defaultValue={task.status}
                          onValueChange={(value) => updateTask(task.id, { status: value })}
                        >
                          <SelectTrigger className="h-8 border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {taskStatuses.map(status => (
                              <SelectItem key={status} value={status}>
                                {getStatusText(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
