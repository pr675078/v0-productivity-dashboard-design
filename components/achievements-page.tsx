"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Download, Trophy, Clock, Target, Flame, Award, Star, Zap } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

const achievements = [
  {
    id: 1,
    title: "4 Hour Focus Master",
    description: "Completed 4 consecutive hours of focused work",
    icon: Clock,
    progress: 100,
    unlocked: true,
    rarity: "Epic",
    color: "from-purple-500 to-pink-500",
    date: "July 25, 2025",
    category: "Focus Time",
  },
  {
    id: 2,
    title: "3 Day Streak",
    description: "Maintained focus streak for 3 consecutive days",
    icon: Flame,
    progress: 100,
    unlocked: true,
    rarity: "Rare",
    color: "from-orange-500 to-red-500",
    date: "July 23, 2025",
    category: "Streaks",
  },
  {
    id: 3,
    title: "7 Day Warrior",
    description: "Achieved 7 days of consistent productivity",
    icon: Award,
    progress: 85,
    unlocked: false,
    rarity: "Epic",
    color: "from-blue-500 to-cyan-500",
    date: "In Progress",
    category: "Streaks",
  },
  {
    id: 4,
    title: "1 Year Champion",
    description: "One full year of productivity excellence",
    icon: Trophy,
    progress: 12,
    unlocked: false,
    rarity: "Legendary",
    color: "from-yellow-500 to-orange-500",
    date: "Long Term Goal",
    category: "Milestones",
  },
  {
    id: 5,
    title: "Early Bird",
    description: "Started work before 6 AM for 5 days",
    icon: Star,
    progress: 100,
    unlocked: true,
    rarity: "Common",
    color: "from-green-500 to-emerald-500",
    date: "July 20, 2025",
    category: "Habits",
  },
  {
    id: 6,
    title: "Speed Demon",
    description: "Completed 10 tasks in under 2 hours",
    icon: Zap,
    progress: 70,
    unlocked: false,
    rarity: "Rare",
    color: "from-indigo-500 to-purple-500",
    date: "In Progress",
    category: "Efficiency",
  },
]

const stats = [
  { label: "Total Achievements", value: "3/6", color: "from-blue-500 to-cyan-500" },
  { label: "Achievement Points", value: "1,250", color: "from-purple-500 to-pink-500" },
  { label: "Rarest Badge", value: "Epic", color: "from-orange-500 to-red-500" },
  { label: "Completion Rate", value: "50%", color: "from-green-500 to-emerald-500" },
]

export function AchievementsPage() {
  const { theme } = useTheme()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "from-yellow-400 to-orange-400"
      case "Epic":
        return "from-purple-400 to-pink-400"
      case "Rare":
        return "from-blue-400 to-cyan-400"
      case "Common":
        return "from-green-400 to-emerald-400"
      default:
        return "from-slate-400 to-slate-500"
    }
  }

  const shareAchievement = async (achievement: any) => {
    try {
      // Create a rich badge sharing message
      const badgeEmoji =
        achievement.rarity === "Legendary"
          ? "🏆"
          : achievement.rarity === "Epic"
            ? "🥇"
            : achievement.rarity === "Rare"
              ? "🥈"
              : "🥉"

      const categoryEmoji =
        achievement.category === "Focus Time"
          ? "⏰"
          : achievement.category === "Streaks"
            ? "🔥"
            : achievement.category === "Milestones"
              ? "🎯"
              : achievement.category === "Habits"
                ? "💪"
                : achievement.category === "Efficiency"
                  ? "⚡"
                  : "🌟"

      const shareText = `${badgeEmoji} ACHIEVEMENT UNLOCKED! ${badgeEmoji}

🎖️ ${achievement.title}
${categoryEmoji} Category: ${achievement.category}
⭐ Rarity: ${achievement.rarity}
📊 Progress: ${achievement.progress}%
📅 Earned: ${achievement.date}

💬 "${achievement.description}"

🚀 Achieved through dedication and focus!
#ProductivityGoals #Achievement #Focus #Success`

      // Try Web Share API first (mobile devices)
      if (navigator.share) {
        try {
          await navigator.share({
            title: `🏆 Achievement: ${achievement.title}`,
            text: shareText,
          })
          return
        } catch (shareError) {
          // User cancelled or share failed, continue to fallback
          console.log("Web Share cancelled or failed, trying clipboard")
        }
      }

      // Fallback: Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)

        // Show success feedback
        const button = document.activeElement as HTMLElement
        if (button && button.textContent) {
          const originalText = button.textContent
          button.textContent = "Copied!"
          button.style.backgroundColor = "#10b981"
          button.style.color = "white"

          setTimeout(() => {
            button.textContent = originalText
            button.style.backgroundColor = ""
            button.style.color = ""
          }, 2000)
        }

        // Show a temporary success message
        const successDiv = document.createElement("div")
        successDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ Achievement copied to clipboard!
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `
        document.body.appendChild(successDiv)

        setTimeout(() => {
          document.body.removeChild(successDiv)
        }, 3000)
      } else {
        // Final fallback: Show in alert
        alert(`🏆 Share this achievement:\n\n${shareText}`)
      }
    } catch (error) {
      console.warn("Share failed:", error)

      // Create fallback share text
      const badgeEmoji =
        achievement.rarity === "Legendary"
          ? "🏆"
          : achievement.rarity === "Epic"
            ? "🥇"
            : achievement.rarity === "Rare"
              ? "🥈"
              : "🥉"

      const shareText = `${badgeEmoji} ACHIEVEMENT UNLOCKED!\n\n🎖️ ${achievement.title}\n⭐ ${achievement.rarity}\n📅 ${achievement.date}\n\n"${achievement.description}"\n\n#ProductivityGoals #Achievement`

      // Try clipboard as final attempt
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText)
          alert("✅ Achievement copied to clipboard!")
        } else {
          alert(`🏆 Share this achievement:\n\n${shareText}`)
        }
      } catch (clipboardError) {
        alert(`🏆 Share this achievement:\n\n${shareText}`)
      }
    }
  }

  const shareAllAchievements = async () => {
    const unlockedAchievements = achievements.filter((a) => a.unlocked)

    const shareText = `🏆 MY PRODUCTIVITY ACHIEVEMENTS 🏆

${unlockedAchievements
  .map((a, index) => {
    const badgeEmoji = a.rarity === "Legendary" ? "🏆" : a.rarity === "Epic" ? "🥇" : a.rarity === "Rare" ? "🥈" : "🥉"
    return `${index + 1}. ${badgeEmoji} ${a.title} (${a.rarity})`
  })
  .join("\n")}

📊 Total Unlocked: ${unlockedAchievements.length} achievements
🎯 Completion Rate: ${Math.round((unlockedAchievements.length / achievements.length) * 100)}%
⭐ Achievement Points: 1,250

💪 Achieved through dedication and consistent focus!
#ProductivityGoals #Achievements #Success #Focus`

    try {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "🏆 My Productivity Achievements",
            text: shareText,
          })
          return
        } catch (shareError) {
          console.log("Web Share cancelled, trying clipboard")
        }
      }

      // Fallback to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText)

        // Show success message
        const successDiv = document.createElement("div")
        successDiv.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        ">
          ✅ All achievements copied to clipboard!
        </div>
        <style>
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        </style>
      `
        document.body.appendChild(successDiv)

        setTimeout(() => {
          document.body.removeChild(successDiv)
        }, 3000)
      } else {
        alert(`🏆 Share your achievements:\n\n${shareText}`)
      }
    } catch (error) {
      console.warn("Share all failed:", error)
      alert(`🏆 Share your achievements:\n\n${shareText}`)
    }
  }

  return (
    <div className="flex-1 p-3 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Achievements</h1>
            <p className="text-slate-600 dark:text-slate-400">Track your productivity milestones and unlock badges</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={shareAllAchievements}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share All
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color} mb-3`}
                  >
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon
            return (
              <Card
                key={achievement.id}
                className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  achievement.unlocked
                    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-purple-500/20"
                    : "bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 opacity-75"
                }`}
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />

                {/* Rarity indicator */}
                <div className="absolute top-3 right-3">
                  <Badge
                    className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white text-xs font-bold`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 rounded-full bg-gradient-to-r ${achievement.color} ${!achievement.unlocked && "grayscale"} transition-all duration-300 group-hover:scale-110`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle
                        className={`text-lg ${achievement.unlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300`}
                      >
                        {achievement.title}
                      </CardTitle>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{achievement.category}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p
                    className={`text-sm mb-4 ${achievement.unlocked ? "text-slate-600 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"}`}
                  >
                    {achievement.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400">{achievement.date}</span>
                    {achievement.unlocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => shareAchievement(achievement)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    )}
                  </div>

                  {achievement.unlocked && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-pulse">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Achievement Categories */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Focus Time", "Streaks", "Milestones", "Habits", "Efficiency"].map((category) => (
                <div
                  key={category}
                  className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 cursor-pointer group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
