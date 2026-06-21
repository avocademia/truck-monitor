'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import styles from './inspections.module.scss'
import InspectionCard from './inpection-card/InspectionCard'

export default function Inspections() {
  const [inspections, setInspections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInspections() {
      try {
        const response = await fetch('/api/inspections')
        if (!response.ok) throw new Error('Failed to fetch inspections')
        const data = await response.json()
        setInspections(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  return (
    <article className={styles.inspections}>
      <div className={styles.header}>
        <h1>Inspections</h1>
        <p className={styles.subtitle}>View and manage all truck inspections</p>
      </div>

      {loading && (
        <div className={styles.loading}>
          <Icon icon="line-md:loading-loop" className={styles.loadingIcon} />
          <p>Loading inspections...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && inspections.length === 0 && (
        <div className={styles.empty}>
          <Icon icon="mdi:clipboard-text-outline" className={styles.emptyIcon} />
          <p>No inspections found</p>
          <p className={styles.emptyHint}>Submit a new inspection to get started</p>
        </div>
      )}

      {!loading && !error && inspections.length > 0 && (
        <div className={styles.grid}>
          {inspections.map((inspection) => (
            <InspectionCard key={inspection.id} inspection={inspection} />
          ))}
        </div>
      )}
    </article>
  )
}