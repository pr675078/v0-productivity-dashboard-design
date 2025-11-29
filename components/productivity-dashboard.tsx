"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { TimelinePage } from "@/components/timeline-page"
import { TodoPage } from "@/components/todo-page"
import { AchievementsPage } from "@/components/achievements-page"
import { TimerPage } from "@/components/timer-page"
import { ProfileModal } from "@/components/profile-modal"
import { ThemeProvider } from "@/components/theme-provider"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { type UserProfile, getUserProfile, createUserProfile } from "@/lib/firebase-service"
import { isDemo } from "@/lib/firebase"

export function ProductivityDashboard() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userId] = useState("demo-user") // In real app, get from auth
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserProfile()
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      let profile = await getUserProfile(userId)
      if (!profile) {
        // Create default profile
        const defaultProfile = {
          name: "Kairu User",
          email: "user@example.com",
          maxWorkHours: 8,
          preparingFor: "Achieving productivity goals",
          reminders: [],
        }
        await createUserProfile(userId, defaultProfile)
        profile = await getUserProfile(userId)
      }
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)
      // Set a default profile in case of error
      setUserProfile({
        id: userId,
        name: "Kairu User",
        email: "user@example.com",
        maxWorkHours: 8,
        preparingFor: "Achieving productivity goals",
        reminders: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile)
  }

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case "home":
        return <DashboardContent userId={userId} />
      case "timer":
        return <TimerPage userId={userId} />
      case "timeline":
        return <TimelinePage userId={userId} />
      case "todo":
        return <TodoPage userId={userId} />
      case "achievements":
        return <AchievementsPage userId={userId} />
      default:
        return <DashboardContent userId={userId} />
    }
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen transition-colors duration-300">
        {isDemo && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 text-center text-sm font-medium">
            <Badge variant="outline" className="mr-2 bg-white/20 text-white border-white/30">
              DEMO MODE
            </Badge>
            Running in demo mode. Configure Firebase to enable full functionality.
          </div>
        )}

        <SidebarProvider defaultOpen={true}>
          <AppSidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            userProfile={userProfile}
            onProfileClick={() => setIsProfileOpen(true)}
          />
          <SidebarInset>{renderPage()}</SidebarInset>
        </SidebarProvider>

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>
    </ThemeProvider>
  )
}
