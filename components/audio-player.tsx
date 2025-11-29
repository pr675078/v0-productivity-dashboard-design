"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2 } from "lucide-react"
import { useAudio } from "@/hooks/useAudio"
import { Badge } from "@/components/ui/badge"

const musicOptions = [
  {
    id: "rain",
    name: "Spring Rain",
    icon: "🌧️",
    color: "from-blue-500 to-cyan-500",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spring%20Rain%20-%20TIDE%20-%20Sleep.%20Focus.%20Meditation.%20Relax.-iCUuC4Wm6WZh5wGQp8NpnTyjWefQ24.mp3",
    fallback: "Gentle rainfall sounds for deep focus",
  },
  {
    id: "forest",
    name: "Rainforest",
    icon: "🌲",
    color: "from-green-500 to-emerald-500",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rainforest%20-%20TIDE%20-%20Sleep.%20Focus.%20Meditation.%20Relax.-tNoJiO18M3skum4PDkpCxawnM1CM06.mp3",
    fallback: "Natural forest ambience for concentration",
  },
  {
    id: "meditative",
    name: "Meditative",
    icon: "🧘",
    color: "from-purple-500 to-pink-500",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tide%20app_%20Muse%20%28study%2C%20work%2C%20relax%29-yfBgYIOTK2CVdB4eIevuhU1TQQmcxf.mp3",
    fallback: "Calming meditation sounds for mindfulness",
  },
]

interface AudioPlayerProps {
  className?: string
}

export function AudioPlayer({ className }: AudioPlayerProps) {
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null)
  const [volume, setVolume] = useState([50])
  const [isMuted, setIsMuted] = useState(false)
  const [audioSupported, setAudioSupported] = useState(true)

  const rainAudio = useAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Spring%20Rain%20-%20TIDE%20-%20Sleep.%20Focus.%20Meditation.%20Relax.-iCUuC4Wm6WZh5wGQp8NpnTyjWefQ24.mp3")
  const forestAudio = useAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rainforest%20-%20TIDE%20-%20Sleep.%20Focus.%20Meditation.%20Relax.-tNoJiO18M3skum4PDkpCxawnM1CM06.mp3")
  const meditativeAudio = useAudio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tide%20app_%20Muse%20%28study%2C%20work%2C%20relax%29-yfBgYIOTK2CVdB4eIevuhU1TQQmcxf.mp3")

  const audioPlayers = {
    rain: rainAudio,
    forest: forestAudio,
    meditative: meditativeAudio,
  }

  useEffect(() => {
    // Check if audio is supported
    try {
      const audio = new Audio()
      if (!audio.canPlayType) {
        setAudioSupported(false)
      }
    } catch (error) {
      setAudioSupported(false)
    }
  }, [])

  const handleMusicSelect = async (musicId: string) => {
    if (!audioSupported) {
      console.warn("Audio not supported in this browser")
      return
    }

    // Stop all other audio
    Object.entries(audioPlayers).forEach(([id, player]) => {
      if (id !== musicId) {
        player.pause()
      }
    })

    const currentPlayer = audioPlayers[musicId as keyof typeof audioPlayers]

    if (selectedMusic === musicId) {
      // Toggle current music
      const success = await currentPlayer.toggle()
      if (!success && !currentPlayer.isPlaying) {
        setSelectedMusic(null)
      }
    } else {
      // Start new music
      setSelectedMusic(musicId)
      const success = await currentPlayer.play()
      if (!success) {
        setSelectedMusic(null)
      }
    }
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume)
    const volumeValue = isMuted ? 0 : newVolume[0] / 100
    Object.values(audioPlayers).forEach((player) => {
      player.setVolume(volumeValue)
    })
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    const volumeValue = isMuted ? volume[0] / 100 : 0
    Object.values(audioPlayers).forEach((player) => {
      player.setVolume(volumeValue)
    })
  }

  const currentPlayer = selectedMusic ? audioPlayers[selectedMusic as keyof typeof audioPlayers] : null

  if (!audioSupported) {
    return (
      <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Audio Not Supported</h3>
              <p className="text-sm">Your browser doesn't support audio playback.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Focus Music</h3>
          {selectedMusic && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => currentPlayer?.toggle()}
                className="hover:scale-110 transition-transform duration-200"
                disabled={currentPlayer?.hasError}
              >
                {!currentPlayer?.isLoaded ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentPlayer?.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="hover:scale-110 transition-transform duration-200"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{isMuted ? "0%" : `${volume[0]}%`}</span>
        </div>

        {/* Music Options */}
        <div className="grid grid-cols-1 gap-2">
          {musicOptions.map((music) => {
            const isSelected = selectedMusic === music.id
            const player = audioPlayers[music.id as keyof typeof audioPlayers]
            const isPlaying = isSelected && player?.isPlaying
            const hasError = player?.hasError
            const isLoading = isSelected && !player?.isLoaded && !hasError

            return (
              <Button
                key={music.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => handleMusicSelect(music.id)}
                disabled={hasError}
                className={`justify-start h-auto p-3 transition-all duration-300 hover:scale-105 ${
                  isSelected && !hasError
                    ? `bg-gradient-to-r ${music.color} text-white border-transparent hover:opacity-90`
                    : hasError
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 opacity-60 cursor-not-allowed"
                      : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="text-lg">{hasError ? "❌" : music.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-medium flex items-center gap-2">
                      {music.name}
                      {hasError && (
                        <Badge variant="outline" className="text-xs text-red-500 border-red-300">
                          Error
                        </Badge>
                      )}
                    </div>
                    {isPlaying && (
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                        Now Playing
                      </div>
                    )}
                    {isLoading && (
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Loading...
                      </div>
                    )}
                    {hasError && <div className="text-xs text-red-500">{music.fallback}</div>}
                  </div>
                  {isSelected && !hasError && (
                    <div className="flex items-center gap-1">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        {/* Status Display */}
        {selectedMusic && !audioPlayers[selectedMusic as keyof typeof audioPlayers]?.hasError && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              {currentPlayer?.isPlaying ? "Playing" : currentPlayer?.isLoaded ? "Paused" : "Loading"}:{" "}
              {musicOptions.find((m) => m.id === selectedMusic)?.name}
            </div>
          </div>
        )}

        {/* Error Message */}
        {selectedMusic && audioPlayers[selectedMusic as keyof typeof audioPlayers]?.hasError && (
          <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4" />
              Audio file could not be loaded. Enjoying the peaceful silence instead.
            </div>
          </div>
        )}

        {/* Fallback Message */}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
          🎵 Focus music helps improve concentration and productivity
        </div>
      </CardContent>
    </Card>
  )
}
