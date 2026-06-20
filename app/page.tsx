'use client'

import { useMemo, useState } from "react"
import { Icon } from '@iconify/react'
import { toast } from "react-toastify"
import styles from './home.module.scss'
import { useRouter } from "next/navigation"
import Link from "next/link"

/* ==========================================================================
   Types
   ========================================================================== */

type ItemStatus = 'ok' | 'attention' | 'na'

interface Variant {
    id: string
    label: string
}

interface ChecklistItemDef {
    id: string
    number: number
    label: string
    /** When present, this item is actually N independent checks (e.g. Horse vs Trailer)
     *  that each need their own status — not one shared status for the item. */
    variants?: Variant[]
}

interface SectionDef {
    id: string
    title: string
    icon: string
    items: ChecklistItemDef[]
}

/** A leaf is one independently-answerable row: either the item itself (no variants),
 *  or one variant of it (e.g. "Hazard lights — Horse"). */
interface LeafRef {
    key: string
    variantLabel?: string
}

function leavesForItem(item: ChecklistItemDef): LeafRef[] {
    if (!item.variants || item.variants.length === 0) {
        return [{ key: item.id }]
    }
    return item.variants.map((v) => ({ key: `${item.id}__${v.id}`, variantLabel: v.label }))
}

interface HeaderDetails {
    vehicleRegistration: string
    vehicleMake: string
    edmReading: string
    trailerRegistration: string
    driverName: string
    driverAge: string
    licenceExpiryDate: string
    tripFrom: string
    tripTo: string
    consignee: string
    cargoType: string
    hazmat: boolean
}

export interface InspectionSubmission {
    header: HeaderDetails
    statuses: Record<string, ItemStatus | null>
    loadSecured: 'yes' | 'no' | null
    driverCellPhone: string
    driverComments: string
    inspectorComments: string
    inspectedBySignature: string
    inspectedByDate: string
    approvedBySignature: string
    approvedByDate: string
    approvedByTime: string
}

/* ==========================================================================
   Checklist data
   ========================================================================== */

const SECTIONS: SectionDef[] = [
    {
        id: 'around-truck',
        title: 'Around the Truck',
        icon: 'mdi:truck-outline',
        items: [
            { id: 'tire-pressure', number: 1, label: 'Tire pressure' },
            { id: 'tire-condition', number: 2, label: 'Tire condition', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'cleanliness', number: 3, label: 'Overall cleanliness of vehicle' },
            { id: 'oil-leaks', number: 4, label: 'Oil leaks' },
            { id: 'indicators', number: 5, label: 'Indicators', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'taillights', number: 6, label: 'Taillights', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'reverse-beeper', number: 7, label: 'Reverse beeper' },
            { id: 'reverse-light', number: 8, label: 'Reverse light', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'twist-locks', number: 9, label: 'Twist locks' },
            { id: 'headlights', number: 10, label: 'Headlights', variants: [{ id: 'high', label: 'High' }, { id: 'low', label: 'Low' }] },
            { id: 'hazard-lights', number: 11, label: 'Hazard lights', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'brake-lights', number: 12, label: 'Brake lights', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'spare-wheel', number: 13, label: 'Spare wheel' },
            { id: 'horse-suspension', number: 14, label: 'Horse suspension', variants: [{ id: 'springs', label: 'Springs' }, { id: 'axle', label: 'Axle' }, { id: 'shocks', label: 'Shock absorbers' }] },
            { id: 'trailer-suspension', number: 15, label: 'Trailer suspension', variants: [{ id: 'springs', label: 'Springs' }, { id: 'axle', label: 'Axle' }, { id: 'shocks', label: 'Shock absorbers' }] },
            { id: 'air-brake-lines', number: 16, label: 'Air brake lines' },
            { id: 'trailer-deck', number: 17, label: 'Trailer deck condition' },
            { id: 'lashing-points', number: 18, label: 'Lashing points' },
            { id: 'mudflaps', number: 19, label: 'Mudflaps', variants: [{ id: 'present', label: 'Present' }, { id: 'missing', label: 'Missing' }] },
            { id: 'wheel-nuts', number: 20, label: 'Wheel nuts & studs', variants: [{ id: 'horse', label: 'Horse' }, { id: 'trailer', label: 'Trailer' }] },
            { id: 'couple-pin', number: 21, label: 'Couple pin' },
            { id: 'trailer-stands', number: 22, label: 'Trailer stands (legs)' },
            { id: 'chassis-condition', number: 23, label: 'Chassis condition' },
            { id: 'under-run', number: 24, label: 'Trailer under-run protection' },
            { id: 'general-mechanical', number: 25, label: "General mechanical condition of truck head / attachments (visual)" },
        ],
    },
    {
        id: 'ppe',
        title: 'PPE & Uniform — Driver and Turn Man',
        icon: 'mdi:account-hard-hat-outline',
        items: [
            { id: 'helmet', number: 26, label: 'Helmet' },
            { id: 'reflective-jacket', number: 27, label: 'Reflective jacket' },
            { id: 'hand-gloves', number: 28, label: 'Hand gloves' },
            { id: 'uniform-trousers', number: 29, label: 'Uniform trousers' },
            { id: 'safety-boots', number: 30, label: 'Safety boots' },
            { id: 'long-sleeve-shirts', number: 31, label: 'Long sleeve shirts' },
        ],
    },
    {
        id: 'under-hood',
        title: 'Under the Hood',
        icon: 'mdi:engine-outline',
        items: [
            { id: 'drive-belts', number: 32, label: 'Visible drive belts, wires and hoses' },
            { id: 'radiator-overflow', number: 33, label: 'Radiator overflow container level' },
            { id: 'fluids-level', number: 34, label: 'Fluids at proper level', variants: [{ id: 'brake', label: 'Brake' }, { id: 'steering', label: 'Steering' }] },
            { id: 'engine-oil', number: 35, label: 'Engine oil level' },
            { id: 'washer-fluid', number: 36, label: 'Windshield washer fluid' },
            { id: 'battery', number: 37, label: 'Battery housing and connections' },
            { id: 'cargo-protection', number: 38, label: 'Cargo protection - car carrier' },
        ],
    },
    {
        id: 'cabin',
        title: "In Driver's Cabin",
        icon: 'mdi:steering',
        items: [
            { id: 'wipers', number: 39, label: 'Windshield wipers condition' },
            { id: 'windshield', number: 40, label: 'Windshield condition' },
            { id: 'warning-triangle', number: 41, label: 'Warning triangle' },
            { id: 'flashlight', number: 42, label: 'Flashlight' },
            { id: 'first-aid', number: 43, label: 'First aid kit - valid' },
            { id: 'fire-extinguisher', number: 44, label: 'Fire extinguisher - 2×6kg outside, 1×2kg cabin' },
            { id: 'tools', number: 45, label: 'Tools', variants: [{ id: 'wheel-chocks', label: 'Wheel chocks' }, { id: 'toolbox', label: 'Toolbox' }] },
            { id: 'steering-play', number: 46, label: 'Steering wheel play' },
            { id: 'fuel-tank', number: 47, label: 'Fuel tank condition' },
            { id: 'modifications', number: 48, label: 'Non-approved truck modifications' },
            { id: 'camera', number: 49, label: 'On-board camera / video recorder (in & out of cabin)' },
            { id: 'seat-covers', number: 50, label: 'Driver and passenger seat covers condition' },
            { id: 'seat-belts', number: 51, label: 'Seat belts - driver and passenger' },
            { id: 'mirrors', number: 52, label: 'Rear view & side mirrors', variants: [{ id: 'left', label: 'Left' }, { id: 'right', label: 'Right' }] },
            { id: 'parking-brake', number: 53, label: 'Parking brake' },
            { id: 'horn', number: 54, label: 'Horn' },
            { id: 'oil-pressure-gauge', number: 55, label: 'Oil pressure gauge' },
            { id: 'temp-gauge', number: 56, label: 'Engine temperature gauge' },
            { id: 'gps', number: 57, label: 'GPS system' },
            { id: 'abs-light', number: 58, label: 'ABS dashboard indicator', variants: [{ id: 'on', label: 'On' }, { id: 'off', label: 'Off' }] },
            { id: 'brakes', number: 59, label: 'Brakes' },
            { id: 'comesa-insurance', number: 60, label: 'Valid COMESA insurance (truck and trailer)' },
            { id: 'kra-license', number: 61, label: 'Valid Goods In Transit licence (KRA)' },
            { id: 'driving-licence', number: 62, label: "Valid driver's driving licence" },
            { id: 'defensive-driving', number: 63, label: "Valid driver's Defensive Driving certificate" },
            { id: 'fitness-cert', number: 64, label: "Valid driver's Fitness to Work certificate" },
            { id: 'ivms', number: 65, label: 'Truck / Trailer IVMS system in working condition' },
        ],
    },
]

const TOTAL_ITEMS = SECTIONS.reduce(
    (sum, section) => sum + section.items.reduce((s, item) => s + leavesForItem(item).length, 0),
    0
)

const STATUS_META: Record<ItemStatus, { label: string; icon: string }> = {
    ok: { label: 'OK', icon: 'mdi:check-circle' },
    attention: { label: 'Needs attention', icon: 'mdi:alert-circle' },
    na: { label: 'N/A', icon: 'mdi:minus-circle' },
}

const emptyHeader: HeaderDetails = {
    vehicleRegistration: '',
    vehicleMake: '',
    edmReading: '',
    trailerRegistration: '',
    driverName: '',
    driverAge: '',
    licenceExpiryDate: '',
    tripFrom: '',
    tripTo: '',
    consignee: '',
    cargoType: '',
    hazmat: false,
}

/* ==========================================================================
   Small building blocks
   ========================================================================== */

function StatusToggle({ value, onChange }: { value: ItemStatus | null, onChange: (status: ItemStatus) => void }) {
    return (
        <div className={styles.statusToggle} role="radiogroup" aria-label="Inspection status">
            {(Object.keys(STATUS_META) as ItemStatus[]).map((status) => {
                const meta = STATUS_META[status]
                const isActive = value === status
                return (
                    <button
                        key={status}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        className={`${styles.statusBtn} ${styles[`status-${status}`]} ${isActive ? styles.statusBtnActive : ''}`}
                        onClick={() => onChange(status)}
                    >
                        <Icon icon={meta.icon} />
                        <span>{meta.label}</span>
                    </button>
                )
            })}
        </div>
    )
}

function ChecklistItemBlock({
    item,
    statuses,
    onLeafStatus,
}: {
    item: ChecklistItemDef
    statuses: Record<string, ItemStatus | null>
    onLeafStatus: (leafKey: string, status: ItemStatus) => void
}) {
    const leaves = leavesForItem(item)

    // Simple item: one row, number + label + its own toggle.
    if (leaves.length === 1 && !leaves[0].variantLabel) {
        const leaf = leaves[0]
        const status = statuses[leaf.key] ?? null
        return (
            <div className={`${styles.itemRow} ${status ? styles.itemRowAnswered : ''}`}>
                <div className={styles.itemMain}>
                    <span className={styles.itemNumber}>{item.number}</span>
                    <p className={styles.itemLabel}>{item.label}</p>
                </div>
                <StatusToggle value={status} onChange={(s) => onLeafStatus(leaf.key, s)} />
            </div>
        )
    }

    // Item with variants: each variant is checked and tracked independently.
    return (
        <div className={styles.itemGroup}>
            <div className={styles.itemGroupHeader}>
                <span className={styles.itemNumber}>{item.number}</span>
                <p className={styles.itemLabel}>{item.label}</p>
            </div>
            <div className={styles.variantList}>
                {leaves.map((leaf) => {
                    const status = statuses[leaf.key] ?? null
                    return (
                        <div key={leaf.key} className={`${styles.variantRow} ${status ? styles.itemRowAnswered : ''}`}>
                            <span className={styles.variantLabel}>{leaf.variantLabel}</span>
                            <StatusToggle value={status} onChange={(s) => onLeafStatus(leaf.key, s)} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function SectionCard({
    section,
    statuses,
    isOpen,
    onToggleOpen,
    onLeafStatus,
}: {
    section: SectionDef
    statuses: Record<string, ItemStatus | null>
    isOpen: boolean
    onToggleOpen: () => void
    onLeafStatus: (leafKey: string, status: ItemStatus) => void
}) {
    const allLeafKeys = section.items.flatMap((item) => leavesForItem(item).map((l) => l.key))
    const answeredCount = allLeafKeys.filter((key) => statuses[key]).length
    const total = allLeafKeys.length
    const complete = answeredCount === total

    return (
        <section className={styles.sectionCard}>
            <button type="button" className={styles.sectionHeader} onClick={onToggleOpen} aria-expanded={isOpen}>
                <div className={styles.sectionHeaderLeft}>
                    <Icon icon={section.icon} className={styles.sectionIcon} />
                    <h2>{section.title}</h2>
                </div>
                <div className={styles.sectionHeaderRight}>
                    <span className={`${styles.sectionCount} ${complete ? styles.sectionCountComplete : ''}`}>
                        {answeredCount}/{total}
                    </span>
                    <Icon icon="mdi:chevron-down" className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className={styles.sectionBody}>
                    {section.items.map((item) => (
                        <ChecklistItemBlock
                            key={item.id}
                            item={item}
                            statuses={statuses}
                            onLeafStatus={onLeafStatus}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}

/* ==========================================================================
   Main component
   ========================================================================== */

export default function PreTripInspectionForm({
    onSubmit,
}: {
    onSubmit?: (submission: InspectionSubmission) => void | Promise<void>
}) {
    const [header, setHeader] = useState<HeaderDetails>(emptyHeader)

    const [statuses, setStatuses] = useState<Record<string, ItemStatus | null>>(() => {
        const initial: Record<string, ItemStatus | null> = {}
        SECTIONS.forEach((section) => {
            section.items.forEach((item) => {
                leavesForItem(item).forEach((leaf) => {
                    initial[leaf.key] = null
                })
            })
        })
        return initial
    })

    const router = useRouter()
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({ [SECTIONS[0].id]: true })

    const [loadSecured, setLoadSecured] = useState<'yes' | 'no' | null>(null)
    const [driverCellPhone, setDriverCellPhone] = useState('')
    const [driverComments, setDriverComments] = useState('')
    const [inspectorComments, setInspectorComments] = useState('')

    const [inspectedBySignature, setInspectedBySignature] = useState('')
    const [inspectedByDate, setInspectedByDate] = useState('')
    const [approvedBySignature, setApprovedBySignature] = useState('')
    const [approvedByDate, setApprovedByDate] = useState('')
    const [approvedByTime, setApprovedByTime] = useState('')

    const [submitting, setSubmitting] = useState(false)

    const answeredItems = useMemo(
        () => Object.values(statuses).filter((status) => status).length,
        [statuses]
    )
    const attentionItems = useMemo(
        () => Object.values(statuses).filter((status) => status === 'attention').length,
        [statuses]
    )
    const progressPercent = Math.round((answeredItems / TOTAL_ITEMS) * 100)

    const updateHeader = <K extends keyof HeaderDetails>(field: K, value: HeaderDetails[K]) => {
        setHeader((prev) => ({ ...prev, [field]: value }))
    }

    const handleLeafStatus = (leafKey: string, status: ItemStatus) => {
        setStatuses((prev) => ({
            ...prev,
            [leafKey]: prev[leafKey] === status ? null : status,
        }))
    }

    const toggleSection = (sectionID: string) => {
        setOpenSections((prev) => ({ ...prev, [sectionID]: !prev[sectionID] }))
    }

    const expandAll = () => {
        setOpenSections(Object.fromEntries(SECTIONS.map((s) => [s.id, true])))
    }

    const handleSubmit = async () => {
        if (!header.vehicleRegistration.trim() || !header.driverName.trim()) {
            toast.error('Vehicle registration and driver name are required', { hideProgressBar: true })
            return
        }
        if (answeredItems < TOTAL_ITEMS) {
            toast.error(`${TOTAL_ITEMS - answeredItems} item(s) still need a status before you can submit`, { hideProgressBar: true })
            return
        }

        const submission: InspectionSubmission = {
            header,
            statuses,
            loadSecured,
            driverCellPhone,
            driverComments,
            inspectorComments,
            inspectedBySignature,
            inspectedByDate,
            approvedBySignature,
            approvedByDate,
            approvedByTime,
        }

        setSubmitting(true)
        try {
            if (onSubmit) {
                await onSubmit(submission)
            } else {
                try {
                    const response = await fetch('/api/inspections', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(submission),
                    })

                    const result = await response.json()
                    if (result) {
                        router.push('/dashboard?tab=inspections')
                    }
                } catch (error:any) {
                    toast.error('Error submitting inspection', { hideProgressBar: true })
                }
            }
            toast.success('Inspection submitted', { hideProgressBar: true })
        } catch (error) {
            toast.error("Hmm... something went wrong, let's try that again", { hideProgressBar: true })
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <main className={styles.main}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.navContent}>
                    <h1 className={styles.navTitle}>Truck Monitor</h1>
                    <Link href="/dashboard" className={styles.navBtn}>
                        <Icon icon="mdi:view-dashboard" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </nav>

            {/* Header / Progress */}
            <section className={styles.topBar}>
                <div className={styles.topBarText}>
                    <h1>Pre-Trip Truck Inspection</h1>
                    <p>Work through each section below. Tap a status for every item before submitting.</p>
                </div>
                <div className={styles.progressBlock}>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className={styles.progressLabels}>
                        <span>{answeredItems}/{TOTAL_ITEMS} checked</span>
                        {attentionItems > 0 && (
                            <span className={styles.progressAttention}>
                                <Icon icon="mdi:alert-circle" /> {attentionItems} need attention
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Vehicle & Trip Details */}
            <section className={styles.detailsCard}>
                <h2 className={styles.cardTitle}><Icon icon="mdi:clipboard-text-outline" /> Vehicle &amp; Trip Details</h2>
                <div className={styles.detailsGrid}>
                    <label className={styles.formField}>
                        <span>Vehicle registration</span>
                        <input value={header.vehicleRegistration} onChange={(e) => updateHeader('vehicleRegistration', e.target.value)} placeholder="e.g. KDV 279X" />
                    </label>
                    <label className={styles.formField}>
                        <span>Vehicle make</span>
                        <input value={header.vehicleMake} onChange={(e) => updateHeader('vehicleMake', e.target.value)} placeholder="e.g. Scania" />
                    </label>
                    <label className={styles.formField}>
                        <span>EDM reading</span>
                        <input value={header.edmReading} onChange={(e) => updateHeader('edmReading', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Trailer registration</span>
                        <input value={header.trailerRegistration} onChange={(e) => updateHeader('trailerRegistration', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Driver name</span>
                        <input value={header.driverName} onChange={(e) => updateHeader('driverName', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Driver age</span>
                        <input type="number" value={header.driverAge} onChange={(e) => updateHeader('driverAge', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Driving licence expiry</span>
                        <input type="date" value={header.licenceExpiryDate} onChange={(e) => updateHeader('licenceExpiryDate', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Consignee</span>
                        <input value={header.consignee} onChange={(e) => updateHeader('consignee', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Cargo type</span>
                        <input value={header.cargoType} onChange={(e) => updateHeader('cargoType', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Trip from</span>
                        <input value={header.tripFrom} onChange={(e) => updateHeader('tripFrom', e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Trip to</span>
                        <input value={header.tripTo} onChange={(e) => updateHeader('tripTo', e.target.value)} />
                    </label>
                    <label className={styles.checkboxField}>
                        <input type="checkbox" checked={header.hazmat} onChange={(e) => updateHeader('hazmat', e.target.checked)} />
                        <span>Hazardous materials (HAZMAT)</span>
                    </label>
                </div>
            </section>

            {/* Legend */}
            <section className={styles.legend}>
                {(Object.keys(STATUS_META) as ItemStatus[]).map((status) => (
                    <span key={status} className={`${styles.legendItem} ${styles[`status-${status}`]}`}>
                        <Icon icon={STATUS_META[status].icon} /> {STATUS_META[status].label}
                    </span>
                ))}
                <button type="button" className={styles.expandAllBtn} onClick={expandAll}>
                    Expand all sections
                </button>
            </section>

            {/* Checklist sections */}
            {SECTIONS.map((section) => (
                <SectionCard
                    key={section.id}
                    section={section}
                    statuses={statuses}
                    isOpen={!!openSections[section.id]}
                    onToggleOpen={() => toggleSection(section.id)}
                    onLeafStatus={handleLeafStatus}
                />
            ))}

            {/* Post loading */}
            <section className={styles.detailsCard}>
                <h2 className={styles.cardTitle}><Icon icon="mdi:package-variant-closed" /> Post Loading</h2>
                <div className={styles.postLoadingRow}>
                    <span className={styles.postLoadingLabel}>Load secured properly?</span>
                    <div className={styles.yesNoToggle}>
                        <button type="button" className={loadSecured === 'yes' ? styles.yesNoActive : ''} onClick={() => setLoadSecured((prev) => prev === 'yes' ? null : 'yes')}>Yes</button>
                        <button type="button" className={loadSecured === 'no' ? styles.yesNoActive : ''} onClick={() => setLoadSecured((prev) => prev === 'no' ? null : 'no')}>No</button>
                    </div>
                </div>
                <label className={styles.formField}>
                    <span>Driver cell phone number</span>
                    <input value={driverCellPhone} onChange={(e) => setDriverCellPhone(e.target.value)} placeholder="07xx xxx xxx" />
                </label>
            </section>

            {/* Comments */}
            <section className={styles.detailsCard}>
                <h2 className={styles.cardTitle}><Icon icon="mdi:comment-text-outline" /> Comments</h2>
                <div className={styles.commentsGrid}>
                    <label className={styles.formField}>
                        <span>Driver&apos;s comments</span>
                        <textarea rows={3} value={driverComments} onChange={(e) => setDriverComments(e.target.value)} />
                    </label>
                    <label className={styles.formField}>
                        <span>Inspector&apos;s comments</span>
                        <textarea rows={3} value={inspectorComments} onChange={(e) => setInspectorComments(e.target.value)} />
                    </label>
                </div>
            </section>

            {/* Sign-off */}
            <section className={styles.detailsCard}>
                <h2 className={styles.cardTitle}><Icon icon="mdi:draw-pen" /> Sign-off</h2>
                <div className={styles.signOffGrid}>
                    <div className={styles.signOffBlock}>
                        <p className={styles.signOffRole}>Driver</p>
                        <label className={styles.formField}>
                            <span>Inspected by (signature / name)</span>
                            <input value={inspectedBySignature} onChange={(e) => setInspectedBySignature(e.target.value)} />
                        </label>
                        <label className={styles.formField}>
                            <span>Date</span>
                            <input type="date" value={inspectedByDate} onChange={(e) => setInspectedByDate(e.target.value)} />
                        </label>
                    </div>
                    <div className={styles.signOffBlock}>
                        <p className={styles.signOffRole}>Health &amp; Safety Officer / Yard Supervisor</p>
                        <label className={styles.formField}>
                            <span>Approved for departure by</span>
                            <input value={approvedBySignature} onChange={(e) => setApprovedBySignature(e.target.value)} />
                        </label>
                        <div className={styles.dateTimeRow}>
                            <label className={styles.formField}>
                                <span>Date</span>
                                <input type="date" value={approvedByDate} onChange={(e) => setApprovedByDate(e.target.value)} />
                            </label>
                            <label className={styles.formField}>
                                <span>Time</span>
                                <input type="time" value={approvedByTime} onChange={(e) => setApprovedByTime(e.target.value)} />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky submit bar */}
            <div className={styles.submitBar}>
                <span className={styles.submitBarStatus}>
                    {answeredItems === TOTAL_ITEMS
                        ? 'All items checked'
                        : `${TOTAL_ITEMS - answeredItems} item(s) remaining`}
                </span>
                <button type="button" className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
                    <Icon icon={submitting ? 'line-md:loading-loop' : 'mdi:send-outline'} />
                    {submitting ? 'Submitting...' : 'Submit Inspection'}
                </button>
            </div>
        </main>
    )
}