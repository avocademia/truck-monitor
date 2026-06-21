"use client"

import styles from './auth.module.scss'
import { useState, useRef } from "react"
import { toast } from "react-toastify"
import { useRouter } from 'next/navigation'

export default function AuthPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [passcodeSent, setPasscodeSent] = useState(false)
    const [email, setEmail] = useState("")
    const [passcode, setPasscode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const router = useRouter()

    async function requestPasscode() {
        if (!email) {
            toast.error("Please enter your email", { hideProgressBar: true })
            return
        }

        try {
            setIsLoading(true)
            const response = await fetch('/api/auth/send-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                setPasscodeSent(true)
                toast.success("Passcode sent to your email", { hideProgressBar: true })
                // Focus first passcode input
                setTimeout(() => inputRefs.current[0]?.focus(), 100)
            } else {
                toast.error(data.error || "Failed to send passcode", { hideProgressBar: true })
            }
        } catch (err) {
            toast.error("Something went wrong", { hideProgressBar: true })
        } finally {
            setIsLoading(false)
        }
    }

    async function resendPasscode() {
        try {
            setIsLoading(true)
            const response = await fetch('/api/auth/send-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Passcode resent to your email", { hideProgressBar: true })
                // Reset passcode inputs
                setPasscode(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            } else {
                toast.error(data.error || "Failed to resend passcode", { hideProgressBar: true })
            }
        } catch (error) {
            toast.error("Something went wrong", { hideProgressBar: true })
        } finally {
            setIsLoading(false)
        }
    }

    async function verifyPasscode() {
        const code = passcode.join("")
        if (code.length !== 6) {
            toast.error("Please enter the complete 6-digit passcode", { hideProgressBar: true })
            return
        }

        try {
            setIsLoading(true)
            const response = await fetch('/api/auth/verify-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, passcode: code })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Login successful", { hideProgressBar: true })
                router.push('/dashboard')
            } else {
                toast.error(data.error || "Invalid passcode", { hideProgressBar: true })
                setPasscode(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            }
        } catch (error) {
            toast.error("Something went wrong", { hideProgressBar: true })
        } finally {
            setIsLoading(false)
        }
    }

    const handlePasscodeChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(0, 1)
        }

        const newPasscode = [...passcode]
        newPasscode[index] = value.toUpperCase()
        setPasscode(newPasscode)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        // Auto-submit when complete
        if (index === 5 && value) {
            verifyPasscode()
        }
    }

    const handlePasscodeKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !passcode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').toUpperCase().slice(0, 6)
        const newPasscode = [...passcode]
        
        for (let i = 0; i < pastedData.length; i++) {
            if (i < 6) {
                newPasscode[i] = pastedData[i]
            }
        }
        
        setPasscode(newPasscode)
        
        // Focus the next empty input or the last one
        const nextEmptyIndex = newPasscode.findIndex(p => p === "")
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus()
        } else {
            inputRefs.current[5]?.focus()
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <h1 className={styles.title}>Truck Monitor</h1>
                <p className={styles.subtitle}>Sign in with your email</p>
                
                <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                    {!passcodeSent ? (
                        <div className={styles.emailSection}>
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                disabled={isLoading}
                            />
                            <button 
                                type="button" 
                                onClick={requestPasscode} 
                                disabled={isLoading || !email}
                                className={styles.button}
                            >
                                {isLoading ? "Sending..." : "Send Passcode"}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.passcodeSection}>
                            <p className={styles.passcodeHint}>Enter the 6-digit code sent to {email}</p>
                            <div className={styles.passcodeInputs}>
                                {passcode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el }}
                                        type="text"
                                        inputMode="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handlePasscodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handlePasscodeKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={styles.passcodeInput}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            <div className={styles.passcodeActions}>
                                <button 
                                    type="button" 
                                    onClick={resendPasscode} 
                                    disabled={isLoading}
                                    className={styles.resendButton}
                                >
                                    {isLoading ? "Resending..." : "Resend Code"}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setPasscodeSent(false)
                                        setPasscode(["", "", "", "", "", ""])
                                    }}
                                    className={styles.backButton}
                                    disabled={isLoading}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
    )
}