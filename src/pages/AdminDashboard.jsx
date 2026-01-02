import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Trash, Plus, SignOut, Pencil, X } from 'phosphor-react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

export default function AdminDashboard() {
    const [projects, setProjects] = useState([])
    const [settings, setSettings] = useState({ email: '', phone: '', address: '' })
    const [newProject, setNewProject] = useState({ title: '', link: '', description: '' })
    const [editingProject, setEditingProject] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        fetchProjects()
        fetchSettings()
    }, [])

    async function fetchProjects() {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
        if (data) setProjects(data)
    }

    async function fetchSettings() {
        const { data } = await supabase.from('site_settings').select('*').single()
        if (data) setSettings(data)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        navigate('/admin')
    }

    async function handleAddProject(e) {
        e.preventDefault()
        setLoading(true)

        let imageUrl = ''

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const { data, error } = await supabase.storage.from('project-images').upload(fileName, imageFile)

            if (data) {
                const { data: { publicUrl } } = supabase.storage.from('project-images').getPublicUrl(fileName)
                imageUrl = publicUrl
            }
        }

        if (editingProject) {
            // Update existing project
            const updates = { ...newProject }
            if (imageUrl) updates.image_url = imageUrl

            const { error } = await supabase.from('projects').update(updates).eq('id', editingProject.id)

            if (!error) {
                setEditingProject(null)
                setNewProject({ title: '', link: '', description: '' })
                setImageFile(null)
                fetchProjects()
            } else {
                alert('Error updating project: ' + error.message)
            }
        } else {
            // Create new project
            const { error } = await supabase.from('projects').insert([{
                ...newProject,
                image_url: imageUrl
            }])

            if (!error) {
                setNewProject({ title: '', link: '', description: '' })
                setImageFile(null)
                fetchProjects()
            } else {
                alert('Error adding project: ' + error.message)
            }
        }
        setLoading(false)
    }

    function startEditing(project) {
        setEditingProject(project)
        setNewProject({
            title: project.title,
            link: project.link,
            description: project.description
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function cancelEditing() {
        setEditingProject(null)
        setNewProject({ title: '', link: '', description: '' })
    }

    async function deleteProject(id) {
        if (!window.confirm('Are you sure?')) return
        await supabase.from('projects').delete().eq('id', id)
        fetchProjects()
    }

    async function updateSettings(e) {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.from('site_settings').upsert({ id: 1, ...settings })
        if (error) alert('Error updating settings')
        else alert('Settings updated!')
        setLoading(false)
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="flex justify-between" style={{ marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className="btn btn-outline flex gap-sm">
                    <SignOut size={20} /> Logout
                </button>
            </div>

            <div className="dashboard-grid">
                {/* Add/Edit Project Section */}
                <div className="card">
                    <div className="flex justify-between align-center">
                        <h2>{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
                        {editingProject && (
                            <button onClick={cancelEditing} className="btn btn-sm btn-outline flex gap-sm">
                                Cancel <X size={16} />
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleAddProject} className="flex-col gap-sm">
                        <input
                            placeholder="Project Title"
                            value={newProject.title}
                            onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Project Link"
                            value={newProject.link}
                            onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={newProject.description}
                            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                            rows={3}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0])}
                        />
                        <button type="submit" className="btn btn-primary top-spacing" disabled={loading}>
                            {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Add Project')} <Plus size={16} />
                        </button>
                    </form>
                </div>

                {/* Settings Section */}
                <div className="card">
                    <h2>Contact Settings</h2>
                    <form onSubmit={updateSettings} className="flex-col gap-sm">
                        <input
                            placeholder="Email"
                            value={settings.email || ''}
                            onChange={e => setSettings({ ...settings, email: e.target.value })}
                        />
                        <input
                            placeholder="Phone"
                            value={settings.phone || ''}
                            onChange={e => setSettings({ ...settings, phone: e.target.value })}
                        />
                        <input
                            placeholder="Address"
                            value={settings.address || ''}
                            onChange={e => setSettings({ ...settings, address: e.target.value })}
                        />
                        <button type="submit" className="btn btn-outline top-spacing" disabled={loading}>
                            Save Settings
                        </button>
                    </form>
                </div>
            </div>

            {/* Projects List */}
            <div className="projects-list" style={{ marginTop: '4rem' }}>
                <h2>Existing Projects</h2>
                {projects.length === 0 && <p className="text-muted">No projects yet.</p>}
                <div className="projects-grid">
                    {projects.map(p => (
                        <div key={p.id} className="project-card relative">
                            <img src={p.image_url || 'https://via.placeholder.com/400'} alt={p.title} />
                            <div className="project-info">
                                <h3>{p.title}</h3>
                                <button
                                    onClick={() => deleteProject(p.id)}
                                    className="btn-delete"
                                    title="Delete"
                                >
                                    <Trash size={20} />
                                </button>
                                <button
                                    onClick={() => startEditing(p)}
                                    className="btn-edit"
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        color: 'var(--color-primary)',
                                        border: 'none',
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        zIndex: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                    title="Edit"
                                >
                                    <Pencil size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
