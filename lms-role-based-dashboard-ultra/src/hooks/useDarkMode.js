import { useEffect, useState } from 'react'
export default function useDarkMode() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('dark') === '1')
  useEffect(() => {
    const html = document.documentElement
    if (enabled) { html.classList.add('dark'); localStorage.setItem('dark','1') }
    else { html.classList.remove('dark'); localStorage.removeItem('dark') }
  }, [enabled])
  return [enabled, setEnabled]
}
