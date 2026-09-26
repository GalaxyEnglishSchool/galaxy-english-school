import { Children, useEffect, useRef, useState } from 'react'
import './Carousel.css'

function Carousel({
  children,
  ariaLabel = 'Carousel',
  className = '',
  autoPlay = true,
  interval = 3500,
  mode = 'slide', // 'slide' | 'marquee'
  marqueeSecondsPerSlide = 8,
}) {
  const trackRef = useRef(null)
  const slides = Children.toArray(children)
  const [activeIndex, setActiveIndex] = useState(0)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const activeIndexRef = useRef(0)
  const pausedRef = useRef(false)
  const marqueeResumeTimerRef = useRef(null)

  const isMarquee = mode === 'marquee' && slides.length > 1
  const displaySlides = isMarquee ? [...slides, ...slides] : slides

  const goToSlide = (index) => {
    const track = trackRef.current
    if (!track || slides.length === 0) return

    const safeIndex = ((index % slides.length) + slides.length) % slides.length
    const slide = track.children[safeIndex]
    if (!slide) return

    activeIndexRef.current = safeIndex
    setActiveIndex(safeIndex)

    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
      behavior: 'smooth',
    })
  }

  const pause = () => {
    pausedRef.current = true
  }

  const resume = () => {
    pausedRef.current = false
  }

  const pauseBriefly = () => {
    pause()
    setTimeout(() => resume(), interval * 2)
  }

  const pauseMarquee = () => {
    if (marqueeResumeTimerRef.current) {
      clearTimeout(marqueeResumeTimerRef.current)
    }
    setMarqueePaused(true)
  }

  const resumeMarqueeAfterDelay = (delayMs = 4000) => {
    if (marqueeResumeTimerRef.current) {
      clearTimeout(marqueeResumeTimerRef.current)
    }
    marqueeResumeTimerRef.current = setTimeout(() => {
      setMarqueePaused(false)
      marqueeResumeTimerRef.current = null
    }, delayMs)
  }

  useEffect(() => () => {
    if (marqueeResumeTimerRef.current) {
      clearTimeout(marqueeResumeTimerRef.current)
    }
  }, [])

  // Auto-advance for slide mode
  useEffect(() => {
    if (!autoPlay || isMarquee || slides.length <= 1) return undefined

    const timer = setInterval(() => {
      if (pausedRef.current) return

      const track = trackRef.current
      if (!track) return

      const next = (activeIndexRef.current + 1) % slides.length
      const slide = track.children[next]
      if (!slide) return

      activeIndexRef.current = next
      setActiveIndex(next)
      track.scrollTo({
        left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2,
        behavior: 'smooth',
      })
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, isMarquee, slides.length])

  // Sync dots when user swipes manually
  useEffect(() => {
    const track = trackRef.current
    if (!track || isMarquee) return undefined

    const onScroll = () => {
      const center = track.scrollLeft + track.clientWidth / 2
      let closest = 0
      let closestDistance = Infinity

      Array.from(track.children).forEach((slide, index) => {
        if (index >= slides.length) return
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2
        const distance = Math.abs(center - slideCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closest = index
        }
      })

      activeIndexRef.current = closest
      setActiveIndex(closest)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [isMarquee, slides.length])

  if (slides.length === 0) return null

  if (isMarquee) {
    const marqueeDuration = Math.max(slides.length * marqueeSecondsPerSlide, 48)

    return (
      <div
        className={[
          'carousel',
          'carousel--marquee',
          className,
          marqueePaused ? 'carousel--paused' : '',
        ].filter(Boolean).join(' ')}
        aria-label={ariaLabel}
        onMouseEnter={pauseMarquee}
        onMouseLeave={() => setMarqueePaused(false)}
        onTouchStart={pauseMarquee}
        onTouchEnd={() => resumeMarqueeAfterDelay(5000)}
      >
        <div className="carousel__marquee-viewport">
          <div
            className="carousel__marquee-track"
            style={{ '--marquee-duration': `${marqueeDuration}s` }}
          >
            {displaySlides.map((slide, index) => (
              <div key={index} className="carousel__slide">
                {slide}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`carousel ${className}`.trim()}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={pauseBriefly}
    >
      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__arrow carousel__arrow--prev"
          aria-label="Previous slide"
          onClick={() => {
            pauseBriefly()
            goToSlide(activeIndexRef.current - 1)
          }}
        >
          ‹
        </button>

        <div className="carousel__track" ref={trackRef}>
          {slides.map((slide, index) => (
            <div key={index} className="carousel__slide">
              {slide}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel__arrow carousel__arrow--next"
          aria-label="Next slide"
          onClick={() => {
            pauseBriefly()
            goToSlide(activeIndexRef.current + 1)
          }}
        >
          ›
        </button>
      </div>

      {slides.length > 1 && (
        <div className="carousel__dots" role="tablist" aria-label="Slide navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              className={`carousel__dot ${index === activeIndex ? 'carousel__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === activeIndex}
              onClick={() => {
                pauseBriefly()
                goToSlide(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
