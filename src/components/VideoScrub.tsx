import { useEffect, useRef } from 'react'

const BASE_POSITION = 70 // percentage
const PARALLAX_RANGE = 4 // total range, ±2% from center

interface VideoScrubProps {
  src?: string
  poster?: string
}

export function VideoScrub({ poster }: VideoScrubProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const targetOffsetRef = useRef(0)
  const currentOffsetRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const ratio = e.clientX / window.innerWidth // 0 ~ 1
      const centered = ratio - 0.5 // -0.5 ~ 0.5
      targetOffsetRef.current = centered * PARALLAX_RANGE // -2% ~ +2%
    }

    const animate = () => {
      const img = imgRef.current
      if (!img) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      // Smoothly interpolate current toward target
      const diff = targetOffsetRef.current - currentOffsetRef.current
      currentOffsetRef.current += diff * 0.1

      const pos = BASE_POSITION + currentOffsetRef.current
      img.style.objectPosition = `${pos}% center`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  if (!poster) return null

  return (
    <img
      ref={imgRef}
      src={poster}
      alt=""
      className="fixed inset-0 z-0 h-full w-full select-none"
      style={{
        objectFit: 'cover',
        objectPosition: `${BASE_POSITION}% center`,
        animation: 'monkey-breath 8s ease-in-out infinite',
        willChange: 'object-position',
      }}
      draggable={false}
    />
  )
}
