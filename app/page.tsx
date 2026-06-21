import styles from './home.module.scss'
import { toast } from 'react-toastify'
import { notFound } from 'next/navigation'

export default async function Landing () {
    try {
        return (
            <main className={styles.main}>

            </main>
        )
    } catch (error) {
        toast.error("error loading page")
        return notFound()
    }
}