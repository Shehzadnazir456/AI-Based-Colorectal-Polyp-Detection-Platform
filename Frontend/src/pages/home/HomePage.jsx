import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSlider from '../../components/public/HeroSlider'
import HomeSections from '../../components/public/HomeSections'

function scrollToHash(hash) {
  if (!hash) return
  const id = hash.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => scrollToHash(hash), 100)
      return () => clearTimeout(t)
    }
  }, [hash])

  return (
    <div className="-mt-[72px]">
      <HeroSlider />
      <HomeSections />
    </div>
  )
}
