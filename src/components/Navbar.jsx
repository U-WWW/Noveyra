import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { List, X, Globe } from 'phosphor-react'
import { useLanguage } from '../context/LanguageContext'
import './Navbar.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { t, language, toggleLanguage } = useLanguage()

    return (
        <nav className="navbar">
            <div className="container flex justify-between">
                <Link to="/" className="logo">
                    NOVEYRA
                </Link>

                <div className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <List size={28} />}
                </div>

                <ul className={`nav-links flex gap-lg ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={() => setIsOpen(false)}>{t('nav.home')}</Link></li>
                    <li><Link to="/#projects" onClick={() => setIsOpen(false)}>{t('nav.projects')}</Link></li>
                    <li><Link to="/contact" onClick={() => setIsOpen(false)}>{t('nav.contact')}</Link></li>

                    <li>
                        <button onClick={toggleLanguage} className="btn-icon flex gap-sm" style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <Globe size={24} /> {language === 'en' ? 'AR' : 'EN'}
                        </button>
                    </li>

                    <li>
                        <Link to="/admin" className="btn btn-outline" onClick={() => setIsOpen(false)}>
                            {t('nav.admin')}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
