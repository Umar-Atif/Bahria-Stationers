import schoolImage from '../assets/school-image.avif'
import collegeImage from '../assets/college-image.avif'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    RefreshCw,
} from 'lucide-react'

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000'

const fallbackImages = {
    school: schoolImage,
    college: collegeImage,
}

function Categories() {
    const [institutions, setInstitutions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    async function fetchInstitutions() {
        try {
            setLoading(true)
            setError('')

            const response = await fetch(
                `${API_URL}/api/institutions`
            )
            const result = await response.json()

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || 'Unable to load institutions.'
                )
            }

            setInstitutions(
                Array.isArray(result.data) ? result.data : []
            )
        } catch (err) {
            setError(
                err.message || 'Unable to load institutions.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInstitutions()
    }, [])

    const categories = institutions.map((institution) => {
        const type =
            institution.type?.toLowerCase() === 'college'
                ? 'college'
                : 'school'

        return {
            name: institution.name,
            type: type.toUpperCase(),
            description:
                type === 'college'
                    ? 'Explore academic essentials selected for your college.'
                    : 'Find books and school essentials for every class.',
            image: institution.image || fallbackImages[type],
            path: `/institution/${institution.slug}`,
            icon:
                type === 'college'
                    ? GraduationCap
                    : BookOpen,
        }
    })

    return (
        <main className="min-h-screen bg-[#F5F7FA] text-[#292D32]">

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#DCE3EB] bg-gradient-to-br from-white via-[#F5F7FA] to-[#EAF0F5]">
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#77917A]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-[#203653]/5 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 sm:py-20 lg:px-8 lg:py-24">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
                        Find your institution
                    </p>

                    <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight tracking-tight text-[#203653] sm:text-5xl lg:text-6xl">
                        Your learning,
                        <span className="block italic text-[#526F8F]">
                            your essentials.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#526071] sm:text-base">
                        Select your school or college to find the
                        books and academic essentials you need.
                    </p>

                    <div className="mt-7 inline-flex items-center gap-3 rounded-xl border border-[#DCE3EB] bg-white/80 px-4 py-3 text-sm text-[#526071] shadow-sm">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBF2F7] text-[#203653]">
                            <BookOpen size={19} />
                        </span>

                        <span>
                            {loading
                                ? 'Loading institutions...'
                                : `${institutions.length} ${institutions.length === 1
                                    ? 'institution'
                                    : 'institutions'
                                } available`}
                        </span>
                    </div>
                </div>
            </section>

            {/* Institutions */}
            <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-[#203653] sm:text-3xl">
                        Browse institutions
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-[#526071]">
                        Choose your institution to explore its available
                        classes and products.
                    </p>
                </div>

                {/* Error state */}
                {error && (
                    <div
                        role="alert"
                        className="mt-7 rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700 shadow-sm"
                    >
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchInstitutions}
                            className="mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white"
                            >
                                <div className="h-56 bg-[#E8EDF3]" />

                                <div className="space-y-3 p-5">
                                    <div className="h-3 w-1/3 rounded bg-[#E5EAF0]" />
                                    <div className="h-5 w-2/3 rounded bg-[#E5EAF0]" />
                                    <div className="h-4 w-full rounded bg-[#EBF2F7]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Institution cards */}
                {!loading && !error && categories.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => {
                            const Icon = category.icon

                            return (
                                <Link
                                    to={category.path}
                                    key={category.path}
                                    className="group overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#B8C7BA] hover:shadow-[0_16px_40px_-20px_rgba(32,54,83,0.22)]"
                                >
                                    <div className="relative overflow-hidden bg-[#E8EDF3]">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            loading="lazy"
                                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        <span className="absolute left-4 top-4 rounded-full border border-[#DCE3EB] bg-white/95 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-[#203653]">
                                            {category.type}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                                        <div>
                                            <h3 className="font-serif text-2xl font-bold text-[#203653]">
                                                {category.name}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-[#526071]">
                                                {category.description}
                                            </p>

                                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#203653] transition group-hover:text-[#77917A]">
                                                Explore institution
                                                <ArrowRight
                                                    size={16}
                                                    className="transition-transform group-hover:translate-x-1"
                                                />
                                            </span>
                                        </div>

                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7] text-[#203653] transition group-hover:bg-[#203653] group-hover:text-white">
                                            <Icon size={20} />
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && institutions.length === 0 && (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#C8D2DE] bg-white px-6 py-12 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBF2F7] text-[#203653]">
                            <BookOpen size={30} />
                        </span>

                        <h3 className="mt-4 font-serif text-2xl font-bold text-[#203653]">
                            No institutions available yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526071]">
                            Schools and colleges will appear here once
                            they are added through the admin panel.
                        </p>
                    </div>
                )}
            </section>

            {/* Bottom banner */}
            <section className="px-5 pb-14 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-3xl border border-[#DCE3EB] bg-[#EAF0F5] p-6 sm:flex-row sm:items-center sm:p-9">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77917A]">
                            Your academic journey
                        </p>

                        <h2 className="mt-2 font-serif text-2xl font-bold text-[#203653]">
                            Start with your institution.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#526071]">
                            Select your school or college to find
                            the essentials for your classes.
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#203653] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        Back to home
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default Categories

