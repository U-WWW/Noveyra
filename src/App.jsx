import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import { FacebookLogo, InstagramLogo, TwitterLogo } from 'phosphor-react'
import { supabase } from './lib/supabase'
import Home from './pages/Home'
import Contact from './pages/Contact'
import ProjectDetails from './pages/ProjectDetails'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'

function App() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    supabase.from('site_settings').select('social_links').single()
      .then(({ data }) => setSettings(data))
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/:id" element={<ProjectDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<AdminLogin />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <footer className="footer text-center">
            {settings?.social_links && (
              <div className="flex justify-center gap-md" style={{ marginBottom: '1rem' }}>
                {settings.social_links.facebook && <a href={settings.social_links.facebook} target="_blank" rel="noreferrer" className="text-muted"><FacebookLogo size={24} /></a>}
                {settings.social_links.instagram && <a href={settings.social_links.instagram} target="_blank" rel="noreferrer" className="text-muted"><InstagramLogo size={24} /></a>}
                {settings.social_links.twitter && <a href={settings.social_links.twitter} target="_blank" rel="noreferrer" className="text-muted"><TwitterLogo size={24} /></a>}
              </div>
            )}
            <div className="container">
              <p className="text-muted">© 2026 Noveyra. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
