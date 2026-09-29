import { lazy, Suspense } from 'react'
import Header from '../components/Header'
import { JoyGuideProvider } from '../context/JoyGuideContext'
import Hero from '../components/Hero'
import JoyGuide from '../components/JoyGuide'
import Stats from '../components/Stats'
import Footer from '../components/Footer'

const About = lazy(() => import('../components/About'))
const Gallery = lazy(() => import('../components/Gallery'))
const Features = lazy(() => import('../components/Features'))
const Courses = lazy(() => import('../components/Courses'))
const Testimonials = lazy(() => import('../components/Testimonials'))
const Contact = lazy(() => import('../components/Contact'))
function HomePage() {
  return (
    <JoyGuideProvider>
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
      <JoyGuide variant="float" />
      <Footer />
    </JoyGuideProvider>
  )
}

export default HomePage
