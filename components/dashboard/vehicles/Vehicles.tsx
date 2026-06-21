'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import styles from './vehicles.module.scss'
import VehicleCard from './vehicle-card/VehicleCard'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function Vehicles() {
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchVehicles()
    }, [])

    const fetchVehicles = async (searchTerm?: string) => {
        try {
            setLoading(true)
            const url = searchTerm 
                ? `/api/vehicles?search=${searchTerm}`
                : '/api/vehicles'
            const response = await fetch(url)
            if (response.ok) {
                const data = await response.json()
                setVehicles(data)
            } else {
                toast.error('Failed to fetch vehicles')
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error)
            toast.error('Failed to fetch vehicles')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchVehicles(search)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <div className={styles.vehicles}>
            <div className={styles.header}>
                <h1>Vehicles</h1>
                <Link href="/dashboard/create-vehicle" className={styles.createBtn}>
                    <Icon icon="mdi:plus" />
                    <span>Add Vehicle</span>
                </Link>
            </div>

            <form className={styles.searchBar} onSubmit={handleSearch}>
                <div className={styles.searchInput}>
                    <Icon icon="mdi:magnify" />
                    <input 
                        type="text" 
                        placeholder="Search by registration..." 
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <button type="submit" className={styles.searchBtn}>Search</button>
            </form>

            {loading ? (
                <div className={styles.loading}>
                    <Icon icon="line-md:loading-loop" />
                    <span>Loading vehicles...</span>
                </div>
            ) : vehicles.length === 0 ? (
                <div className={styles.empty}>
                    <Icon icon="mdi:truck-outline" />
                    <p>No vehicles found</p>
                </div>
            ) : (
                <div className={styles.vehicleGrid}>
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            )}
        </div>
    )
}