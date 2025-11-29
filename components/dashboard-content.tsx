"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Target, Flame, CalendarIcon, TrendingUp, Award, Zap, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { AudioPlayer } from "@/components/audio-player"
import { getTodaysSessions, updateDailyStats, createFocusSession } from "@/lib/firebase-service"
import { Button } from "@/components/ui/button"
import { useReminderNotifications } from "@/hooks/useReminderNotifications"

interface DashboardContentProps {
  userId?: string
}

export function DashboardContent({ userId = "demo-user" }: DashboardContentProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [focusData, setFocusData] = useState({
    focusTime: "0m",
    sessions: 0,
    currentStreak: 1,
    bestStreak: 3,
    daysFocused: 1,
    avgFocusTime: "0m",
    totalFocus: "0m",
    totalSessions: 0,
    focusDays: 0,
    totalFocusTime: "0m",
  })
  const { theme } = useTheme()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: "", description: "", time: "09:00" })
  const [reminders, setReminders] = useState<any[]>([])
  const { activeReminders, requestPermission } = useReminderNotifications(reminders)

  useEffect(() => {
    loadTodaysData()
  }, [userId])

  const loadTodaysData = async () => {
    try {
      const sessions = await getTodaysSessions(userId)
      const totalMinutes = sessions.reduce((acc: number, session: any) => acc + (session.duration || 0), 0)
      const totalHours = Math.floor(totalMinutes / 60)
      const remainingMinutes = totalMinutes % 60

      setFocusData((prev) => ({
        ...prev,
        sessions: sessions.length,
        focusTime: totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalMinutes}m`,
        totalSessions: sessions.length,
        totalFocusTime: totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalMinutes}m`,
      }))
    } catch (error) {
      console.error("Error loading today's data:", error)
    }
  }

  const handleSessionComplete = async (duration: number, musicType?: string) => {
    try {
      await createFocusSession({
        userId,
        duration,
        musicType,
        startTime: new Date(),
        endTime: new Date(),
        date: new Date().toISOString().split("T")[0],
      })

      await updateDailyStats(userId, duration)
      await loadTodaysData()
    } catch (error) {
      console.error("Error saving session:", error)
    }
  }

  const addReminder = () => {
    if (!selectedDate || !newReminder.title) return

    const reminder = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split("T")[0],
      title: newReminder.title,
      description: newReminder.description,
      time: newReminder.time,
      isActive: true,
    }

    setReminders((prev) => [...prev, reminder])
    setNewReminder({ title: "", description: "", time: "09:00" })
    setShowReminderModal(false)
  }

  const getReminderDates = () => {
    return reminders.map((r) => new Date(r.date))
  }

  return (
    <div className="flex-1 p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Today's Focus Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-600">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <CardTitle className="text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    Today's Focus
                  </CardTitle>
                </div>
                <p className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="group/card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl hover:from-blue-100 hover:to-cyan-100 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-blue-200/50 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-500 group-hover/card:scale-110 transition-transform duration-300" />
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Focus Time</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors duration-300">
                      {focusData.focusTime}
                    </p>
                  </div>
                  <div className="group/card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-purple-200/50 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-purple-500 group-hover/card:scale-110 transition-transform duration-300" />
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">Sessions</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors duration-300">
                      {focusData.sessions}
                    </p>
                  </div>
                </div>

                {/* Audio Player Integration */}
                <AudioPlayer />
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600">
            <CardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2 relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  <CalendarIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowReminderModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Reminder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate)
                  setSelectedDate(newDate)
                }}
                className="rounded-md border-0"
                modifiers={{
                  reminder: getReminderDates(),
                }}
                modifiersStyles={{
                  reminder: {
                    backgroundColor: "#10b981",
                    color: "white",
                    borderRadius: "50%",
                  },
                }}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-slate-900 dark:text-white",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all duration-200",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-slate-500 dark:text-slate-400 rounded-md w-8 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-slate-100 dark:[&:has([aria-selected])]:bg-slate-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all duration-200 hover:scale-110",
                  day_selected:
                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 focus:from-green-600 focus:to-emerald-600 shadow-lg shadow-green-500/30",
                  day_today: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30",
                  day_outside: "text-slate-400 dark:text-slate-600 opacity-50",
                  day_disabled: "text-slate-400 dark:text-slate-600 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700 aria-selected:text-slate-900 dark:aria-selected:text-white",
                  day_hidden: "invisible",
                }}
              />
              <div className="mt-4 space-y-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="flex justify-between text-sm group/stat hover:bg-white dark:hover:bg-slate-600 p-2 rounded-md transition-all duration-200">
                  <span className="text-slate-600 dark:text-slate-400">Days Focused</span>
                  <span className="text-slate-900 dark:text-white font-semibold group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-400">
                    {focusData.daysFocused}
                  </span>
                </div>
                <div className="flex justify-between text-sm group/stat hover:bg-white dark:hover:bg-slate-600 p-2 rounded-md transition-all duration-200">
                  <span className="text-slate-600 dark:text-slate-400">Avg Focus Time</span>
                  <span className="text-slate-900 dark:text-white font-semibold group-hover/stat:text-purple-600 dark:group-hover/stat:text-purple-400">
                    {focusData.avgFocusTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm group/stat hover:bg-white dark:hover:bg-slate-600 p-2 rounded-md transition-all duration-200">
                  <span className="text-slate-600 dark:text-slate-400">Total Focus</span>
                  <span className="text-slate-900 dark:text-white font-semibold group-hover/stat:text-green-600 dark:group-hover/stat:text-green-400">
                    {focusData.totalFocus}
                  </span>
                </div>
                {reminders.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>
                      {reminders.length} reminder{reminders.length > 1 ? "s" : ""} set
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streaks Section */}
        <Card className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-orange-500/20 dark:hover:shadow-orange-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-orange-300 dark:hover:border-orange-600">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-2 relative z-10">
              <Flame className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
              <CardTitle className="text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                Streaks
              </CardTitle>
            </div>
            <p className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              Today's focus goal completion. Streak is secure.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
              <div className="group/card bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30 cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-100 group-hover/card:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-sm text-orange-100 mb-1 font-medium">Current Streak</p>
                <p className="text-2xl font-bold text-white">{focusData.currentStreak} day</p>
              </div>
              <div className="group/card bg-gradient-to-br from-yellow-500 to-orange-500 p-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-yellow-100 group-hover/card:scale-110 transition-transform duration-300" />
                </div>
                <p className="text-sm text-yellow-100 mb-1 font-medium">Best Streak</p>
                <p className="text-2xl font-bold text-white">{focusData.bestStreak} days</p>
              </div>
              <div className="group/card bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1 font-medium">Days Focused</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors duration-300">
                  1 of 25
                </p>
              </div>
              <div className="group/card bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1 font-medium">Avg Focus Day</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover/card:text-purple-600 dark:group-hover/card:text-purple-400 transition-colors duration-300">
                  {focusData.avgFocusTime}
                </p>
              </div>
              <div className="group/card bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 p-4 rounded-xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1 font-medium">Total Focus</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover/card:text-green-600 dark:group-hover/card:text-green-400 transition-colors duration-300">
                  {focusData.totalFocus}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lifetime Focus Section */}
        <Card className="group bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.01] hover:border-purple-300 dark:hover:border-purple-600">
          <CardHeader className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
              <CardTitle className="text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                Lifetime Focus
              </CardTitle>
            </div>
            <p className="text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              Your total focus achievements since you started using Kairu.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="group/card bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-xl text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 cursor-pointer">
                <Clock className="h-10 w-10 text-purple-100 mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-300" />
                <p className="text-sm text-purple-100 mb-1 font-medium">Total Focus Time</p>
                <p className="text-3xl font-bold text-white">{focusData.totalFocusTime}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3 text-purple-200" />
                  <span className="text-xs text-purple-200">+12% this week</span>
                </div>
              </div>
              <div className="group/card bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-xl text-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40 cursor-pointer">
                <Target className="h-10 w-10 text-blue-100 mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-300" />
                <p className="text-sm text-blue-100 mb-1 font-medium">Total Sessions</p>
                <p className="text-3xl font-bold text-white">{focusData.totalSessions}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3 text-blue-200" />
                  <span className="text-xs text-blue-200">{focusData.sessions} today</span>
                </div>
              </div>
              <div className="group/card bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-xl text-center hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40 cursor-pointer">
                <CalendarIcon className="h-10 w-10 text-green-100 mx-auto mb-3 group-hover/card:scale-110 transition-transform duration-300" />
                <p className="text-sm text-green-100 mb-1 font-medium">Focus Days</p>
                <p className="text-3xl font-bold text-white">{focusData.focusDays}</p>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Award className="h-3 w-3 text-green-200" />
                  <span className="text-xs text-green-200">Streak active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Modal */}
        {showReminderModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Add Reminder for {selectedDate?.toLocaleDateString()}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Study Session, Meeting"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={() => setShowReminderModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={addReminder}
                  disabled={!newReminder.title}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Add Reminder
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
