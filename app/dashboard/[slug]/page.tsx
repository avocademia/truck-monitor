'use client'

import Inspection from '@/components/dashboard/slug/inspection/Inspection'
import CreateInspection from '@/components/dashboard/slug/create-inspection/CreateInspection'
import { useParams } from 'next/navigation'

export default function InspectionPage() {
  const params = useParams()
  const slug = params.slug as string
  if (slug === 'inspection') return <Inspection />
  if (slug === 'create-inspection') return <CreateInspection/>
}
