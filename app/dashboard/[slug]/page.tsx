'use client'

import Inspection from '@/components/dashboard/slug/inspection/Inspection'
import CreateInspection from '@/components/dashboard/slug/create-inspection/CreateInspection'
import CreateVehicle from '@/components/dashboard/slug/create-vehicle/CreateVehicle'
import { notFound, useParams } from 'next/navigation'
import Vehicle from '@/components/dashboard/slug/vehicle/Vehicle'

export default function SlugPage() {
  const params = useParams()
  const slug = params.slug as string
  
  if (slug === 'inspection') return <Inspection />
  if (slug === 'create-inspection') return <CreateInspection/>
  if (slug === 'create-vehicle') return <CreateVehicle/>
  if (slug === 'vehicle') return <Vehicle/>
  return notFound()
}
