"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export const useAudio = (src: string) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const initializeAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    try {
      const audio = new Audio()
      audio.preload = "metadata"
      audio.loop = true
      audio.volume = volume

      // Event listeners
      audio.addEventListener("loadeddata", () => {
        setIsLoaded(true)
        setHasError(false)
      })

      audio.addEventListener("error", (e) => {
        console.warn(`Audio loading failed for ${src}:`, e)
        setHasError(true)
        setIsLoaded(false)
        setIsPlaying(false)
      })

      audio.addEventListener("canplay", () => {
        setIsLoaded(true)
        setHasError(false)
      })

      audio.addEventListener("ended", () => {
        setIsPlaying(false)
      })

      audio.addEventListener("pause", () => {
        setIsPlaying(false)
      })

      audio.addEventListener("play", () => {
        setIsPlaying(true)
      })

      // Set source and load
      audio.src = src
      audioRef.current = audio

      // Try to load the audio
      audio.load()
    } catch (error) {
      console.warn(`Failed to initialize audio for ${src}:`, error)
      setHasError(true)
      setIsLoaded(false)
    }
  }, [src, volume])

  useEffect(() => {
    initializeAudio()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [initializeAudio])

  useEffect(() => {
    if (audioRef.current && isLoaded) {
      audioRef.current.volume = volume
    }
  }, [volume, isLoaded])

  const play = useCallback(async () => {
    if (!audioRef.current || hasError || !isLoaded) {
      console.warn("Audio not ready or has error")
      return false
    }

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      return true
    } catch (error) {
      console.warn("Failed to play audio:", error)
      setHasError(true)
      setIsPlaying(false)
      return false
    }
  }, [hasError, isLoaded])

  const pause = useCallback(() => {
    if (audioRef.current && !hasError) {
      try {
        audioRef.current.pause()
        setIsPlaying(false)
      } catch (error) {
        console.warn("Failed to pause audio:", error)
      }
    }
  }, [hasError])

  const toggle = useCallback(async () => {
    if (isPlaying) {
      pause()
      return true
    } else {
      return await play()
    }
  }, [isPlaying, play, pause])

  return {
    isPlaying,
    isLoaded,
    hasError,
    play,
    pause,
    toggle,
    volume,
    setVolume,
  }
}
