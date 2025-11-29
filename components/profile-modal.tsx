"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, X, CalendarIcon, Bell, Save, User } from "lucide-react"
import { type UserProfile, type Reminder, updateUserProfile } from "@/lib/firebase-service"
import { useReminders } from "@/hooks/useReminders"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile | null
  onProfileUpdate: (profile: UserProfile) => void
}

export function ProfileModal({ isOpen, onClose, userProfile, onProfileUpdate }: ProfileModalProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    maxWorkHours: 8,
    preparingFor: "",
    reminders: [],
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newReminder, setNewReminder] = useState({ title: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)

  const { activeReminders } = useReminders(profile.reminders || [])

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile)
    }
  }, [userProfile])

  const handleSave = async () => {
    if (!userProfile?.id) return

    setIsLoading(true)
    try {
      await updateUserProfile(userProfile.id, profile)
      onProfileUpdate({ ...userProfile, ...profile } as UserProfile)
      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addReminder = () => {
    if (!selectedDate || !newReminder.title) return

    const reminder: Reminder = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split("T")[0],
      title: newReminder.title,
      description: newReminder.description,
      isActive: true,
    }

    setProfile((prev) => ({
      ...prev,
      reminders: [...(prev.reminders || []), reminder],
    }))

    setNewReminder({ title: "", description: "" })
  }

  const removeReminder = (reminderId: string) => {
    setProfile((prev) => ({
      ...prev,
      reminders: prev.reminders?.filter((r) => r.id !== reminderId) || [],
    }))
  }

  const getReminderDates = () => {
    return profile.reminders?.map((r) => new Date(r.date)) || []
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-800">
                <AvatarImage src="/placeholder.svg?height=80&width=80&text=K" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  {profile.name?.charAt(0) || "K"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{profile.name || "Your Name"}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Productivity Champion</p>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  Change Photo
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name || ""}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxHours">Maximum Work Hours per Day</Label>
                <Input
                  id="maxHours"
                  type="number"
                  min="1"
                  max="16"
                  value={profile.maxWorkHours || 8}
                  onChange={(e) => setProfile((prev) => ({ ...prev, maxWorkHours: Number.parseInt(e.target.value) }))}
                  className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Preparing For */}
            <div className="space-y-2">
              <Label htmlFor="preparingFor">What are you preparing for?</Label>
              <Textarea
                id="preparingFor"
                value={profile.preparingFor || ""}
                onChange={(e) => setProfile((prev) => ({ ...prev, preparingFor: e.target.value }))}
                placeholder="e.g., UPSC Exam, Software Engineering Interview, Personal Project..."
                rows={3}
                className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>

            {/* Stats Overview */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 border-purple-200 dark:border-slate-600">
              <CardHeader>
                <CardTitle className="text-purple-700 dark:text-purple-300">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">127</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">45h</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Focus Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Streak Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Reminder Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
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
                  />
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Reminder dates</span>
                  </div>
                </CardContent>
              </Card>

              {/* Add Reminder */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Add New Reminder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminderTitle">Reminder Title</Label>
                      <Input
                        id="reminderTitle"
                        value={newReminder.title}
                        onChange={(e) => setNewReminder((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Study Session, Exam Day"
                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminderDesc">Description (Optional)</Label>
                      <Textarea
                        id="reminderDesc"
                        value={newReminder.description}
                        onChange={(e) => setNewReminder((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional details..."
                        rows={2}
                        className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                      />
                    </div>
                    <Button
                      onClick={addReminder}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      disabled={!selectedDate || !newReminder.title}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reminder
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Reminders */}
                {activeReminders.length > 0 && (
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                      <CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                        <Bell className="h-5 w-5 animate-pulse" />
                        Today's Reminders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {activeReminders.map((reminder) => (
                        <div key={reminder.id} className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                          <h4 className="font-medium text-slate-900 dark:text-white">{reminder.title}</h4>
                          {reminder.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{reminder.description}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Reminders List */}
            {profile.reminders && profile.reminders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>All Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900 dark:text-white">{reminder.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(reminder.date).toLocaleDateString()}
                            </Badge>
                          </div>
                          {reminder.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{reminder.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReminder(reminder.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
