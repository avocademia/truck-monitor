'use client'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import styles from './dashboard.module.scss'
import Inspections from '@/components/dashboard/inspections/Inspections'
import Vehicles from '@/components/dashboard/vehicles/Vehicles'
import Profile from '@/components/dashboard/profile/Profile'
import Link from 'next/link'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'vehicles' | 'inspections' | 'profile'>('inspections')
    const setUser = useUserStore((state) => state.setUser)
    const router = useRouter()

    useEffect(() => {
        // Fetch user data on mount
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/validate-token')
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                } else {
                    // Token invalid, redirect to auth
                    router.push('/auth')
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                router.push('/auth')
            }
        }
        fetchUser()
    }, [setUser, router])

    return (
        <main>
            <section className={styles.nav}>
                <div className={styles.navHeader}>
                    <h1>Dashboard</h1>
                    <Link href="/dashboard/create-inspection" className={styles.backBtn}>
                        <Icon icon="mdi:clipboard-text" />
                        <span>New Inspection</span>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <li onClick={() => setActiveTab('vehicles')}>Vehicles</li>
                        <li onClick={() => setActiveTab('inspections')}>Inspections</li>
                        <li onClick={() => setActiveTab('profile')}>Profile</li>
                    </ul>
                </nav>
            </section>
            <section>
                {activeTab === 'vehicles' && <Vehicles/>}
                {activeTab === 'inspections' && <Inspections/>}
                {activeTab === 'profile' && <Profile/>}
            </section>
        </main>
    )
}