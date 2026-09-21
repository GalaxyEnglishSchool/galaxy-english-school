import Header from './components/Header'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import Gallery from './components/Gallery'
import Features from './components/Features'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Gallery />
        <Features />
        <Courses />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
