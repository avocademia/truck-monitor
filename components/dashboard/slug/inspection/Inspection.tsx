'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useSearchParams } from 'next/navigation'
import styles from './inspection.module.scss'

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

export default function Inspection() {
  const params = useSearchParams()
  const [inspection, setInspection] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInspection() {
      try {
        const response = await fetch(`/api/inspections/${params.get('inspectionID')}`)
        if (!response.ok) throw new Error('Failed to fetch inspection')
        const data = await response.json()
        setInspection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.get('inspectionID')) {
      fetchInspection()
    }
  }, [params.get('inspectionID')])

  if (loading) {
    return (
      <main className={styles.inspection}>
        <div className={styles.loading}>
          <Icon icon="line-md:loading-loop" className={styles.loadingIcon} />
          <p>Loading inspection...</p>
        </div>
      </main>
    )
  }

  if (error || !inspection) {
    return (
      <main className={styles.inspection}>
        <div className={styles.error}>
          <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
          <p>{error || 'Inspection not found'}</p>
        </div>
      </main>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const attentionCount = inspection.items?.filter((item: any) => item.status === 'ATTENTION').length || 0
  const okCount = inspection.items?.filter((item: any) => item.status === 'OK').length || 0
  const totalCount = inspection.items?.length || 0

  const vehicleIcon = inspection.vehicle?.body_type 
    ? getVehicleIcon(inspection.vehicle.body_type)
    : 'mdi:truck'

  return (
    <main className={styles.inspection}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => window.history.back()}>
          <Icon icon="mdi:arrow-left" />
          Back
        </button>
        <h1>Inspection Details</h1>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.vehicleHeader}>
          <Icon icon={vehicleIcon} className={styles.vehicleIcon} />
          <div className={styles.vehicleInfo}>
            <h2 className={styles.registration}>{inspection.vehicle?.registration_no || 'N/A'}</h2>
            <p className={styles.make}>{inspection.vehicle?.make ? `${inspection.vehicle.make} ${inspection.vehicle.model || ''}` : 'Unknown'}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{okCount}</span>
            <span className={styles.statLabel}>OK</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{attentionCount}</span>
            <span className={styles.statLabel}>Attention</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalCount}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Vehicle & Trip Details</h3>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Driver</span>
            <span className={styles.detailValue}>{inspection.driver ? `${inspection.driver.first_name} ${inspection.driver.last_name}` : 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Inspector</span>
            <span className={styles.detailValue}>{inspection.inspector ? `${inspection.inspector.first_name} ${inspection.inspector.last_name}` : 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Route</span>
            <span className={styles.detailValue}>
              {inspection.trip_from && inspection.trip_to 
                ? `${inspection.trip_from} → ${inspection.trip_to}` 
                : 'N/A'}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Consignee</span>
            <span className={styles.detailValue}>{inspection.consignee || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>HAZMAT</span>
            <span className={styles.detailValue}>{inspection.hazmat ? 'Yes' : 'No'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Load Secured</span>
            <span className={styles.detailValue}>{inspection.load_secured ? 'Yes' : 'No'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Status</span>
            <span className={styles.detailValue}>{inspection.inspection_status}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Type</span>
            <span className={styles.detailValue}>{inspection.type?.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {(inspection.driver_comments || inspection.inspector_comments) && (
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Comments</h3>
          {inspection.driver_comments && (
            <div className={styles.commentBlock}>
              <p className={styles.commentLabel}>Driver's Comments:</p>
              <p className={styles.commentText}>{inspection.driver_comments}</p>
            </div>
          )}
          {inspection.inspector_comments && (
            <div className={styles.commentBlock}>
              <p className={styles.commentLabel}>Inspector's Comments:</p>
              <p className={styles.commentText}>{inspection.inspector_comments}</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Inspection Date</h3>
        <p className={styles.inspectionDate}>{formatDate(inspection.created_at)}</p>
      </div>
    </main>
  )
}