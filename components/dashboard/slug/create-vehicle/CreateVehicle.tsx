
'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './createVehicle.module.scss'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export default function CreateVehicle() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        registration_no: '',
        registration_country: '',
        make: '',
        model: '',
        year: '',
        body_type: '',
        status: 'AVAILABLE',
        capacity_kg: '',
        capacity_m3: '',
        current_odometer: '',
        attached_trailer_id: '',
        assigned_driver_id: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.registration_no || !formData.registration_country || !formData.body_type) {
            toast.error('Registration number, country, and body type are required')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    year: formData.year ? parseInt(formData.year) : null,
                    capacity_kg: formData.capacity_kg ? parseFloat(formData.capacity_kg) : null,
                    capacity_m3: formData.capacity_m3 ? parseFloat(formData.capacity_m3) : null,
                    current_odometer: formData.current_odometer ? parseFloat(formData.current_odometer) : null,
                    assigned_driver_id: formData.assigned_driver_id ? parseInt(formData.assigned_driver_id) : null
                })
            })

            if (response.ok) {
                toast.success('Vehicle created successfully')
                router.push('/dashboard?tab=vehicles')
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to create vehicle')
            }
        } catch (error) {
            console.error('Error creating vehicle:', error)
            toast.error('Failed to create vehicle')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.createVehicle}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>Create Vehicle</h1>
                    <p>Add a new vehicle to the fleet</p>
                </div>
                <button 
                    className={styles.backBtn}
                    onClick={() => router.push('/dashboard?tab=vehicles')}
                >
                    <Icon icon="mdi:arrow-left" />
                    <span>Back to Vehicles</span>
                </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.section}>
                    <h2>Basic Information</h2>
                    <div className={styles.grid}>
                        <label className={styles.field}>
                            <span>Registration Number *</span>
                            <input
                                type="text"
                                name="registration_no"
                                value={formData.registration_no}
                                onChange={handleChange}
                                placeholder="e.g. KDV 279X"
                                required
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Registration Country *</span>
                            <input
                                type="text"
                                name="registration_country"
                                value={formData.registration_country}
                                onChange={handleChange}
                                placeholder="e.g. Kenya"
                                required
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Make</span>
                            <input
                                type="text"
                                name="make"
                                value={formData.make}
                                onChange={handleChange}
                                placeholder="e.g. Scania"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Model</span>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="e.g. R500"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Year</span>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                placeholder="e.g. 2020"
                                min="1900"
                                max="2100"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Body Type *</span>
                            <select
                                name="body_type"
                                value={formData.body_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select body type</option>
                                <option value="MOTORBIKE">Motorbike</option>
                                <option value="PICKUP">Pickup</option>
                                <option value="VAN">Van</option>
                                <option value="BOX_TRUCK">Box Truck</option>
                                <option value="FLATBED_TRUCK">Flatbed Truck</option>
                                <option value="REFRIGERATED_TRUCK">Refrigerated Truck</option>
                                <option value="TRAILER">Trailer</option>
                                <option value="FLATBED_TRAILER">Flatbed Trailer</option>
                                <option value="LOWBED_TRAILER">Lowbed Trailer</option>
                                <option value="REFRIGERATED_TRAILER">Refrigerated Trailer</option>
                                <option value="TANKER_TRAILER">Tanker Trailer</option>
                                <option value="CONTAINER_TRAILER">Container Trailer</option>
                            </select>
                        </label>
                        <label className={styles.field}>
                            <span>Status</span>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="AVAILABLE">Available</option>
                                <option value="ON_TRIP">On Trip</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="OUT_OF_SERVICE">Out of Service</option>
                            </select>
                        </label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Capacity & Specifications</h2>
                    <div className={styles.grid}>
                        <label className={styles.field}>
                            <span>Capacity (kg)</span>
                            <input
                                type="number"
                                name="capacity_kg"
                                value={formData.capacity_kg}
                                onChange={handleChange}
                                placeholder="e.g. 5000"
                                step="0.01"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Capacity (m³)</span>
                            <input
                                type="number"
                                name="capacity_m3"
                                value={formData.capacity_m3}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                                step="0.01"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Current Odometer (km)</span>
                            <input
                                type="number"
                                name="current_odometer"
                                value={formData.current_odometer}
                                onChange={handleChange}
                                placeholder="e.g. 150000"
                                step="0.01"
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Assignments</h2>
                    <div className={styles.grid}>
                        <label className={styles.field}>
                            <span>Assigned Driver ID</span>
                            <input
                                type="number"
                                name="assigned_driver_id"
                                value={formData.assigned_driver_id}
                                onChange={handleChange}
                                placeholder="Enter driver ID"
                            />
                        </label>
                        <label className={styles.field}>
                            <span>Attached Trailer ID</span>
                            <input
                                type="text"
                                name="attached_trailer_id"
                                value={formData.attached_trailer_id}
                                onChange={handleChange}
                                placeholder="Enter trailer ID"
                            />
                        </label>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={() => router.push('/dashboard?tab=vehicles')}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Icon icon="line-md:loading-loop" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <>
                                <Icon icon="mdi:check" />
                                <span>Create Vehicle</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    )
}