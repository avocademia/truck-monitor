'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import styles from './vehicle.module.scss'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function Vehicle() {
    const params = useParams()
    const router = useRouter()
    const vehicleId = params.id as string

    const [vehicle, setVehicle] = useState<any>(null)
    const [inspections, setInspections] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'details' | 'inspections'>('details')

    useEffect(() => {
        fetchVehicleDetails()
        fetchVehicleInspections()
    }, [vehicleId])

    const fetchVehicleDetails = async () => {
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}`)
            if (response.ok) {
                const data = await response.json()
                setVehicle(data)
            } else {
                toast.error('Failed to fetch vehicle details')
                router.push('/dashboard?tab=vehicles')
            }
        } catch (error) {
            console.error('Error fetching vehicle:', error)
            toast.error('Failed to fetch vehicle details')
        }
    }

    const fetchVehicleInspections = async () => {
        try {
            const response = await fetch(`/api/vehicles/${vehicleId}/inspections`)
            if (response.ok) {
                const data = await response.json()
                setInspections(data.inspections)
            }
        } catch (error) {
            console.error('Error fetching inspections:', error)
        } finally {
            setLoading(false)
        }
    }

    const statusColors: Record<string, string> = {
        AVAILABLE: '#10b981',
        ON_TRIP: '#f59e0b',
        MAINTENANCE: '#ef4444',
        OUT_OF_SERVICE: '#6b7280'
    }

    if (loading) {
        return (
            <main className={styles.vehicle}>
                <div className={styles.loading}>
                    <Icon icon="line-md:loading-loop" />
                    <span>Loading vehicle details...</span>
                </div>
            </main>
        )
    }

    if (!vehicle) {
        return (
            <main className={styles.vehicle}>
                <div className={styles.empty}>
                    <Icon icon="mdi:truck-outline" />
                    <p>Vehicle not found</p>
                </div>
            </main>
        )
    }

    return (
        <main className={styles.vehicle}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <button 
                        className={styles.backBtn}
                        onClick={() => router.push('/dashboard?tab=vehicles')}
                    >
                        <Icon icon="mdi:arrow-left" />
                    </button>
                    <div>
                        <h1>{vehicle.registration_no}</h1>
                        <p>{vehicle.make} {vehicle.model} {vehicle.year}</p>
                    </div>
                </div>
                <div 
                    className={styles.status}
                    style={{ backgroundColor: statusColors[vehicle.status] }}
                >
                    {vehicle.status.replace('_', ' ')}
                </div>
            </div>

            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'details' ? styles.active : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    <Icon icon="mdi:information-outline" />
                    <span>Details</span>
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'inspections' ? styles.active : ''}`}
                    onClick={() => setActiveTab('inspections')}
                >
                    <Icon icon="mdi:clipboard-check" />
                    <span>Inspections ({vehicle._count.inspections})</span>
                </button>
            </div>

            {activeTab === 'details' && (
                <div className={styles.content}>
                    <div className={styles.section}>
                        <h2>Vehicle Information</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Registration</span>
                                <span className={styles.value}>{vehicle.registration_no}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Country</span>
                                <span className={styles.value}>{vehicle.registration_country}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Make</span>
                                <span className={styles.value}>{vehicle.make || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Model</span>
                                <span className={styles.value}>{vehicle.model || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Year</span>
                                <span className={styles.value}>{vehicle.year || '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Body Type</span>
                                <span className={styles.value}>{vehicle.body_type.replace(/_/g, ' ')}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Status</span>
                                <span className={styles.value}>{vehicle.status.replace('_', ' ')}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Odometer</span>
                                <span className={styles.value}>{vehicle.current_odometer ? `${vehicle.current_odometer.toLocaleString()} km` : '-'}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Capacity</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Capacity (kg)</span>
                                <span className={styles.value}>{vehicle.capacity_kg ? `${vehicle.capacity_kg.toLocaleString()} kg` : '-'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.label}>Capacity (m³)</span>
                                <span className={styles.value}>{vehicle.capacity_m3 ? `${vehicle.capacity_m3.toLocaleString()} m³` : '-'}</span>
                            </div>
                        </div>
                    </div>

                    {vehicle.assigned_driver && (
                        <div className={styles.section}>
                            <h2>Assigned Driver</h2>
                            <div className={styles.driverCard}>
                                <div className={styles.driverInfo}>
                                    <Icon icon="mdi:account-circle" className={styles.driverIcon} />
                                    <div>
                                        <h3>{vehicle.assigned_driver.first_name} {vehicle.assigned_driver.last_name}</h3>
                                        <p>{vehicle.assigned_driver.email}</p>
                                        <p>{vehicle.assigned_driver.phone}</p>
                                    </div>
                                </div>
                                <div className={styles.driverDetails}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.label}>License Expiry</span>
                                        <span className={styles.value}>
                                            {vehicle.assigned_driver.license_exp_date 
                                                ? new Date(vehicle.assigned_driver.license_exp_date).toLocaleDateString() 
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.label}>Date of Birth</span>
                                        <span className={styles.value}>
                                            {vehicle.assigned_driver.dob 
                                                ? new Date(vehicle.assigned_driver.dob).toLocaleDateString() 
                                                : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {vehicle.attached_trailer && (
                        <div className={styles.section}>
                            <h2>Attached Trailer</h2>
                            <div className={styles.trailerCard}>
                                <div className={styles.trailerInfo}>
                                    <Icon icon="mdi:truck-trailer" className={styles.trailerIcon} />
                                    <div>
                                        <h3>{vehicle.attached_trailer.registration_no}</h3>
                                        <p>{vehicle.attached_trailer.make} {vehicle.attached_trailer.model} {vehicle.attached_trailer.year}</p>
                                    </div>
                                </div>
                                <div className={styles.trailerStatus}>
                                    <span className={styles.label}>Body Type</span>
                                    <span className={styles.value}>{vehicle.attached_trailer.body_type.replace(/_/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'inspections' && (
                <div className={styles.content}>
                    {inspections.length === 0 ? (
                        <div className={styles.empty}>
                            <Icon icon="mdi:clipboard-check-outline" />
                            <p>No inspections recorded for this vehicle</p>
                        </div>
                    ) : (
                        <div className={styles.inspectionsList}>
                            {inspections.map((inspection) => (
                                <div key={inspection.id} className={styles.inspectionCard}>
                                    <div className={styles.inspectionHeader}>
                                        <div className={styles.inspectionType}>
                                            <Icon icon="mdi:clipboard-text" />
                                            <span>{inspection.type.replace(/_/g, ' ')}</span>
                                        </div>
                                        <span className={styles.inspectionDate}>
                                            {new Date(inspection.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className={styles.inspectionDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>Driver</span>
                                            <span className={styles.value}>
                                                {inspection.driver.first_name} {inspection.driver.last_name}
                                            </span>
                                        </div>
                                        {inspection.inspector && (
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Inspector</span>
                                                <span className={styles.value}>
                                                    {inspection.inspector.first_name} {inspection.inspector.last_name}
                                                </span>
                                            </div>
                                        )}
                                        {inspection.trip_from && inspection.trip_to && (
                                            <div className={styles.detailRow}>
                                                <span className={styles.label}>Trip</span>
                                                <span className={styles.value}>
                                                    {inspection.trip_from} → {inspection.trip_to}
                                                </span>
                                            </div>
                                        )}
                                        <div className={styles.detailRow}>
                                            <span className={styles.label}>Status</span>
                                            <span className={`${styles.value} ${styles.status}`}>
                                                {inspection.inspection_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}