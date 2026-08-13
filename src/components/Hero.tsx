import { useState, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

const TYPEWRITER_TEXT =
  '欢迎来到AI技能提升中心，从这里开启你的AI学习之旅。'

const PILL_BUTTONS = [
  'AIGC',
  'AI应用开发',
  'AI Agent开发',
  '巨型机器人',
]

const EMAIL = 'XXX@163.com'

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1" />
      <rect x="1" y="1" width="7" height="7" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function Hero() {
  const { displayed, done } = useTypewriter({
    text: TYPEWRITER_TEXT,
    speed: 80,
    startDelay: 600,
  })

  const [showPills, setShowPills] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPills(true)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="relative z-1 flex h-screen flex-col overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:pb-0 md:px-10">
      <div className="relative z-10 max-w-xl">
        {/* Blurred intro label */}
        <div className="pointer-events-none mb-5 select-none sm:mb-6">
          <p
            className="font-normal text-black"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            从学会AI到用AI创造价值！
          </p>
        </div>

        {/* Typewriter text */}
        <p
          className="mb-5 font-normal text-black sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="ml-[2px] inline-block align-middle bg-black"
              style={{
                width: '2px',
                height: '1.1em',
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </p>

        {/* Action pill buttons */}
        <div
          className="flex flex-wrap gap-y-1"
          style={{
            opacity: showPills ? 1 : 0,
            transform: showPills ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {PILL_BUTTONS.map((label) => (
            <button
              key={label}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
              style={{ margin: '0 0.2em 0.4em 0.2em' }}
            >
              {label}
            </button>
          ))}

          {/* Outline pill button with email */}
          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent text-white transition-colors duration-200 hover:bg-white hover:text-black"
            style={{
              gap: 'clamp(8px, 2vw, 12px)',
              padding: '0.3em 1em',
              margin: '0 0.2em 0.4em 0.2em',
              fontSize: 'clamp(13px, 3vw, 15px)',
            }}
          >
            <span>
              联系我们：
              <u className="underline-offset-1">{EMAIL}</u>
            </span>
            <CopyIcon />
          </button>
        </div>

        {copied && (
          <p
            className="mt-2 text-sm text-white"
            style={{ fontSize: '13px', opacity: 0.8 }}
          >
            邮箱已复制到剪贴板！
          </p>
        )}
      </div>
    </section>
  )
}
