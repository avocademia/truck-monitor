import { Icon } from '@iconify/react'
import styles from './inspectionCard.module.scss'
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

interface InspectionCardProps {
  inspection: any
}

export default function InspectionCard({ inspection }: InspectionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const vehicleIcon = inspection.vehicle?.body_type 
    ? getVehicleIcon(inspection.vehicle.body_type)
    : 'mdi:truck'

  return (
    <Link href={`/dashboard/inspection?inspectionID=${inspection.id}`} className={styles.inspectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.vehicleInfo}>
          <Icon icon={vehicleIcon} className={styles.vehicleIcon} />
          <div className={styles.vehicleDetails}>
            <h3 className={styles.registration}>{inspection.vehicle?.registration_no || 'N/A'}</h3>
            <p className={styles.make}>{inspection.vehicle?.make ? `${inspection.vehicle.make} ${inspection.vehicle.model || ''}` : 'Unknown'}</p>
          </div>
        </div>
        <Icon icon="mdi:chevron-right" className={styles.chevron} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <Icon icon="mdi:account" className={styles.infoIcon} />
          <span className={styles.infoLabel}>Driver:</span>
          <span className={styles.infoValue}>{inspection.driver ? `${inspection.driver.first_name} ${inspection.driver.last_name}` : 'N/A'}</span>
        </div>

        {inspection.trip_from && inspection.trip_to && (
          <div className={styles.infoRow}>
            <Icon icon="mdi:map-marker-distance" className={styles.infoIcon} />
            <span className={styles.infoLabel}>Route:</span>
            <span className={styles.infoValue}>{inspection.trip_from} → {inspection.trip_to}</span>
          </div>
        )}

        <div className={styles.cardFooter}>
          <Icon icon="mdi:calendar" className={styles.dateIcon} />
          <span className={styles.date}>{formatDate(inspection.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}