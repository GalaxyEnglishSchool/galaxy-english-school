import { lazy, Suspense } from 'react'
import Header from '../components/Header'
import { JoyGuideProvider, useJoyGuide } from '../context/JoyGuideContext'
import Hero from '../components/Hero'
import JoyGuide from '../components/JoyGuide'
import JoyFieldTour from '../components/office/JoyFieldTour'
import Stats from '../components/Stats'
import Footer from '../components/Footer'
import { WEBSITE_JOY_TOUR_STEPS } from '../data/websiteJoyTourSteps'

const About = lazy(() => import('../components/About'))
const Gallery = lazy(() => import('../components/Gallery'))
const Features = lazy(() => import('../components/Features'))
const Courses = lazy(() => import('../components/Courses'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const Contact = lazy(() => import('../components/Contact'))
function HomePageContent() {
  const { siteTourActive, endSiteTour } = useJoyGuide()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Suspense fallback={null}>
          <About />
          <Gallery />
          <Features />
          <Courses />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
      {!siteTourActive && <JoyGuide variant="float" key="joy-float" />}
      {siteTourActive && (
        <JoyFieldTour
          steps={WEBSITE_JOY_TOUR_STEPS}
          title="Joy — Your Guide"
          dockBubbleToCorner
          onClose={endSiteTour}
        />
      )}
      <Footer />
    </>
  )
}

function HomePage() {
  return (
    <JoyGuideProvider>
      <HomePageContent />
    </JoyGuideProvider>
  )
}

export default HomePage
