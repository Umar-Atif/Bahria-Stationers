import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Notebook,
    GraduationCap,
    PackageCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ProductCard({ product }) {
    const inStock = product.stock > 0

    return (
        <Link
            to={`/product/${product._id}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5 transition duration-300 hover:-translate-y-1 hover:border-[#77917A]/60 hover:shadow-xl hover:shadow-slate-200/60 sm:p-4"
        >
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-[#EBF2F7] text-[#203653]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <Notebook size={42} strokeWidth={1.3} />
                )}
            </div>

            <div className="mt-4 flex-1">
                <p className="text-xs font-medium text-slate-500">
                    {product.category}
                </p>

                <h3 className="mt-1.5 line-clamp-2 font-semibold leading-snug text-[#203653] transition group-hover:text-[#77917A]">
                    {product.name}
                </h3>

                <p className="mt-3 text-lg font-bold text-[#203653]">
                    Rs. {Number(product.price).toLocaleString('en-PK')}
                </p>

                <p
                    className={`mt-2 inline-flex items-center gap-1.5 text-xs font-medium ${inStock ? 'text-[#58765D]' : 'text-red-600'
                        }`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-[#77917A]' : 'bg-red-500'
                            }`}
                    />
                    {inStock ? `${product.stock} in stock` : 'Out of stock'}
                </p>
            </div>

            <span className="mt-4 inline-flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-[#203653] transition group-hover:text-[#77917A]">
                View product
                <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                />
            </span>
        </Link>
    )
}

function ProductSection({ title, subtitle, products, icon }) {
    const Icon = icon

    return (
        <section className="mt-12 sm:mt-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF0EB] text-[#58765D]">
                        <Icon size={23} strokeWidth={1.7} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-[#203653] sm:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {subtitle}
                        </p>
                    </div>
                </div>

                <span className="text-sm font-medium text-slate-500">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {products.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F7FA] text-[#203653]">
                        <PackageCheck size={23} />
                    </div>
                    <h3 className="mt-4 font-semibold text-[#203653]">
                        Nothing here yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        No {title.toLowerCase()} are available for this class yet.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}

function ClassPage() {
    const { institutionId, classId } = useParams()

    const [institution, setInstitution] = useState(null)
    const [currentClass, setCurrentClass] = useState(null)
    const [books, setBooks] = useState([])
    const [copies, setCopies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function loadClassProducts() {
            setLoading(true)
            setError('')
            setInstitution(null)
            setCurrentClass(null)
            setBooks([])
            setCopies([])

            try {
                const institutionResponse = await fetch(
                    `${API_URL}/api/institutions`
                )
                const institutionResult = await institutionResponse.json()

                if (!institutionResponse.ok || !institutionResult.success) {
                    throw new Error(
                        institutionResult.message ||
                        'Institutions load nahi ho sake.'
                    )
                }

                const foundInstitution = (institutionResult.data || []).find(
                    (item) => item.slug === institutionId
                )

                if (!foundInstitution) {
                    throw new Error('Institution not found.')
                }

                const classesResponse = await fetch(
                    `${API_URL}/api/classes/institution/${foundInstitution._id}`
                )
                const classesResult = await classesResponse.json()

                if (!classesResponse.ok || !classesResult.success) {
                    throw new Error(
                        classesResult.message ||
                        'Classes load nahi ho sakin.'
                    )
                }

                const foundClass = (classesResult.data || []).find(
                    (item) => item.slug === classId
                )

                if (!foundClass) {
                    throw new Error('Class not found.')
                }

                const query = new URLSearchParams({
                    institutionId: foundInstitution._id,
                    classId: foundClass._id,
                })

                const [booksResponse, copiesResponse] = await Promise.all([
                    fetch(`${API_URL}/api/products?category=Books&${query}`),
                    fetch(`${API_URL}/api/products?category=Copies&${query}`),
                ])

                const [booksResult, copiesResult] = await Promise.all([
                    booksResponse.json(),
                    copiesResponse.json(),
                ])

                if (!booksResponse.ok || !booksResult.success) {
                    throw new Error(
                        booksResult.message || 'Books load nahi ho sakin.'
                    )
                }

                if (!copiesResponse.ok || !copiesResult.success) {
                    throw new Error(
                        copiesResult.message || 'Copies load nahi ho sakin.'
                    )
                }

                if (!cancelled) {
                    setInstitution(foundInstitution)
                    setCurrentClass(foundClass)
                    setBooks(booksResult.data || [])
                    setCopies(copiesResult.data || [])
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Products load nahi ho sake.')
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        loadClassProducts()

        return () => {
            cancelled = true
        }
    }, [institutionId, classId])

    if (loading) {
        return (
            <div className="min-h-[55vh] bg-[#F5F7FA] px-5 py-24 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#203653]" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading class products...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-[#203653]">
                        <BookOpen size={26} />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-[#203653]">
                        Unable to load class
                    </h1>
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#F5F7FA]">
            <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10 lg:px-8 lg:py-12">
                <Link
                    to={`/institution/${institution.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-500 transition hover:text-[#203653]"
                >
                    <ArrowLeft size={16} />
                    Back to classes
                </Link>

                <div className="relative mt-6 overflow-hidden rounded-3xl bg-[#203653] px-6 py-8 text-white sm:px-10 sm:py-10">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-3 -top-7 h-40 w-40 rounded-full border border-white/10" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-100">
                                <GraduationCap size={15} />
                                {institution.name}
                            </div>

                            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                                {currentClass.name}
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                Find the books, copies, registers and study essentials you need for your class.
                            </p>
                        </div>

                        <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:flex">
                            <BookOpen size={42} strokeWidth={1.2} />
                        </div>
                    </div>
                </div>

                <ProductSection
                    title="Books"
                    subtitle="Textbooks and reading material for your class"
                    products={books}
                    icon={BookOpen}
                />

                <div className="mt-14 border-t border-slate-200 pt-1">
                    <ProductSection
                        title="Copies & Registers"
                        subtitle="Copies, registers, diaries and more"
                        products={copies}
                        icon={Notebook}
                    />
                </div>

                <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
                    <div>
                        <h2 className="text-lg font-bold text-[#203653]">
                            Looking for more stationery?
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Explore everyday school and study essentials in one place.
                        </p>
                    </div>

                    <Link
                        to="/stationery"
                        className="mt-5 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B] sm:mt-0"
                    >
                        Browse stationery
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </main>
    )
}

export default ClassPage
