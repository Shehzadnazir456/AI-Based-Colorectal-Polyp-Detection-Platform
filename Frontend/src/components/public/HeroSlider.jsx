import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HOME_IMAGES } from '../../utils/homeContent'

const slides = [
  {
    title: 'AI Powered Polyp Detection System',
    subtitle: 'Early detection saves lives using advanced AI imaging',
    cta: 'Start Detection',
    ctaTo: '/login',
    ctaExternal: true,
    image: HOME_IMAGES.hero[0],
  },
  {
    title: 'Smart Healthcare with Deep Learning',
    subtitle: 'Accurate, fast and reliable polyp analysis',
    cta: 'Learn More',
    ctaExternal: false,
    image: HOME_IMAGES.hero[1],
  },
]

function scrollToAbout() {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length)
  }, [])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[index]

  return (
    <section
      id="home"
      className="relative h-[min(72vh,560px)] w-full overflow-hidden scroll-mt-20"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={slide.image}
          src={slide.image}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-[#6a11cb]/90 via-[#5b21b6]/75 to-[#2575fc]/80" />
      <div className="absolute inset-0 bg-black/25" />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 md:text-sm">
            Clinical AI Platform
          </p>
          <h1 className="max-w-4xl text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/90 md:text-lg">
            {slide.subtitle}
          </p>

          {slide.ctaExternal ? (
            <Link
              to={slide.ctaTo}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-bold text-violet-800 shadow-xl transition hover:bg-violet-50 md:text-base"
            >
              {slide.cta}
            </Link>
          ) : (
            <button
              type="button"
              onClick={scrollToAbout}
              className="mt-6 inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
            >
              {slide.cta}
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-black/45 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-md transition hover:bg-black/45 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  )
}
