import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'
import { ArrowLeft, Globe } from 'phosphor-react'

export default function ProjectDetails() {
    const { id } = useParams()
    const { t } = useLanguage()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProject()
    }, [id])

    async function fetchProject() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single()

        if (data) setProject(data)
        setLoading(false)
    }

    if (loading) return <div className="container text-center" style={{ padding: '6rem 0' }}><p>{t('home.loadingProjects')}</p></div>

    if (!project) return <div className="container text-center" style={{ padding: '6rem 0' }}><p>Project not found.</p><Link to="/" className="btn btn-outline">{t('home.backToHome')}</Link></div>

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <Link to="/" className="text-muted flex gap-sm" style={{ marginBottom: '2rem' }}>
                <ArrowLeft /> {t('home.backToHome')}
            </Link>

            <div className="project-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
                <div className="project-image">
                    <img
                        src={project.image_url || 'https://via.placeholder.com/600x400/111/fff?text=No+Image'}
                        alt={project.title}
                        style={{ width: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
                    />
                </div>

                <div className="project-content">
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>{project.title}</h1>
                    <p className="text-muted" style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                        {project.description || 'No description available for this project.'}
                    </p>

                    {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex gap-sm" style={{ display: 'inline-flex' }}>
                            <Globe size={24} /> {t('home.visitSite')}
                        </a>
                    )}
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .project-details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }
            `}</style>
        </div>
    )
}
