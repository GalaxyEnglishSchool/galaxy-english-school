import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

const OfficePage = lazy(() => import('./pages/OfficePage'))

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

function App() {
  return (
    <>
      <div id="google_translate_element" aria-hidden="true" />
      <BrowserRouter basename={routerBasename}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/office" element={<OfficePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
