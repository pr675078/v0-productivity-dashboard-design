"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, Target, TrendingUp, Clock } from "lucide-react"
import { useState } from "react"

const weeklyGoals = [
  { id: 1, title: "Launch new feature", progress: 75, target: "5 days", remaining: "2 days" },
  { id: 2, title: "Complete user research", progress: 40, target: "7 days", remaining: "4 days" },
  { id: 3, title: "Optimize performance", progress: 90, target: "3 days", remaining: "1 day" },
]

const monthlyTargets = [
  { id: 1, title: "Increase productivity by 20%", progress: 65, current: "13 days", target: "20 days" },
  { id: 2, title: "Complete certification course", progress: 30, current: "6 modules", target: "20 modules" },
  { id: 3, title: "Build 3 new features", progress: 80, current: "2.4 features", target: "3 features" },
]

export function TodoPage() {
  const [newTask, setNewTask] = useState("")
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, title: "Complete project proposal", completed: true, priority: "high", time: "2h" },
    { id: 2, title: "Review team feedback", completed: false, priority: "medium", time: "30m" },
    { id: 3, title: "Update documentation", completed: false, priority: "low", time: "1h" },
    { id: 4, title: "Client meeting preparation", completed: true, priority: "high", time: "45m" },
  ])

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.trim(),
        completed: false,
        priority: "medium",
        time: "30m",
      }
      setDailyTasks([...dailyTasks, task])
      setNewTask("")
    }
  }

  const toggleTask = (taskId: number) => {
    setDailyTasks(dailyTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500"
      case "medium":
        return "from-yellow-500 to-orange-500"
      case "low":
        return "from-green-500 to-emerald-500"
      default:
        return "from-slate-500 to-slate-600"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "from-green-500 to-emerald-500"
    if (progress >= 60) return "from-blue-500 to-cyan-500"
    if (progress >= 40) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  return (
    <div className="flex-1 p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Todo List</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your daily, weekly, and monthly targets</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Today's Tasks</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">2/4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Weekly Progress</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">68%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Goals</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">58%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focus Time</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">4h 15m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
            <TabsTrigger
              value="daily"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500"
            >
              Monthly
            </TabsTrigger>
          </TabsList>

          {/* Daily Tasks */}
          <TabsContent value="daily" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Tasks
                </CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTask()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addTask}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900 dark:text-white"}`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`bg-gradient-to-r ${getPriorityColor(task.priority)} text-white text-xs`}>
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Goals */}
          <TabsContent value="weekly" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                          {goal.title}
                        </h3>
                        <Badge className={`bg-gradient-to-r ${getProgressColor(goal.progress)} text-white`}>
                          {goal.progress}%
                        </Badge>
                      </div>
                      <Progress value={goal.progress} className="mb-3 h-2" />
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Target: {goal.target}</span>
                        <span>Remaining: {goal.remaining}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Targets */}
          <TabsContent value="monthly" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTargets.map((target) => (
                    <div
                      key={target.id}
                      className="group p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                          {target.title}
                        </h3>
                        <Badge className={`bg-gradient-to-r ${getProgressColor(target.progress)} text-white`}>
                          {target.progress}%
                        </Badge>
                      </div>
                      <Progress value={target.progress} className="mb-3 h-2" />
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Current: {target.current}</span>
                        <span>Target: {target.target}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
