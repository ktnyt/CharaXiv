import { Route, Router, Routes } from '@solidjs/router'
import { Component, lazy } from 'solid-js'

const IndexPage = lazy(() => import('./pages/Index'))
const RegisterPage = lazy(() => import('./pages/Register'))
const RegisterSentPage = lazy(() => import('./pages/RegisterSent'))
const ActivatePage = lazy(() => import('./pages/Activate'))
const SheetPage = lazy(() => import('./pages/Sheet'))

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register_sent" element={<RegisterSentPage />} />
        <Route path="/activate" element={<ActivatePage />} />
        <Route path="/sheet/:sheet_id" element={<SheetPage />} />
        <Route path="/*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  )
}

export default App
