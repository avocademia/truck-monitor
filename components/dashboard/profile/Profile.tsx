import { Icon } from '@iconify/react'
import styles from './profile.module.scss'

export default function Profile() {
  return (
    <article className={styles.profile}>
      <div className={styles.header}>
        <h1>Profile</h1>
        <p className={styles.subtitle}>Manage your account settings</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <Icon icon="mdi:account" className={styles.avatarIcon} />
          </div>
          <div className={styles.avatarInfo}>
            <h2 className={styles.name}>John Driver</h2>
            <p className={styles.role}>Truck Driver</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Icon icon="mdi:clipboard-check" className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>24</span>
              <span className={styles.statLabel}>Inspections</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Icon icon="mdi:truck" className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>3</span>
              <span className={styles.statLabel}>Vehicles</span>
            </div>
          </div>
          <div className={styles.stat}>
            <Icon icon="mdi:calendar-check" className={styles.statIcon} />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>98%</span>
              <span className={styles.statLabel}>Completion</span>
            </div>
          </div>
        </div>

        <div className={styles.settings}>
          <h3 className={styles.settingsTitle}>Account Settings</h3>
          
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Icon icon="mdi:email" className={styles.settingIcon} />
              <div>
                <p className={styles.settingLabel}>Email</p>
                <p className={styles.settingValue}>john.driver@example.com</p>
              </div>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Icon icon="mdi:phone" className={styles.settingIcon} />
              <div>
                <p className={styles.settingLabel}>Phone</p>
                <p className={styles.settingValue}>+254 712 345 678</p>
              </div>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <Icon icon="mdi:license" className={styles.settingIcon} />
              <div>
                <p className={styles.settingLabel}>License Number</p>
                <p className={styles.settingValue}>DL-2024-12345</p>
              </div>
            </div>
            <button className={styles.editBtn}>Edit</button>
          </div>
        </div>
      </div>
    </article>
  )
}