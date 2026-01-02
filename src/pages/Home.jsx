import React, { useEffect, useState } from 'react'
import { ArrowRight, Code, PaintBrush, Rocket } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import './Home.css'

export default function Home() {
    const [projects, setProjects] = useState([])
    const { t } = useLanguage()

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6)

        if (data) setProjects(data)
    }

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section text-center">
                <div className="container animate-fade-in">
                    <h1 className="hero-title">
                        {t('home.heroTitle')} <span className="text-primary">{t('home.heroTitleHighlight')}</span>
                    </h1>
                    <p className="hero-subtitle text-muted">
                        {t('home.heroSubtitle')}
                    </p>
                    <div className="hero-actions flex justify-center gap-md">
                        <a href="#projects" className="btn btn-primary">{t('home.viewWork')}</a>
                        <Link to="/contact" className="btn btn-outline">{t('home.startProject')}</Link>
                    </div>
                </div>
            </section>

            {/* Services/Features */}
            <section className="services-section container">
                <div className="grid-3">
                    <div className="service-card">
                        <PaintBrush size={48} className="text-primary" />
                        <h3>{t('home.services.uiux')}</h3>
                        <p className="text-muted">{t('home.services.uiuxDesc')}</p>
                    </div>
                    <div className="service-card">
                        <Code size={48} className="text-primary" />
                        <h3>{t('home.services.webDev')}</h3>
                        <p className="text-muted">{t('home.services.webDevDesc')}</p>
                    </div>
                    <div className="service-card">
                        <Rocket size={48} className="text-primary" />
                        <h3>{t('home.services.strategy')}</h3>
                        <p className="text-muted">{t('home.services.strategyDesc')}</p>
                    </div>
                </div>
            </section>

            {/* Recent Projects Preview */}
            <section id="projects" className="projects-section container">
                <div className="section-header flex justify-between">
                    <h2>{t('home.recentProjects')}</h2>
                    <Link to="/contact" className="text-primary flex gap-sm">
                        {t('home.getInTouch')} <ArrowRight />
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center text-muted" style={{ padding: '4rem 0' }}>
                        <p>{t('home.loadingProjects')}</p>
                        <small>Make sure to add projects in the Admin setup.</small>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <div key={project.id} className="project-card">
                                <img src={project.image_url || 'https://via.placeholder.com/400x300/111/fff?text=No+Image'} alt={project.title} />
                                <div className="project-info">
                                    <h3>{project.title}</h3>
                                    <Link to={`/project/${project.id}`} className="btn btn-sm btn-outline" style={{ marginTop: '0.5rem' }}>
                                        {t('home.viewDetails')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
