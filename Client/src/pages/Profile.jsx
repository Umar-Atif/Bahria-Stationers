import { useCallback, useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import {
    UserRound,
    Mail,
    Phone,
    ShieldCheck,
    Save,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10'

function Profile() {
    const { token } = useAppContext()

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
    })

    const [loading, setLoading] = useState(true)
    const [savingProfile, setSavingProfile] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loadProfile = useCallback(async () => {
        if (!token) {
            setLoading(false)
            setError('Please log in to view your profile.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.status === 401 || response.status === 403) {
                throw new Error('Your session has expired. Please log in again.')
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load profile.')
            }

            setProfile({
                name: data.user?.name || '',
                email: data.user?.email || '',
                phone: data.user?.phone || '',
            })
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        loadProfile()
    }, [loadProfile])

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setSavingProfile(true)

        try {
            const response = await fetch(`${API_URL}/api/users/me`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profile.name.trim(),
                    phone: profile.phone.trim(),
                }),
            })

            const data = await response.json()

            if (response.status === 401 || response.status === 403) {
                throw new Error('Your session has expired. Please log in again.')
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to update profile.')
            }

            if (data.user) {
                setProfile((prev) => ({
                    ...prev,
                    ...data.user,
                }))
            }

            setSuccess(data.message || 'Profile updated successfully.')
        } catch (err) {
            setError(err.message || 'Unable to update profile.')
        } finally {
            setSavingProfile(false)
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F5F7FA] px-5 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#203653]" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading your profile...
                </p>
            </main>
        )
    }

    if (!token && error) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#203653]">
                        <UserRound size={27} />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-[#203653]">
                        Sign in to your account
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Please log in to view and manage your personal information.
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        Go to login
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-[70vh] bg-[#F5F7FA] px-5 py-8 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-3xl bg-[#203653] px-6 py-8 text-white sm:px-10 sm:py-10">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-2 -top-8 h-40 w-40 rounded-full border border-white/10" />

                    <div className="relative flex items-center gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:h-20 sm:w-20">
                            <UserRound size={36} strokeWidth={1.4} />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                Account settings
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                My Profile
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Manage your personal information and account details.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mt-6 flex items-start gap-3 rounded-xl border border-[#D5E3D7] bg-[#EEF4EF] p-4 text-sm text-[#426449]"
                    >
                        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                        <p>{success}</p>
                    </div>
                )}

                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF0EB] text-[#58765D]">
                                <UserRound size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#203653]">
                                    Personal Information
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Update your name and contact number.
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Full Name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="profile-name"
                                        className={`${inputClass} pl-11`}
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter your full name"
                                        maxLength={100}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="profile-email"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="profile-email"
                                        className={`${inputClass} bg-slate-50 pl-11 text-slate-500`}
                                        type="email"
                                        value={profile.email}
                                        readOnly
                                        autoComplete="email"
                                    />
                                </div>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Your email address cannot be changed here.
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="profile-phone"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Phone Number (Optional)
                                </label> 

                                <div className="relative sm:max-w-md">
                                    <Phone
                                        size={18}
                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        id="profile-phone"
                                        className={`${inputClass} pl-11`}
                                        type="tel"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter your phone number"
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                                <ShieldCheck
                                    size={17}
                                    className="mt-0.5 shrink-0 text-[#77917A]"
                                />
                                <p>
                                    Your account information is managed securely.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203653] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2D496B] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={17} />
                                {savingProfile ? 'Saving changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </section>

                <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                    Need to update your delivery details? You can manage your address during checkout.
                </p>
            </div>
        </main>
    )
}

export default Profile
