"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Settings, RotateCcw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { AudioPlayer } from "@/components/audio-player"
import { createFocusSession, updateDailyStats } from "@/lib/firebase-service"

interface TimerPageProps {
  userId?: string
}

export function TimerPage({ userId = "demo-user" }: TimerPageProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [selectedTime, setSelectedTime] = useState(25)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    sessionsToday: 4,
    focusTime: "2h 15m",
    streakDays: 3,
  })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      handleSessionComplete()
    }
  }, [timeLeft])

  const handleSessionComplete = async () => {
    setIsRunning(false)

    if (!isBreak) {
      // Focus session completed
      const sessionDuration = selectedTime
      try {
        await createFocusSession({
          userId,
          duration: sessionDuration,
          startTime: new Date(),
          endTime: new Date(),
          date: new Date().toISOString().split("T")[0],
        })

        await updateDailyStats(userId, sessionDuration)

        // Update local stats
        setSessionStats((prev) => ({
          ...prev,
          sessionsToday: prev.sessionsToday + 1,
        }))

        // Switch to break
        setTimeLeft(5 * 60) // 5 minute break
        setIsBreak(true)

        // Show completion notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Focus Session Complete!", {
            body: `Great job! You focused for ${selectedTime} minutes. Time for a break.`,
            icon: "/favicon.ico",
          })
        }
      } catch (error) {
        console.error("Error saving session:", error)
      }
    } else {
      // Break completed
      setTimeLeft(selectedTime * 60)
      setIsBreak(false)

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Break Complete!", {
          body: "Ready for another focus session?",
          icon: "/favicon.ico",
        })
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(selectedTime * 60)
    setIsBreak(false)
  }

  const handleTimeChange = (value: number[]) => {
    if (!isRunning) {
      setSelectedTime(value[0])
      setTimeLeft(value[0] * 60)
    }
  }

  const progress = ((selectedTime * 60 - timeLeft) / (selectedTime * 60)) * 100

  return (
    <div className="flex-1 p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Focus Timer</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay focused with the Pomodoro technique and ambient sounds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Timer Section */}
          <div className="space-y-6">
            {/* Main Timer */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Timer Display */}
                  <div className="relative">
                    <div
                      className={`w-48 h-48 sm:w-64 sm:h-64 mx-auto rounded-full border-8 ${
                        isBreak
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                          : "border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20"
                      } flex items-center justify-center relative overflow-hidden transition-all duration-500`}
                    >
                      {/* Progress ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-slate-200 dark:text-slate-700"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={isBreak ? "#3b82f6" : "#f97316"}
                          strokeWidth="2"
                          strokeDasharray={`${progress * 2.827} 282.7`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>

                      <div className="text-center z-10">
                        <div className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                          {formatTime(timeLeft)}
                        </div>
                        <Badge
                          className={`${
                            isBreak
                              ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                              : "bg-gradient-to-r from-orange-500 to-red-500"
                          } text-white px-4 py-1`}
                        >
                          {isBreak ? "BREAK" : "FOCUS"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    {!isRunning ? (
                      <Button
                        onClick={handleStart}
                        size="lg"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-200 px-8"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePause}
                        size="lg"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:scale-105 transition-all duration-200 px-8"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}

                    <Button
                      onClick={handleReset}
                      size="lg"
                      variant="outline"
                      className="hover:scale-105 transition-all duration-200 px-8 bg-transparent"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Time Selector */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Focus Duration</span>
                      <span>{selectedTime} minutes</span>
                    </div>
                    <Slider
                      value={[selectedTime]}
                      onValueChange={handleTimeChange}
                      max={60}
                      min={5}
                      step={5}
                      disabled={isRunning}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>5m</span>
                      <span>25m</span>
                      <span>45m</span>
                      <span>60m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-blue-200 dark:border-slate-600 hover:scale-105 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{sessionStats.sessionsToday}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Sessions Today</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 border-green-200 dark:border-slate-600 hover:scale-105 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{sessionStats.focusTime}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Focus Time</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 border-purple-200 dark:border-slate-600 hover:scale-105 transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{sessionStats.streakDays}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Streak Days</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Music Section */}
          <div className="space-y-6">
            <AudioPlayer />

            {/* Quick Settings */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => !isRunning && handleTimeChange([25])}
                    className="justify-start hover:scale-105 transition-all duration-200 bg-transparent"
                    disabled={isRunning}
                  >
                    🍅 Pomodoro (25m)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => !isRunning && handleTimeChange([5])}
                    className="justify-start hover:scale-105 transition-all duration-200 bg-transparent"
                    disabled={isRunning}
                  >
                    ☕ Short Break (5m)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => !isRunning && handleTimeChange([15])}
                    className="justify-start hover:scale-105 transition-all duration-200 bg-transparent"
                    disabled={isRunning}
                  >
                    🌙 Long Break (15m)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => !isRunning && handleTimeChange([45])}
                    className="justify-start hover:scale-105 transition-all duration-200 bg-transparent"
                    disabled={isRunning}
                  >
                    🎯 Deep Work (45m)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
