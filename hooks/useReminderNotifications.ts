"use client"

import { useState, useEffect, useCallback } from "react"
import type { Reminder } from "@/lib/firebase-service"

export const useReminderNotifications = (reminders: Reminder[]) => {
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([])
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission)
        })
      }
    }
  }, [])

  const playNotificationSound = useCallback(() => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn("Could not play notification sound:", error)
      // Fallback: try to play a simple beep
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
        )
        audio.volume = 0.3
        audio.play().catch(() => {})
      } catch (fallbackError) {
        console.warn("Fallback sound also failed:", fallbackError)
      }
    }
  }, [])

  const showNotification = useCallback(
    (reminder: Reminder) => {
      if (notificationPermission === "granted") {
        const notification = new Notification(`📅 Reminder: ${reminder.title}`, {
          body: reminder.description || "You have a task to complete!",
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: `reminder-${reminder.id}`,
          requireInteraction: true,
          actions: [
            { action: "complete", title: "Mark Complete" },
            { action: "snooze", title: "Snooze 10min" },
          ],
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        // Auto close after 10 seconds
        setTimeout(() => {
          notification.close()
        }, 10000)
      }
    },
    [notificationPermission],
  )

  const checkReminders = useCallback(() => {
    const now = new Date()
    const currentDate = now.toISOString().split("T")[0]
    const currentTime = now.getHours() * 60 + now.getMinutes()

    const todaysReminders = reminders.filter((reminder) => {
      if (!reminder.isActive || reminder.date !== currentDate) return false

      // Check if it's time for the reminder (within 1 minute window)
      const reminderTime = reminder.time
        ? Number.parseInt(reminder.time.split(":")[0]) * 60 + Number.parseInt(reminder.time.split(":")[1])
        : 9 * 60 // Default to 9 AM if no time set

      return Math.abs(currentTime - reminderTime) <= 1
    })

    if (todaysReminders.length > 0) {
      setActiveReminders(todaysReminders)
      todaysReminders.forEach((reminder) => {
        playNotificationSound()
        showNotification(reminder)
      })
    }
  }, [reminders, playNotificationSound, showNotification])

  useEffect(() => {
    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000)
    // Check immediately
    checkReminders()

    return () => clearInterval(interval)
  }, [checkReminders])

  return {
    activeReminders,
    notificationPermission,
    requestPermission: () => {
      if ("Notification" in window && Notification.permission === "default") {
        return Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission)
          return permission
        })
      }
      return Promise.resolve(notificationPermission)
    },
  }
}
