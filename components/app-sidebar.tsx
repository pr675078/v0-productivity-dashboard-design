"use client"

import {
  Home,
  Timer,
  Calendar,
  CheckSquare,
  Trophy,
  Settings,
  Users,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"
import type { UserProfile } from "@/lib/firebase-service"

interface AppSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  userProfile: UserProfile | null
  onProfileClick: () => void
}

const navigationItems = [
  { title: "Home", icon: Home, page: "home", color: "text-blue-400" },
  { title: "Focus", icon: Timer, page: "timer", color: "text-purple-400" },
  { title: "Timeline", icon: Calendar, page: "timeline", color: "text-pink-400" },
  { title: "Todo List", icon: CheckSquare, page: "todo", color: "text-cyan-400" },
  { title: "Achievements", icon: Trophy, page: "achievements", color: "text-purple-400" },
]

const userActions = [
  { title: "Settings", icon: Settings, color: "text-slate-400" },
  { title: "Contact Us", icon: MessageSquare, color: "text-blue-400" },
  { title: "Log out", icon: LogOut, color: "text-red-400" },
]

export function AppSidebar({ currentPage, onPageChange, userProfile, onProfileClick }: AppSidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Sidebar className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onProfileClick}>
          <Avatar className="h-10 w-10 ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 group-hover:ring-4">
            <AvatarImage src="/placeholder.svg?height=40&width=40&text=K" alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
              {userProfile?.name?.charAt(0) || "K"}
            </AvatarFallback>
          </Avatar>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{userProfile?.name || "Kairu"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userProfile?.preparingFor || "Stay focused, achieve more."}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={currentPage === item.page}
                onClick={() => onPageChange(item.page)}
                className="group relative overflow-hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-500 data-[active=true]:to-pink-500 data-[active=true]:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <item.icon
                  className={`h-4 w-4 ${currentPage === item.page ? "text-white" : item.color} transition-colors duration-300`}
                />
                <span className="relative z-10">{item.title}</span>
                {item.title === "Challenges" && null}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <SidebarSeparator className="my-4 bg-slate-200 dark:bg-slate-800" />

        <div className="px-2 mb-4">
          <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 group">
            <Avatar className="h-8 w-8 ring-2 ring-slate-300 dark:ring-slate-600 group-hover:ring-purple-400 transition-all duration-300">
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=U" alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-slate-500 to-slate-600 text-white text-xs">
                U
              </AvatarFallback>
            </Avatar>
            <div className="transition-transform duration-300 group-hover:translate-x-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white">The Quick and</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Revered Kudu</p>
            </div>
          </div>

          <SidebarMenu>
            {userActions.map((action) => (
              <SidebarMenuItem key={action.title}>
                <SidebarMenuButton className="group text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105">
                  <action.icon
                    className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                  <span>{action.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-110 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
            {theme === "dark" ? (
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 group-hover:rotate-180" />
            ) : (
              <Moon className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 group-hover:-rotate-12" />
            )}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-110"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 dark:text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:scale-110"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
