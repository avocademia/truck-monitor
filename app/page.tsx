'use client'

import { useState } from "react"
import Image from "next/image"
import { Icon } from '@iconify/react'
import styles from './home.module.scss'
import { useAuthStore } from "@/lib/authStore"

/* ==========================================================================
   Content data — sourced from the company profile PDF
   ========================================================================== */

const NAV_LINKS = [
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'corridors', label: 'Corridors' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'why-us', label: 'Why Us' },
]

const CORE_STRENGTHS = [
    {
        id: 'domestic',
        title: 'Domestic Logistics',
        icon: 'mdi:map-marker-path',
        items: [
            'Direct haulage from the Port of Mombasa to all Kenyan destinations',
            'Streamlined Nairobi ICD and depot distribution services',
            'Flexible handling of both FCL and LCL shipments',
            'Expertise in containerized cargo (20ft & 40ft)',
            'Reliable support for bulk and project cargo',
        ],
    },
    {
        id: 'regional',
        title: 'Regional & Cross Border Solutions',
        icon: 'mdi:earth',
        items: [
            'Northern Corridor routes: Mombasa to Kampala and Juba',
            'Central Corridor services: Mombasa to Kigali and Bujumbura',
            'Simplified customs documentation and bonded cargo arrangements',
            'Fast, efficient border clearance for time critical deliveries',
        ],
    },
    {
        id: 'fleet-advantage',
        title: 'Fleet Advantage',
        icon: 'mdi:truck-fast-outline',
        items: [
            'A growing fleet of 15+ trucks across Nairobi, Mombasa, and Kampala',
            'Specialized equipment: high-sided trailers, flatbeds, skeleton trailers',
            'All vehicles fitted with GPRS tracking for real-time cargo visibility',
            'Drivers trained under our guiding principle: Safety First',
            'Proven record of punctual, incident-free deliveries',
        ],
    },
]

const CORRIDORS = [
    {
        id: 'northern',
        name: 'Northern Corridor',
        stops: ['Mombasa', 'Nairobi', 'Kampala', 'Juba'],
    },
    {
        id: 'central',
        name: 'Central Corridor',
        stops: ['Mombasa', 'Nairobi', 'Kigali', 'Bujumbura'],
    },
]

const WHY_US = [
    { id: 'reliability', label: 'Reliability', desc: 'Consistent service across domestic and regional corridors', icon: 'mdi:shield-check-outline' },
    { id: 'technology', label: 'Technology', desc: 'Smart tracking systems for transparency and peace of mind', icon: 'mdi:radar' },
    { id: 'safety', label: 'Safety', desc: 'International standards embedded in every journey', icon: 'mdi:traffic-light-outline' },
    { id: 'agility', label: 'Agility', desc: 'A young company that adapts quickly to evolving client needs', icon: 'mdi:lightning-bolt-outline' },
    { id: 'vision', label: 'Vision', desc: "To become East Africa's most trusted logistics partner by 2030", icon: 'mdi:flag-checkered' },
]

const CONTACT = {
    phone: '+254 716 444 753',
    phoneHref: 'tel:+254716444753',
    email: 'info@kaberianeastafrica.co.ke',
    emailHref: 'mailto:info@kaberianeastafrica.co.ke',
    address: 'Box: 219-00100 Nairobi, Kenya',
}

/* ==========================================================================
   Small building blocks
   ========================================================================== */

/** Generic image placeholder — swap the <Image src> for the real asset.
 *  The striped, labeled background is only here so the layout is visible
 *  before real photos are dropped in; remove .imagePlaceholder styling once
 *  real images are in place. */
function ImagePlaceholder({ label, aspect, alt }: { label: string, aspect: string, alt: string }) {
    return (
        <div className={styles.imagePlaceholder} style={{ aspectRatio: aspect }}>
            {/* TODO: replace src with the real photo */}
            <Image src="/images/placeholder.jpg" alt={alt} fill className={styles.imageFill} />
            <span className={styles.imagePlaceholderLabel}>{label}</span>
        </div>
    )
}

/* ==========================================================================
   Main component
   ========================================================================== */

export default function KaberianLanding() {
    const [menuOpen, setMenuOpen] = useState(false)

    const accessToken = useAuthStore((state) => state.accessToken)
    console.log("Access token:", accessToken)
    const scrollTo = (id: string) => {
        setMenuOpen(false)
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className={styles.page}>
            {/* ================= NAVBAR ================= */}
            <header className={styles.navbar}>
                <div className={styles.navInner}>
                    <button className={styles.brand} onClick={() => scrollTo('hero')}>
                        <div className={styles.logoMark}>
                            {/* IMAGE PLACEHOLDER: company logo mark */}
                            <Image src="/images/placeholder.jpg" alt="Kaberian East Africa Holdings logo" fill className={styles.imageFill} />
                        </div>
                        <span className={styles.brandText}>
                            KABERIAN
                            <small>East Africa Holdings</small>
                        </span>
                    </button>

                    <nav className={styles.navLinks} aria-label="Primary">
                        {NAV_LINKS.map((link) => (
                            <button key={link.id} onClick={() => scrollTo(link.id)}>{link.label}</button>
                        ))}
                    </nav>

                    <div className={styles.navActions}>
                        <a href={CONTACT.phoneHref} className={styles.navContactBtn}>
                            <Icon icon="mdi:phone-outline" />
                            <span>Call Us</span>
                        </a>
                        <a href={CONTACT.emailHref} className={styles.navContactBtn}>
                            <Icon icon="mdi:email-outline" />
                            <span>Email</span>
                        </a>
                        <button className={styles.navCta} onClick={() => scrollTo('contact')}>
                            Get A Quote
                        </button>
                    </div>

                    <button className={styles.menuToggle} onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={menuOpen}>
                        <Icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} />
                    </button>
                </div>

                {menuOpen && (
                    <div className={styles.mobileMenu}>
                        {NAV_LINKS.map((link) => (
                            <button key={link.id} onClick={() => scrollTo(link.id)}>{link.label}</button>
                        ))}
                        <div className={styles.mobileMenuDivider} />
                        <a href={CONTACT.phoneHref}><Icon icon="mdi:phone-outline" /> {CONTACT.phone}</a>
                        <a href={CONTACT.emailHref}><Icon icon="mdi:email-outline" /> {CONTACT.email}</a>
                        <button className={styles.navCta} onClick={() => scrollTo('contact')}>Get A Quote</button>
                    </div>
                )}
            </header>

            {/* ================= HERO ================= */}
            <section id="hero" className={styles.hero}>
                <div className={styles.heroBg}>
                    {/* IMAGE PLACEHOLDER: hero highway/sunset photo */}
                    <Image src="/images/placeholder.jpg" alt="Kaberian truck on the highway at sunset" fill priority className={styles.imageFill} />
                    <span className={styles.imagePlaceholderLabel}>HERO IMAGE — highway / sunset truck photo</span>
                </div>
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <p className={styles.heroEyebrow}>Founded 2025 · Nairobi, Kenya</p>
                    <h1>Your Trust,<br />Our Strength.</h1>
                    <p className={styles.heroSubtitle}>
                        A rising force in East African logistics — dependable haulage that connects
                        businesses to markets across Kenya, Uganda, Rwanda, Burundi, and South Sudan.
                    </p>
                    <div className={styles.heroActions}>
                        <button className={styles.btnPrimary} onClick={() => scrollTo('contact')}>
                            Get A Quote <Icon icon="mdi:arrow-right" />
                        </button>
                        <button className={styles.btnGhost} onClick={() => scrollTo('services')}>
                            Our Services
                        </button>
                    </div>
                </div>

                <div className={styles.heroCut} />
            </section>

            {/* ================= STATS ================= */}
            <section className={styles.stats}>
                <div className={styles.statItem}>
                    <span className={styles.statValue}>2025</span>
                    <span className={styles.statLabel}>Founded</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                    <span className={styles.statValue}>15+</span>
                    <span className={styles.statLabel}>Trucks in fleet</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                    <span className={styles.statValue}>3</span>
                    <span className={styles.statLabel}>Countries served</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                    <span className={styles.statValue}>2030</span>
                    <span className={styles.statLabel}>Our vision horizon</span>
                </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section id="about" className={styles.about}>
                <div className={styles.aboutText}>
                    <p className={styles.sectionEyebrow}>About Us</p>
                    <h2>Young, ambitious, and built for the road ahead.</h2>
                    <p>
                        Founded in 2025, Kaberian East Africa Holdings Ltd is a rising force in East African
                        logistics. Young, ambitious, and innovation-driven, we deliver dependable transport
                        solutions that connect businesses to markets across Kenya and beyond.
                    </p>
                    <p>
                        With agility and customer focus at our core, we ensure every shipment moves seamlessly
                        from origin to destination.
                    </p>
                </div>
                <ImagePlaceholder label="ABOUT IMAGE — container / depot photo" aspect="4/5" alt="Container being loaded onto a flatbed trailer" />
            </section>

            {/* ================= SERVICES / CORE STRENGTHS ================= */}
            <section id="services" className={styles.services}>
                <div className={styles.sectionHeading}>
                    <p className={styles.sectionEyebrow}>Our Core Strengths</p>
                    <h2>Everything moving from port to destination, handled.</h2>
                </div>
                <div className={styles.strengthsGrid}>
                    {CORE_STRENGTHS.map((group) => (
                        <article key={group.id} className={styles.strengthCard}>
                            <Icon icon={group.icon} className={styles.strengthIcon} />
                            <h3>{group.title}</h3>
                            <ul>
                                {group.items.map((item, i) => (
                                    <li key={i}>
                                        <Icon icon="mdi:check" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            {/* ================= CORRIDORS ================= */}
            <section id="corridors" className={styles.corridors}>
                <div className={styles.sectionHeading}>
                    <p className={`${styles.sectionEyebrow} ${styles.sectionEyebrowLight}`}>Trade Corridors</p>
                    <h2 className={styles.corridorsHeading}>Two corridors. One reliable network.</h2>
                </div>
                <div className={styles.corridorList}>
                    {CORRIDORS.map((corridor) => (
                        <div key={corridor.id} className={styles.corridorRow}>
                            <span className={styles.corridorName}>{corridor.name}</span>
                            <div className={styles.routeLine}>
                                {corridor.stops.map((stop, i) => (
                                    <div key={stop} className={styles.routeStop}>
                                        <span className={styles.routeDot} />
                                        <span className={styles.routeCity}>{stop}</span>
                                        {i < corridor.stops.length - 1 && <span className={styles.routeConnector} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= FLEET ================= */}
            <section id="fleet" className={styles.fleet}>
                <ImagePlaceholder label="FLEET IMAGE — truck fleet / GPRS tracking photo" aspect="16/11" alt="Kaberian truck fitted with tracking equipment" />
                <div className={styles.fleetText}>
                    <p className={styles.sectionEyebrow}>Fleet Advantage</p>
                    <h2>Equipped for whatever the cargo demands.</h2>
                    <ul className={styles.fleetList}>
                        <li><Icon icon="mdi:map-marker-radius-outline" /> Positioned across Nairobi, Mombasa, and Kampala</li>
                        <li><Icon icon="mdi:truck-cargo-container" /> High-sided trailers, flatbeds, and skeleton trailers</li>
                        <li><Icon icon="mdi:radar" /> GPRS tracking fitted fleet-wide for real-time visibility</li>
                        <li><Icon icon="mdi:shield-check-outline" /> Drivers trained under our Safety First principle</li>
                    </ul>
                </div>
            </section>

            {/* ================= WHY PARTNER WITH US ================= */}
            <section id="why-us" className={styles.whyUs}>
                <div className={styles.sectionHeading}>
                    <p className={`${styles.sectionEyebrow} ${styles.sectionEyebrowLight}`}>Why Partner With Us</p>
                    <h2 className={styles.whyUsHeading}>What you get with every shipment.</h2>
                </div>
                <div className={styles.whyUsGrid}>
                    {WHY_US.map((reason) => (
                        <div key={reason.id} className={styles.whyUsCard}>
                            <Icon icon={reason.icon} className={styles.whyUsIcon} />
                            <h3>{reason.label}</h3>
                            <p>{reason.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= CONTACT / CTA ================= */}
            <section id="contact" className={styles.contact}>
                <div className={styles.contactBg}>
                    {/* IMAGE PLACEHOLDER: contact band background photo */}
                    <Image src="/images/placeholder.jpg" alt="Kaberian truck parked at dusk" fill className={styles.imageFill} />
                    <span className={styles.imagePlaceholderLabel}>CONTACT BACKDROP IMAGE</span>
                </div>
                <div className={styles.contactOverlay} />

                <div className={styles.contactContent}>
                    <p className={styles.sectionEyebrow}>Get In Touch</p>
                    <h2>Ready to move your next shipment?</h2>
                    <div className={styles.contactCards}>
                        <a href={CONTACT.phoneHref} className={styles.contactCard}>
                            <Icon icon="mdi:phone-outline" />
                            <span>{CONTACT.phone}</span>
                        </a>
                        <a href={CONTACT.emailHref} className={styles.contactCard}>
                            <Icon icon="mdi:email-outline" />
                            <span>{CONTACT.email}</span>
                        </a>
                        <div className={styles.contactCard}>
                            <Icon icon="mdi:map-marker-outline" />
                            <span>{CONTACT.address}</span>
                        </div>
                    </div>
                    <button className={styles.btnPrimary} onClick={() => window.location.href = CONTACT.emailHref}>
                        Request A Quote <Icon icon="mdi:arrow-right" />
                    </button>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <div className={styles.logoMark}>
                            {/* IMAGE PLACEHOLDER: footer logo mark */}
                            <Image src="/images/placeholder.jpg" alt="Kaberian East Africa Holdings logo" fill className={styles.imageFill} />
                        </div>
                        <span className={styles.brandText}>
                            KABERIAN
                            <small>East Africa Holdings</small>
                        </span>
                    </div>
                    <nav className={styles.footerLinks}>
                        {NAV_LINKS.map((link) => (
                            <button key={link.id} onClick={() => scrollTo(link.id)}>{link.label}</button>
                        ))}
                    </nav>
                </div>
                <div className={styles.footerBottom}>
                    <span>© {new Date().getFullYear()} Kaberian East Africa Holdings Ltd. All rights reserved.</span>
                    <span className={styles.footerTagline}>"Your Trust, Our Strength"</span>
                </div>
            </footer>
        </div>
    )
}