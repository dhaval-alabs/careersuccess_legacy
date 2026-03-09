'use client'

import { useState, useTransition } from 'react'
import { createLeadAction } from '../../app/actions/leads'
import styles from './LeadCaptureForm.module.css'

const INDIA_CITIES = [
    "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad",
    "Mumbai", "Pune", "Kolkata", "Kochi", "Trivandrum",
    "Jaipur", "Faridabad", "Navi Mumbai", "Noida", "Ahmedabad"
];

const COUNTRY_CODES = [
    { code: "+1", label: "+1 (US/CAN)" },
    { code: "+91", label: "+91 (IN)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+61", label: "+61 (AUS)" },
];

interface LeadCaptureFormProps {
    sourceName?: string;
    buttonText?: string;
    title?: string;
}

export default function LeadCaptureForm({
    sourceName = 'Hero Section V2',
    buttonText = 'Secure My Spot ↗',
    title = 'Get Started Today'
}: LeadCaptureFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formState, setFormState] = useState({
        success: false,
        error: ''
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setFormState({ success: false, error: '' })

        const formData = new FormData(e.currentTarget)

        let gclid, source_keyword;
        if (typeof window !== 'undefined') {
            const storedUtms = sessionStorage.getItem('current_utms');
            if (storedUtms) {
                try {
                    const parsed = JSON.parse(storedUtms);
                    gclid = parsed.gclid;
                    source_keyword = parsed.keyword;
                } catch (e) {
                    console.error("Failed to parse stored UTMs", e);
                }
            }
        }

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            countryCode: formData.get('countryCode') as string,
            mobile: formData.get('mobile') as string,
            city: formData.get('city') as string,
            form_source: sourceName,
            session_id: typeof window !== 'undefined' ? sessionStorage.getItem('alabs_session_id') || undefined : undefined,
            gclid: gclid,
            source_keyword: source_keyword,
            page_url: typeof window !== 'undefined' ? window.location.href : undefined
        }

        startTransition(async () => {
            const result = await createLeadAction(data)
            if (result.success) {
                setFormState({ success: true, error: '' })
            } else {
                setFormState({ success: false, error: result.error || 'Failed to submit' })
            }
        })
    }

    return (
        <div className={styles.formContainer} id="lead-capture-module">
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.subtitle}>Fill the form below to connect with our experts.</p>
            </div>

            {formState.success ? (
                <div className={styles.successMessage}>
                    <div className={styles.successIcon}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <p className={styles.successTitle}>Inquiry Received!</p>
                    <p className={styles.successSubtitle}>Our career advisor will contact you within 24 hours.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                    {formState.error && (
                        <div className={styles.errorMessage}>
                            {formState.error}
                        </div>
                    )}

                    <div className={styles.fieldGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            maxLength={50}
                            required
                            className={styles.input}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className={styles.inlineFields}>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="email" className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                maxLength={75}
                                required
                                className={styles.input}
                                placeholder="you@email.com"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="city" className={styles.label}>Current City</label>
                            <select
                                name="city"
                                id="city"
                                required
                                defaultValue=""
                                className={styles.select}
                            >
                                <option value="" disabled>Select City...</option>
                                {INDIA_CITIES.sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label htmlFor="mobile" className={styles.label}>Mobile Number</label>
                        <div className={styles.phoneInput}>
                            <div className={styles.countryCodeColumn}>
                                <select
                                    name="countryCode"
                                    id="countryCode"
                                    defaultValue="+91"
                                    className={styles.selectSmall}
                                    aria-label="Country code"
                                >
                                    {COUNTRY_CODES.map(c => (
                                        <option key={c.code} value={c.code}>{c.code}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.mobileInputColumn}>
                                <input
                                    type="tel"
                                    name="mobile"
                                    id="mobile"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                    className={styles.input}
                                    placeholder="10-digit mobile"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.consentWrapper}>
                        <div className={styles.checkboxContainer}>
                            <input
                                id="consent"
                                name="consent"
                                type="checkbox"
                                required
                                className={styles.checkbox}
                            />
                        </div>
                        <label htmlFor="consent" className={styles.consentLabel}>
                            I agree to the <a href="/privacy-policy" className={styles.link}>Privacy Policy</a> and consent to being contacted by AnalytixLabs.
                            <span className={styles.promise}>No Spam ❤️ We promise.</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={styles.submitButton}
                    >
                        {isPending ? 'Processing...' : buttonText}
                    </button>
                </form>
            )}
        </div>
    )
}
