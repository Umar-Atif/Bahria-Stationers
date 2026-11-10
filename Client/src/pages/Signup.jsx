import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Eye,
    EyeOff,
    GraduationCap,
    PencilRuler,
    Sparkles,
} from 'lucide-react'

function Signup() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const API_URI =
        import.meta.env.VITE_API_URL || 'http://localhost:5000'

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(
                `${API_URI}/api/auth/signup`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Signup failed')
            }

            navigate('/login', {
                state: { message: 'Account created! Please log in.' },
            })
        } catch (err) {
            setError(err.message || 'Unable to connect to server')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-[calc(100vh-80px)] bg-[#F5F7FA] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-[#DCE3EB] bg-white shadow-[0_24px_80px_-35px_rgba(32,54,83,0.22)] lg:min-h-[680px] lg:grid-cols-2">

                {/* Left branding panel */}
                <section className="relative hidden flex-col justify-between overflow-hidden bg-[#203653] p-10 text-white sm:p-12 lg:flex xl:p-14">
                    <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-12 -top-8 h-60 w-60 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-[#77917A]/20 blur-3xl" />

                    <div className="relative z-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#203653]">
                                <BookOpen size={23} />
                            </span>

                            <span className="text-xl font-black tracking-tight">
                                {/* PAPER<span className="text-[#B9CBB9]">&</span>PEN */}
                                BAHRIA STATIONERS
                            </span>
                        </Link>

                        <div className="mt-20 max-w-md">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8E4D8]">
                                <Sparkles size={14} />
                                Made for curious minds
                            </span>

                            <h1 className="mt-7 font-serif text-4xl font-bold leading-tight xl:text-5xl">
                                Every great idea
                                <span className="mt-2 block italic text-[#B9CBB9]">
                                    starts somewhere.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
                                Create your account and discover books,
                                stationery and everyday essentials for
                                your learning journey.
                            </p>
                        </div>

                        {/* Decorative stationery illustration */}
                        <div className="relative mt-12 flex h-44 items-center justify-center gap-5">
                            <div className="absolute h-36 w-64 rounded-full bg-white/5 blur-2xl" />

                            <div className="relative flex h-32 w-24 -rotate-6 flex-col justify-between rounded-xl border border-[#DCE3EB]/60 bg-[#F5F7FA] p-3 shadow-xl">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 rounded-full bg-[#77917A]" />
                                    <span className="h-2 w-2 rounded-full bg-[#D7DEE7]" />
                                    <span className="h-2 w-2 rounded-full bg-[#D7DEE7]" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-12 rounded-full bg-[#203653]/70" />
                                    <div className="h-1 w-16 rounded-full bg-[#CBD5E1]" />
                                    <div className="h-1 w-12 rounded-full bg-[#CBD5E1]" />
                                    <div className="h-1 w-14 rounded-full bg-[#CBD5E1]" />
                                </div>
                                <PencilRuler
                                    size={20}
                                    className="self-end text-[#77917A]"
                                />
                            </div>

                            <div className="relative flex h-36 w-24 rotate-6 flex-col items-center justify-between rounded-xl border border-white/20 bg-[#77917A] p-3 shadow-xl">
                                <div className="h-1 w-10 rounded-full bg-white/60" />
                                <BookOpen size={40} strokeWidth={1.2} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">
                                    Your next chapter
                                </span>
                            </div>

                            <div className="absolute right-5 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10">
                                <Sparkles size={19} className="text-[#D8E4D8]" />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-xs text-white/55">
                        <span>Your everyday study companion</span>
                        <span>Learn. Create. Grow.</span>
                    </div>
                </section>

                {/* Right signup form */}
                <section className="flex items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
                    <div className="w-full max-w-md">

                        {/* Mobile brand */}
                        <Link
                            to="/"
                            className="mb-9 inline-flex items-center gap-2.5 lg:hidden"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#203653] text-white">
                                <BookOpen size={21} />
                            </span>

                            <span className="text-lg font-black tracking-tight text-[#203653]">
                                {/* PAPER<span className="text-[#77917A]">&</span>PEN */}
                                BAHRIA STATIONERS
                            </span>
                        </Link>

                        <div className="mb-8">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
                                Get started today
                            </p>

                            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#203653] sm:text-4xl">
                                Create your account
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#64748B]">
                                Join BAHRIA STATIONERS and keep your study essentials
                                all in one place.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="mb-7 grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-[#DCE3EB] bg-[#F5F7FA] p-3">
                                <BookOpen
                                    size={19}
                                    className="text-[#203653]"
                                />
                                <p className="mt-2 text-xs font-semibold text-[#203653]">
                                    Study essentials
                                </p>
                            </div>

                            <div className="rounded-xl border border-[#DCE3EB] bg-[#F5F7FA] p-3">
                                <GraduationCap
                                    size={20}
                                    className="text-[#77917A]"
                                />
                                <p className="mt-2 text-xs font-semibold text-[#203653]">
                                    Easy shopping
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-[#334155]"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-[#D5DDE7] bg-white px-4 py-3.5 text-sm text-[#203653] outline-none transition placeholder:text-[#94A3B8] focus:border-[#526F8F] focus:ring-4 focus:ring-[#203653]/5"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-[#334155]"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-[#D5DDE7] bg-white px-4 py-3.5 text-sm text-[#203653] outline-none transition placeholder:text-[#94A3B8] focus:border-[#526F8F] focus:ring-4 focus:ring-[#203653]/5"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-[#334155]"
                                    >
                                        Password
                                    </label>

                                    <span className="text-xs text-[#94A3B8]">
                                        8+ characters
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                        placeholder="Create a strong password"
                                        className="w-full rounded-xl border border-[#D5DDE7] bg-white px-4 py-3.5 text-sm text-[#203653] outline-none transition placeholder:text-[#94A3B8] focus:border-[#526F8F] focus:ring-4 focus:ring-[#203653]/5"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((current) => !current)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-semibold text-[#203653] transition"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#203653] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D496B] focus:outline-none focus:ring-4 focus:ring-[#203653]/15 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                                {!loading && <ArrowRight size={17} />}
                            </button>

                            <p className="flex items-start gap-2 text-xs leading-5 text-[#64748B]">
                                <CheckCircle2
                                    size={16}
                                    className="mt-0.5 shrink-0 text-[#77917A]"
                                />
                                Your account helps you access your shopping
                                experience in one place.
                            </p>
                        </form>

                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-[#E2E8F0]" />
                            <span className="text-xs text-[#94A3B8]">
                                ALREADY A MEMBER?
                            </span>
                            <div className="h-px flex-1 bg-[#E2E8F0]" />
                        </div>

                        <p className="text-center text-sm text-[#64748B]">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-bold text-[#203653] underline-offset-4 hover:text-[#526F8F] hover:underline"
                            >
                                Log in
                            </Link>
                        </p>

                        <p className="mt-8 text-center text-xs text-[#94A3B8]">
                            By creating an account, you can shop school
                            essentials with BAHRIA STATIONERS.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Signup
