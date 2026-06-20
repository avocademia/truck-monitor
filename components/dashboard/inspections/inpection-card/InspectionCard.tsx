import { Icon } from '@iconify/react'
import styles from './inspectionCard.module.scss'
import Link from 'next/link'

interface Inspection {
  id: string
  vehicleRegistration: string
  vehicleMake: string | null
  driverName: string
  createdAt: string
  tripFrom: string | null
  tripTo: string | null
}

interface InspectionCardProps {
  inspection: Inspection
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

  console.log(inspection)

  return (
    <Link href={`/dashboard/inspection?inspectionID=${inspection.id}`} className={styles.inspectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.vehicleInfo}>
          <span className={styles.emoji}>🚛</span>
          <div className={styles.vehicleDetails}>
            <h3 className={styles.registration}>{inspection.vehicleRegistration}</h3>
            <p className={styles.make}>{inspection.vehicleMake || 'Unknown make'}</p>
          </div>
        </div>
        <Icon icon="mdi:chevron-right" className={styles.chevron} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <Icon icon="mdi:account" className={styles.infoIcon} />
          <span className={styles.infoLabel}>Driver:</span>
          <span className={styles.infoValue}>{inspection.driverName}</span>
        </div>

        {inspection.tripFrom && inspection.tripTo && (
          <div className={styles.infoRow}>
            <Icon icon="mdi:map-marker-distance" className={styles.infoIcon} />
            <span className={styles.infoLabel}>Route:</span>
            <span className={styles.infoValue}>{inspection.tripFrom} → {inspection.tripTo}</span>
          </div>
        )}

        <div className={styles.cardFooter}>
          <Icon icon="mdi:calendar" className={styles.dateIcon} />
          <span className={styles.date}>{formatDate(inspection.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}