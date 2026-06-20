'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useSearchParams } from 'next/navigation'
import styles from './inspection.module.scss'

interface InspectionItem {
  id: string
  itemKey: string
  status: string | null
}

interface Inspection {
  id: string
  vehicleRegistration: string
  vehicleMake: string | null
  edmReading: string | null
  trailerRegistration: string | null
  driverName: string
  driverAge: string | null
  licenceExpiryDate: string | null
  tripFrom: string | null
  tripTo: string | null
  consignee: string | null
  cargoType: string | null
  hazmat: boolean
  loadSecured: string | null
  driverCellPhone: string | null
  driverComments: string | null
  inspectorComments: string | null
  inspectedBySignature: string | null
  inspectedByDate: string | null
  approvedBySignature: string | null
  approvedByDate: string | null
  approvedByTime: string | null
  createdAt: string
  items: InspectionItem[]
}

export default function Inspection() {
  const params = useSearchParams()
  const [inspection, setInspection] = useState<Inspection | null>(null)
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

  const attentionCount = inspection.items.filter(item => item.status === 'attention').length
  const okCount = inspection.items.filter(item => item.status === 'ok').length
  const totalCount = inspection.items.length

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
          <span className={styles.emoji}>🚛</span>
          <div className={styles.vehicleInfo}>
            <h2 className={styles.registration}>{inspection.vehicleRegistration}</h2>
            <p className={styles.make}>{inspection.vehicleMake || 'Unknown make'}</p>
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
            <span className={styles.detailValue}>{inspection.driverName}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Driver Age</span>
            <span className={styles.detailValue}>{inspection.driverAge || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>License Expiry</span>
            <span className={styles.detailValue}>{formatDate(inspection.licenceExpiryDate)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>EDM Reading</span>
            <span className={styles.detailValue}>{inspection.edmReading || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Trailer</span>
            <span className={styles.detailValue}>{inspection.trailerRegistration || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Route</span>
            <span className={styles.detailValue}>
              {inspection.tripFrom && inspection.tripTo 
                ? `${inspection.tripFrom} → ${inspection.tripTo}` 
                : 'N/A'}
            </span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Consignee</span>
            <span className={styles.detailValue}>{inspection.consignee || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Cargo Type</span>
            <span className={styles.detailValue}>{inspection.cargoType || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>HAZMAT</span>
            <span className={styles.detailValue}>{inspection.hazmat ? 'Yes' : 'No'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Load Secured</span>
            <span className={styles.detailValue}>{inspection.loadSecured || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Sign-off</h3>
        <div className={styles.signOffGrid}>
          <div className={styles.signOffBlock}>
            <p className={styles.signOffRole}>Driver</p>
            <div className={styles.signOffDetail}>
              <span className={styles.signOffLabel}>Inspected by:</span>
              <span className={styles.signOffValue}>{inspection.inspectedBySignature || 'N/A'}</span>
            </div>
            <div className={styles.signOffDetail}>
              <span className={styles.signOffLabel}>Date:</span>
              <span className={styles.signOffValue}>{formatDate(inspection.inspectedByDate)}</span>
            </div>
          </div>
          <div className={styles.signOffBlock}>
            <p className={styles.signOffRole}>Approved by</p>
            <div className={styles.signOffDetail}>
              <span className={styles.signOffLabel}>Signature:</span>
              <span className={styles.signOffValue}>{inspection.approvedBySignature || 'N/A'}</span>
            </div>
            <div className={styles.signOffDetail}>
              <span className={styles.signOffLabel}>Date:</span>
              <span className={styles.signOffValue}>{formatDate(inspection.approvedByDate)}</span>
            </div>
            <div className={styles.signOffDetail}>
              <span className={styles.signOffLabel}>Time:</span>
              <span className={styles.signOffValue}>{inspection.approvedByTime || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {(inspection.driverComments || inspection.inspectorComments) && (
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Comments</h3>
          {inspection.driverComments && (
            <div className={styles.commentBlock}>
              <p className={styles.commentLabel}>Driver's Comments:</p>
              <p className={styles.commentText}>{inspection.driverComments}</p>
            </div>
          )}
          {inspection.inspectorComments && (
            <div className={styles.commentBlock}>
              <p className={styles.commentLabel}>Inspector's Comments:</p>
              <p className={styles.commentText}>{inspection.inspectorComments}</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.detailsSection}>
        <h3 className={styles.sectionTitle}>Inspection Date</h3>
        <p className={styles.inspectionDate}>{formatDate(inspection.createdAt)}</p>
      </div>
    </main>
  )
}