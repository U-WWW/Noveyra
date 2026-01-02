import React, { useEffect, useState } from 'react'
import { Envelope, MapPin, Phone } from 'phosphor-react'
import { supabase } from '../lib/supabase'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
    const [settings, setSettings] = useState(null)
    const { t } = useLanguage()

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        const { data } = await supabase.from('site_settings').select('*').single()
        if (data) setSettings(data)
    }

    return (
        <div className="container" style={{ padding: '6rem 0' }}>
            <h1 className="text-center" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t('contact.title')}</h1>
            <p className="text-center text-muted" style={{ marginBottom: '4rem' }}>
                {t('contact.subtitle')}
            </p>

            <div className="flex justify-center flex-col gap-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card flex gap-md">
                    <Envelope size={32} className="text-primary" />
                    <div>
                        <h3>{t('contact.email')}</h3>
                        <p className="text-muted">{settings?.email || t('contact.loading')}</p>
                    </div>
                </div>

                <div className="card flex gap-md">
                    <Phone size={32} className="text-primary" />
                    <div>
                        <h3>{t('contact.call')}</h3>
                        <p className="text-muted">{settings?.phone || t('contact.loading')}</p>
                    </div>
                </div>

                <div className="card flex gap-md">
                    <MapPin size={32} className="text-primary" />
                    <div>
                        <h3>{t('contact.visit')}</h3>
                        <p className="text-muted">{settings?.address || t('contact.loading')}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
