import { useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')
  const pick = (t) => {
    document.documentElement.setAttribute('data-theme', t)
    try {
      localStorage.setItem('acm-theme', t)
    } catch {}
    setTheme(t)
  }
  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button className={theme === 'light' ? 'on' : ''} onClick={() => pick('light')}>☀ LIGHT</button>
      <button className={theme === 'dark' ? 'on' : ''} onClick={() => pick('dark')}>☾ DARK</button>
    </div>
  )
}
