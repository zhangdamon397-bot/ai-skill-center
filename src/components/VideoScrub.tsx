import { useEffect, useRef } from 'react'

const SENSITIVITY = 0.8

interface VideoScrubProps {
  src?: string
  poster?: string
}

export function VideoScrub({ src, poster }: VideoScrubProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const isSeekingRef = useRef(false)
  const isLoadedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      isLoadedRef.current = true
      targetTimeRef.current = 0
    }

    const handleSeeked = () => {
      isSeekingRef.current = false
      // 如果目标时间和当前时间还有差距，继续 seek（追赶效果）
      if (
        Math.abs(targetTimeRef.current - video.currentTime) > 0.01 &&
        video.duration
      ) {
        triggerSeek()
      }
    }

    const triggerSeek = () => {
      if (!video.duration) return
      const clamped = Math.max(0, Math.min(targetTimeRef.current, video.duration))
      targetTimeRef.current = clamped
      isSeekingRef.current = true
      video.currentTime = clamped
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLoadedRef.current || !video.duration) return

      const currentX = e.clientX

      if (prevXRef.current === null) {
        prevXRef.current = currentX
        return
      }

      const delta = currentX - prevXRef.current
      prevXRef.current = currentX

      const timeDelta = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTimeRef.current += timeDelta

      if (!isSeekingRef.current) {
        triggerSeek()
      }
    }

    const handleMouseLeave = () => {
      prevXRef.current = null
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!src) return null

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-0 h-full w-full select-none"
      style={{
        objectFit: 'cover',
        objectPosition: '70% center',
        animation: 'monkey-breath 8s ease-in-out infinite',
        willChange: 'currentTime',
      }}
      draggable={false}
    />
  )
}
