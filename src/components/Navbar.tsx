import { useState } from 'react'

const navLinks = ['课程体系', '中心介绍', '师资团队', '关于我们']

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5 md:px-10">
        {/* Logo */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] tracking-tight text-black sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AI技能提升中心
          </span>
          <span
            className="select-none text-[25px] text-black sm:text-[30px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden items-center md:flex">
          {navLinks.map((link, index) => (
            <span key={link} className="flex items-center text-[23px] text-black">
              <a
                href="#"
                className="transition-opacity hover:opacity-60"
              >
                {link}
              </a>
              {index < navLinks.length - 1 && <span className="mx-2">,</span>}
            </span>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="mailto:XXX@163.com"
            className="text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60"
          >
            联系我们
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-[5px] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-300"
            style={{
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }}
          />
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-300"
            style={{
              opacity: mobileMenuOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-[2px] w-6 bg-black transition-all duration-300"
            style={{
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-9 flex flex-col items-start justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="mailto:XXX@163.com"
          className="text-[32px] font-medium text-black underline underline-offset-2"
          style={{ fontFamily: 'var(--font-heading)' }}
          onClick={() => setMobileMenuOpen(false)}
        >
          联系我们
        </a>
      </div>
    </>
  )
}
