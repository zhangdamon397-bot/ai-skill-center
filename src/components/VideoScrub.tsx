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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      targetTimeRef.current = 0
      setIsLoaded(true)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
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

  // Poster image is always visible first (img-first for reliability).
  // Once video metadata loads, video overlays on top for scrub interaction.
  return (
    <>
      {poster && (
        <img
          src={poster}
          alt=""
          className="fixed inset-0 z-0 h-full w-full object-cover"
          style={{
            objectPosition: '70% center',
            animation: 'monkey-breath 8s ease-in-out infinite',
          }}
        />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 z-0 h-full w-full object-cover"
        style={{
          objectPosition: '70% center',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </>
  )
}
