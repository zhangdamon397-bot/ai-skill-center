import { useState, useEffect, useRef } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number
  startDelay?: number
}

interface UseTypewriterReturn {
  displayed: string
  done: boolean
}

export function useTypewriter({
  text,
  speed = 38,
  startDelay = 600,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    const startTyping = () => {
      intervalRef.current = window.setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))

        if (indexRef.current >= text.length) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setDone(true)
        }
      }, speed)
    }

    timeoutRef.current = window.setTimeout(startTyping, startDelay)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
