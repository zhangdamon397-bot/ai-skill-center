import { useRef, useEffect, useState } from 'react'

const SENSITIVITY = 0.8

interface VideoScrubProps {
  src: string
  poster?: string
}

export function VideoScrub({ src, poster }: VideoScrubProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const prevXRef = useRef<number | null>(null)
  const isSeekingRef = useRef(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasVideoError, setHasVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      targetTimeRef.current = 0
      setIsLoaded(true)
    }

    const handleError = () => {
      setHasVideoError(true)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('error', handleError)
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const performSeek = () => {
      if (!video.duration || !isLoaded) return
      const clamped = Math.max(0, Math.min(targetTimeRef.current, video.duration))
      isSeekingRef.current = true
      video.currentTime = clamped
    }

    const handleSeeked = () => {
      isSeekingRef.current = false
      const video = videoRef.current
      if (!video) return
      const diff = Math.abs(targetTimeRef.current - video.currentTime)
      if (diff > 0.01 && video.duration) {
        performSeek()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current
      if (!video || !video.duration) return

      const currentX = e.clientX
      if (prevXRef.current === null) {
        prevXRef.current = currentX
        return
      }

      const delta = currentX - prevXRef.current
      prevXRef.current = currentX

      const timeDelta = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTimeRef.current = Math.max(
        0,
        Math.min(targetTimeRef.current + timeDelta, video.duration)
      )

      if (!isSeekingRef.current) {
        performSeek()
      }
    }

    const handleMouseLeave = () => {
      prevXRef.current = null
    }

    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isLoaded])

  // Fallback: show poster image with subtle breathing animation if video fails
  if (hasVideoError && poster) {
    return (
      <img
        src={poster}
        alt=""
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: '70% center',
          animation: 'monkey-breath 8s ease-in-out infinite',
        }}
      />
    )
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: '70% center' }}
    />
  )
}
