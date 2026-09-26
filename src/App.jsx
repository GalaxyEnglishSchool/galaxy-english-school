import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OfficePage from './pages/OfficePage'

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/office" element={<OfficePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
