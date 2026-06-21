'use client'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './dashboard.module.scss'
import Inspections from '@/components/dashboard/inspections/Inspections'
import Profile from '@/components/dashboard/profile/Profile'
import Link from 'next/link'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'inspections' | 'profile'>('inspections')

    return (
        <main>
            <section className={styles.nav}>
                <div className={styles.navHeader}>
                    <h1>Dashboard</h1>
                    <Link href="/create-admin" className={styles.backBtn}>
                        <Icon icon="mdi:clipboard-text" />
                        <span>New Inspection</span>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li onClick={() => setActiveTab('inspections')}>Inspections</li>
                        <li onClick={() => setActiveTab('profile')}>Profile</li>
                    </ul>
                </nav>
            </section>
            <section>
                {activeTab === 'inspections' && <Inspections/>}
                {activeTab === 'profile' && <Profile/>}
            </section>
        </main>
    )
}