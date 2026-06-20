'use client'

import Inspection from '@/components/dashboard/slug/inspection/Inspection'
import { useParams } from 'next/navigation'

export default function InspectionPage() {
  const params = useParams()
  const slug = params.slug as string
  if (slug === 'inspection') return <Inspection />
}
