import { Icon } from '@iconify/react'
import styles from './vehicleCard.module.scss'
import Link from 'next/link'

const getVehicleIcon = (bodyType: string) => {
  const iconMap: Record<string, string> = {
    MOTORBIKE: 'mdi:motorbike',
    PICKUP: 'mdi:truck-pickup',
    VAN: 'mdi:van-utility',
    BOX_TRUCK: 'mdi:truck',
    FLATBED_TRUCK: 'mdi:truck-flatbed',
    REFRIGERATED_TRUCK: 'mdi:truck-cargo-container',
    TRAILER: 'mdi:truck-trailer',
    FLATBED_TRAILER: 'mdi:truck-trailer',
    LOWBED_TRAILER: 'mdi:truck-trailer',
    REFRIGERATED_TRAILER: 'mdi:truck-trailer',
    TANKER_TRAILER: 'mdi:truck-trailer',
    CONTAINER_TRAILER: 'mdi:truck-trailer',
  }
  return iconMap[bodyType] || 'mdi:truck'
}

export default function VehicleCard({vehicle}: {vehicle: any}) {
    const statusColors: Record<string, string> = {
        AVAILABLE: '#10b981',
        ON_TRIP: '#f59e0b',
        MAINTENANCE: '#ef4444',
        OUT_OF_SERVICE: '#6b7280'
    }

    const vehicleIcon = getVehicleIcon(vehicle.body_type)

    return (
        <Link href={`/dashboard/vehicle/${vehicle.id}`} className={styles.vehicleCard}>
            <div className={styles.cardHeader}>
                <div className={styles.registration}>
                    <span className={styles.regNumber}>{vehicle.registration_no}</span>
                    <span className={styles.country}>{vehicle.registration_country}</span>
                </div>
                <div 
                    className={styles.status}
                    style={{ backgroundColor: statusColors[vehicle.status] || '#6b7280' }}
                >
                    {vehicle.status.replace('_', ' ')}
                </div>
            </div>

            <div className={styles.vehicleInfo}>
                <div className={styles.infoRow}>
                    <Icon icon={vehicleIcon} />
                    <span>{vehicle.make} {vehicle.model} {vehicle.year}</span>
                </div>
                <div className={styles.infoRow}>
                    <Icon icon="mdi:car-truck" />
                    <span>{vehicle.body_type.replace(/_/g, ' ')}</span>
                </div>
                {vehicle.assigned_driver && (
                    <div className={styles.infoRow}>
                        <Icon icon="mdi:account" />
                        <span>{vehicle.assigned_driver.first_name} {vehicle.assigned_driver.last_name}</span>
                    </div>
                )}
                {vehicle.attached_trailer && (
                    <div className={styles.infoRow}>
                        <Icon icon="mdi:truck-trailer" />
                        <span>Trailer: {vehicle.attached_trailer.registration_no}</span>
                    </div>
                )}
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.inspectionCount}>
                    <Icon icon="mdi:clipboard-check" />
                    <span>{vehicle._count.inspections} inspections</span>
                </div>
                <Icon icon="mdi:chevron-right" className={styles.chevron} />
            </div>
        </Link>
    )
}