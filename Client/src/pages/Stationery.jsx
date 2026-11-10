import { Link, useSearchParams } from 'react-router-dom'
import {
    ArrowRight,
    Pencil,
    Search,
    SlidersHorizontal,
    BookOpen,
    RotateCcw,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Stationery() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [search, setSearch] = useState(searchParams.get('search') || '')
    const [category, setCategory] = useState('All')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        setSearch(searchParams.get('search') || '')
    }, [searchParams])

    useEffect(() => {
        let cancelled = false

        async function fetchProducts() {
            setLoading(true)
            setError('')

            try {
                const response = await fetch(
                    `${API_URL}/api/products?category=Stationery`
                )
                const result = await response.json()

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || 'Products load nahi ho sake.'
                    )
                }

                if (!cancelled) {
                    setProducts(result.data || [])
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || 'Server se connection nahi ho saka.'
                    )
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchProducts()

        return () => {
            cancelled = true
        }
    }, [])

    const categories = [
        'All',
        ...new Set(products.map((product) => product.category)),
    ]

    const filteredProducts = products.filter((product) => {
        const matchesSearch = (product.name || '')
            .toLowerCase()
            .includes(search.trim().toLowerCase())

        const matchesCategory =
            category === 'All' || product.category === category

        return matchesSearch && matchesCategory
    })

    function handleSearch(value) {
        setSearch(value)

        const nextParams = new URLSearchParams(searchParams)

        if (value.trim()) {
            nextParams.set('search', value)
        } else {
            nextParams.delete('search')
        }

        setSearchParams(nextParams, { replace: true })
    }

    function clearFilters() {
        setCategory('All')
        handleSearch('')
    }

    return (
        <main className="min-h-screen bg-[#F5F7FA] text-[#292D32]">

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#203653]/10 bg-gradient-to-br from-white via-[#F5F7FA] to-[#EAF0F5]">
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#77917A]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 left-0 h-64 w-64 rounded-full bg-[#203653]/5 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#203653]/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#203653] shadow-sm">
                            <BookOpen size={15} />
                            The essentials
                        </div>

                        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-[#203653] sm:text-5xl lg:text-6xl">
                            Little tools.
                            <br />
                            <span className="block italic text-[#526F8F]">
                                big ideas.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-[#526071] sm:text-base">
                            Discover stationery for everyday learning,
                            thoughtful writing, and all the ideas waiting
                            to take shape.
                        </p>

                        <a
                            href="#stationery-products"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D496B]"
                        >
                            Explore collection
                            <ArrowRight size={17} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Product collection */}
            <section
                id="stationery-products"
                className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"
            >
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
                            Find your favourites
                        </p>

                        <h2 className="mt-2 font-serif text-3xl font-bold text-[#203653] sm:text-4xl">
                            Stationery collection
                        </h2>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-[#526071]">
                            From everyday writing essentials to creative
                            companions, find what you need for your next idea.
                        </p>
                    </div>

                    <p className="text-sm font-medium text-[#526071]">
                        {loading
                            ? 'Loading products...'
                            : `${filteredProducts.length} ${filteredProducts.length === 1
                                ? 'product'
                                : 'products'
                            } found`}
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#DCE3EB] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="relative w-full sm:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search pens, pencils, colours..."
                            aria-label="Search stationery"
                            className="w-full rounded-xl border border-[#DCE3EB] bg-[#F5F7FA] py-3 pl-11 pr-4 text-sm text-[#292D32] outline-none transition placeholder:text-[#8792A2] focus:border-[#77917A] focus:ring-2 focus:ring-[#77917A]/20"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-[#526071]">
                        <SlidersHorizontal size={15} />
                        Filter by category
                    </div>
                </div>

                {/* Category filters */}
                <div className="mb-8 flex flex-wrap gap-2.5">
                    {categories.map((item) => (
                        <button
                            key={item}
                            onClick={() => setCategory(item)}
                            className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${category === item
                                    ? 'border-[#203653] bg-[#203653] text-white shadow-sm'
                                    : 'border-[#DCE3EB] bg-white text-[#526071] hover:border-[#77917A] hover:bg-[#77917A]/5 hover:text-[#203653]'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-[#EBF2F7]" />
                                <div className="space-y-3 p-4">
                                    <div className="h-3 w-1/3 animate-pulse rounded bg-[#E5EAF0]" />
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-[#E5EAF0]" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#E5EAF0]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    /* Error state */
                    <div className="rounded-2xl border border-red-200 bg-white px-5 py-14 text-center">
                        <BookOpen
                            size={36}
                            strokeWidth={1.5}
                            className="mx-auto text-[#C7795A]"
                        />

                        <h2 className="mt-4 font-serif text-2xl font-bold text-[#203653]">
                            Couldn't load the collection
                        </h2>

                        <p className="mt-2 text-sm text-[#526071]">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                        >
                            <RotateCcw size={15} />
                            Try again
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    /* Empty state */
                    <div className="rounded-3xl border border-[#DCE3EB] bg-white px-5 py-16 text-center shadow-sm sm:py-20">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#77917A]/10 text-[#203653]">
                            <Pencil size={30} strokeWidth={1.4} />
                        </div>

                        <h2 className="mt-5 font-serif text-2xl font-bold text-[#203653]">
                            No products found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526071]">
                            Try a different search or category to find
                            what you are looking for.
                        </p>

                        <button
                            onClick={clearFilters}
                            className="mt-6 rounded-xl border border-[#203653]/20 px-5 py-2.5 text-sm font-semibold text-[#203653] transition hover:bg-[#203653] hover:text-white"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    /* Product grid */
                    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="group overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#B8C7BA] hover:shadow-[0_14px_35px_rgba(32,54,83,0.09)]"
                            >
                                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#EBF2F7]">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            loading="lazy"
                                            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-6"
                                        />
                                    ) : (
                                        <Pencil
                                            size={48}
                                            strokeWidth={1.2}
                                            className="text-[#77917A]"
                                        />
                                    )}

                                    <span className="absolute left-2.5 top-2.5 max-w-[calc(100%-20px)] truncate rounded-full border border-[#DCE3EB] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#203653] sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                                        {product.category || 'Stationery'}
                                    </span>

                                    {product.stock <= 0 && (
                                        <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[#C7795A] px-2.5 py-1 text-[10px] font-semibold text-white sm:bottom-3 sm:left-3 sm:text-xs">
                                            Out of stock
                                        </span>
                                    )}
                                </div>

                                <div className="p-3.5 sm:p-4">
                                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#203653] transition-colors group-hover:text-[#C7795A] sm:text-base">
                                        {product.name}
                                    </h3>

                                    <p className="mt-3 text-base font-bold text-[#203653] sm:text-lg">
                                        Rs.{' '}
                                        {Number(product.price).toLocaleString(
                                            'en-PK'
                                        )}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between border-t border-[#E5EAF0] pt-3">
                                        <span className="text-xs font-semibold text-[#526071] sm:text-sm">
                                            View details
                                        </span>

                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBF2F7] text-[#203653] transition group-hover:bg-[#203653] group-hover:text-white">
                                            <ArrowRight size={15} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Bottom banner */}
            <section className="px-5 pb-12 sm:px-8 sm:pb-16">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#203653] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
                    <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -right-2 -top-12 h-40 w-40 rounded-full border border-white/10" />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C7795A]">
                                Your next great idea starts here
                            </p>

                            <h2 className="mt-3 font-serif text-2xl font-bold text-white sm:text-3xl">
                                Ready for a fresh page?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-white/75">
                                Find your everyday essentials and make room
                                for something wonderful.
                            </p>
                        </div>

                        <Link
                            to="/categories"
                            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#203653] transition hover:bg-[#EBF2F7] sm:self-center"
                        >
                            Browse categories
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Stationery
