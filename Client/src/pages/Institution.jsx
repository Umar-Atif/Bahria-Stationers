import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    GraduationCap,
    RefreshCw,
    School,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Institution() {
    const { institutionId } = useParams()

    const [institution, setInstitution] = useState(null)
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function loadInstitution() {
            setLoading(true)
            setError('')

            try {
                const response = await fetch(
                    `${API_URL}/api/institutions`
                )
                const result = await response.json()

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || 'Unable to load institutions.'
                    )
                }

                const found = (result.data || []).find(
                    (item) => item.slug === institutionId
                )

                if (!found) {
                    if (!cancelled) {
                        setInstitution(null)
                        setClasses([])
                    }
                    return
                }

                const classResponse = await fetch(
                    `${API_URL}/api/classes/institution/${found._id}`
                )
                const classResult = await classResponse.json()

                if (!classResponse.ok || !classResult.success) {
                    throw new Error(
                        classResult.message || 'Unable to load classes.'
                    )
                }

                if (!cancelled) {
                    setInstitution(found)
                    setClasses(
                        Array.isArray(classResult.data)
                            ? classResult.data
                            : []
                    )
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || 'Unable to connect to the server.'
                    )
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadInstitution()

        return () => {
            cancelled = true
        }
    }, [institutionId])

    if (loading) {
        return (
            <main className="min-h-[65vh] bg-[#F5F7FA] px-5 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-4 w-36 rounded bg-[#DCE3EB]" />
                        <div className="mt-8 h-56 rounded-3xl bg-[#E7ECF2]" />
                        <div className="mt-10 h-7 w-56 rounded bg-[#DCE3EB]" />
                        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-36 rounded-2xl bg-white"
                                />
                            ))}
                        </div>
                    </div>
                    <p className="mt-6 text-center text-sm text-[#64748B]">
                        Loading institution...
                    </p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="w-full max-w-lg rounded-3xl border border-[#DCE3EB] bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                        <RefreshCw size={25} />
                    </div>
                    <h1 className="mt-5 text-xl font-bold text-[#203653]">
                        Couldn't load this page
                    </h1>
                    <p role="alert" className="mt-2 text-sm leading-6 text-[#64748B]">
                        {error}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </div>
            </main>
        )
    }

    if (!institution) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7ECF2] text-[#203653]">
                        <School size={30} />
                    </div>
                    <h1 className="mt-5 text-2xl font-bold text-[#203653]">
                        Institution not found
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">
                        This institution may no longer be available.
                    </p>
                    <Link
                        to="/categories"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        <ArrowLeft size={16} />
                        Browse institutions
                    </Link>
                </div>
            </main>
        )
    }

    const institutionType =
        institution.type?.toLowerCase() === 'college'
            ? 'College'
            : 'School'

    return (
        <main className="min-h-screen bg-[#F5F7FA] text-[#203653]">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8">
                {/* Breadcrumb */}
                <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#64748B] transition hover:text-[#203653]"
                >
                    <ArrowLeft size={17} />
                    Back to institutions
                </Link>

                {/* Institution hero */}
                <section className="relative mt-7 overflow-hidden rounded-3xl bg-[#203653] shadow-[0_20px_55px_-30px_rgba(32,54,83,0.45)]">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#77917A]/20 blur-3xl" />

                    <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-14">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8E4D8]">
                                <GraduationCap size={15} />
                                {institutionType} essentials
                            </span>

                            <h1 className="mt-6 max-w-2xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                                {institution.name}
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                                Find the books, copies and study essentials
                                you need. Choose your class to get started.
                            </p>

                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
                                    <BookOpen size={17} className="text-[#B9CBB9]" />
                                    {classes.length} {classes.length === 1 ? 'class' : 'classes'} available
                                </span>
                            </div>
                        </div>

                        <div className="hidden h-36 w-36 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 text-[#D8E4D8] lg:flex">
                            {institution.image ? (
                                <img
                                    src={institution.image}
                                    alt={institution.name}
                                    className="h-full w-full rounded-[2rem] object-cover"
                                />
                            ) : (
                                <GraduationCap size={68} strokeWidth={1.1} />
                            )}
                        </div>
                    </div>
                </section>

                {/* Classes */}
                <section className="py-12 sm:py-16">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#77917A]">
                                Find your level
                            </p>
                            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                                Choose your class
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#64748B]">
                                Select a class to explore its available products.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#64748B]">
                            <BookOpen size={17} className="text-[#77917A]" />
                            Browse by class
                        </div>
                    </div>

                    {classes.length === 0 ? (
                        <div className="mt-8 rounded-2xl border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7ECF2] text-[#203653]">
                                <BookOpen size={27} />
                            </div>
                            <h3 className="mt-4 font-serif text-xl font-bold">
                                No classes available yet
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">
                                Classes for this institution will appear here
                                when they become available.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {classes.map((item, index) => (
                                <Link
                                    key={item._id}
                                    to={`/institution/${institution.slug}/class/${item.slug}`}
                                    className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#77917A] hover:shadow-[0_18px_35px_-22px_rgba(32,54,83,0.3)] sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0EA] text-[#46634D] transition group-hover:bg-[#203653] group-hover:text-white">
                                            <BookOpen size={20} />
                                        </span>
                                        <span className="text-xs font-semibold tracking-wider text-[#94A3B8]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-base font-bold leading-snug text-[#203653] sm:text-lg">
                                            {item.name}
                                        </h3>
                                        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#64748B] transition group-hover:text-[#203653]">
                                            <span>Explore class</span>
                                            <ArrowRight
                                                size={17}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Bottom note */}
                <section className="rounded-2xl border border-[#DCE3EB] bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
                    <div>
                        <h2 className="font-serif text-xl font-bold">
                            Ready to get started?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#64748B]">
                            Choose your class and find the essentials for your studies.
                        </p>
                    </div>

                    <Link
                        to="/stationery"
                        className="mt-5 inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-[#D5DDE7] bg-[#F5F7FA] px-5 py-3 text-sm font-semibold text-[#203653] transition hover:border-[#203653] hover:bg-[#E7ECF2] sm:mt-0"
                    >
                        Browse stationery
                        <ArrowRight size={16} />
                    </Link>
                </section>
            </div>
        </main>
    )
}

export default Institution
