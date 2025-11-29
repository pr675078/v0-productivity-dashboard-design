"use client"

import { useState, useEffect } from "react"
import type { Reminder } from "@/lib/firebase-service"

export const useReminders = (reminders: Reminder[]) => {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([])

  useEffect(() => {
    const checkReminders = () => {
      const today = new Date().toISOString().split("T")[0]
      const todaysReminders = reminders.filter((reminder) => reminder.date === today && reminder.isActive)

      if (todaysReminders.length > 0) {
        setActiveReminders(todaysReminders)
        // Play reminder sound
        playReminderSound()
        // Show notification
        showReminderNotification(todaysReminders[0])
      }
    }

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000)
    // Check immediately
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders])

  const playReminderSound = () => {
    const audio = new Audio("/sounds/notification.mp3")
    audio.play().catch(console.error)
  }

  const showReminderNotification = (reminder: Reminder) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Reminder", {
        body: reminder.title,
        icon: "/favicon.ico",
      })
    }
  }

  return { activeReminders }
}
