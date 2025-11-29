"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Tag, Filter, Download, Share2 } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const completedTasks = [
  {
    id: 1,
    title: "Focused Wyaefjet",
    startTime: "12:24 PM",
    endTime: "12:33 PM",
    duration: "9m",
    date: "July 25, 2025",
    tag: "Untagged",
    category: "Focus Session",
    productivity: 85,
  },
  {
    id: 2,
    title: "Deep Work Session",
    startTime: "10:15 AM",
    endTime: "11:45 AM",
    duration: "1h 30m",
    date: "July 25, 2025",
    tag: "Work",
    category: "Deep Work",
    productivity: 92,
  },
  {
    id: 3,
    title: "Research & Analysis",
    startTime: "2:00 PM",
    endTime: "3:25 PM",
    duration: "1h 25m",
    date: "July 24, 2025",
    tag: "Research",
    category: "Study",
    productivity: 78,
  },
  {
    id: 4,
    title: "Creative Writing",
    startTime: "4:30 PM",
    endTime: "5:15 PM",
    duration: "45m",
    date: "July 24, 2025",
    tag: "Creative",
    category: "Writing",
    productivity: 88,
  },
]

export function TimelinePage() {
  const { theme } = useTheme()

  const getProductivityColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-500"
    if (score >= 80) return "from-blue-500 to-cyan-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Focus Session":
        return "🎯"
      case "Deep Work":
        return "💼"
      case "Study":
        return "📚"
      case "Writing":
        return "✍️"
      default:
        return "⭐"
    }
  }

  return (
    <div className="flex-1 p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Timeline</h1>
            <p className="text-slate-600 dark:text-slate-400">Track your completed tasks and focus sessions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-200">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Focus Time</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">3h 49m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 border-green-200 dark:border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tasks Completed</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-purple-200 dark:border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avg Productivity</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">86%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700 border-orange-200 dark:border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Longest Session</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">1h 30m</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedTasks.map((task, index) => (
                <div key={task.id} className="group relative">
                  {/* Timeline line */}
                  {index !== completedTasks.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-200 dark:bg-slate-700"></div>
                  )}

                  <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 group-hover:scale-[1.02]">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 ring-4 ring-purple-100 dark:ring-purple-900/30 group-hover:ring-6 transition-all duration-300"></div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(task.category)}</span>
                          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {task.tag}
                          </Badge>
                          <div
                            className={`px-2 py-1 rounded-full bg-gradient-to-r ${getProductivityColor(task.productivity)} text-white text-xs font-medium`}
                          >
                            {task.productivity}%
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {task.startTime} - {task.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{task.date}</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">{task.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
