// import heroImage from '../assets/hero-image3.jfif'
// // import heroImage from '../assets/hero-image2.jfif'
// // import heroImage from '../assets/hero-image.png'
// import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import {
//     ArrowRight,
//     BookOpen,
//     GraduationCap,
//     Mail,
//     Package,
//     PencilRuler,
//     Send,
//     ShieldCheck,
//     Sparkles,
// } from 'lucide-react'

// const API_URL =
//     import.meta.env.VITE_API_URL || 'http://localhost:5000'

// function Home() {
//     const [products, setProducts] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState('')
//     const [email, setEmail] = useState('')
//     const [newsletterMessage, setNewsletterMessage] = useState('')

//     useEffect(() => {
//         let cancelled = false

//         async function fetchProducts() {
//             try {
//                 setLoading(true)
//                 setError('')

//                 const response = await fetch(
//                     `${API_URL}/api/products?category=Stationery`
//                 )
//                 const result = await response.json()

//                 if (!response.ok || result.success === false) {
//                     throw new Error(
//                         result.message || 'Unable to load products.'
//                     )
//                 }

//                 if (!cancelled) {
//                     const activeProducts = Array.isArray(result.data)
//                         ? result.data.filter(
//                             (product) =>
//                                 product.isActive !== false &&
//                                 Number(product.stock) > 0
//                         )
//                         : []

//                     setProducts(activeProducts.slice(0, 4))
//                 }
//             } catch (err) {
//                 if (!cancelled) {
//                     setError(
//                         err.message || 'Unable to load products.'
//                     )
//                 }
//             } finally {
//                 if (!cancelled) setLoading(false)
//             }
//         }

//         fetchProducts()

//         return () => {
//             cancelled = true
//         }
//     }, [])

//     function handleNewsletterSubmit(event) {
//         event.preventDefault()
//         setNewsletterMessage(
//             'Thanks for your interest! Newsletter subscriptions will be available soon.'
//         )
//         setEmail('')
//     }

//     return (
//         <main className="overflow-hidden bg-[#F5F7FA] text-[#292D32]">

//             {/* Hero */}
//             <section className="relative overflow-hidden border-b border-[#DCE3EB] bg-gradient-to-br from-white via-[#F5F7FA] to-[#EAF0F5]">
//                 <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-[#77917A]/10 blur-3xl" />
//                 <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-[#203653]/5 blur-3xl" />

//                 <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
//                     <div className="relative z-10">
//                         <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE3EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#203653] shadow-sm">
//                             <Sparkles size={15} className="text-[#77917A]" />
//                             Made for curious minds
//                         </div>

//                         <h1 className="mt-7 font-serif text-5xl font-bold leading-[1.08] tracking-tight text-[#203653] sm:text-6xl lg:text-7xl">
//                             Good ideas
//                             <span className="mt-2 block italic text-[#526F8F]">
//                                 start on paper.
//                             </span>
//                         </h1>

//                         <p className="mt-6 max-w-lg text-base leading-8 text-[#526071] sm:text-lg">
//                             From school books to your everyday stationery,
//                             find the little essentials that make learning
//                             feel a little more inspiring.
//                         </p>

//                         <div className="mt-8 flex flex-wrap gap-3">
//                             <Link
//                                 to="/categories"
//                                 className="inline-flex items-center gap-2 rounded-xl bg-[#203653] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D496B]"
//                             >
//                                 Explore categories
//                                 <ArrowRight size={17} />
//                             </Link>

//                             <Link
//                                 to="/stationery"
//                                 className="inline-flex items-center gap-2 rounded-xl border border-[#DCE3EB] bg-white px-6 py-3.5 text-sm font-semibold text-[#203653] transition hover:border-[#77917A] hover:bg-[#EBF2F7]"
//                             >
//                                 Shop stationery
//                             </Link>
//                         </div>

//                         <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 text-sm text-[#526071]">
//                             <span className="flex items-center gap-2">
//                                 <BookOpen
//                                     size={18}
//                                     className="text-[#77917A]"
//                                 />
//                                 School essentials
//                             </span>

//                             <span className="flex items-center gap-2">
//                                 <PencilRuler
//                                     size={18}
//                                     className="text-[#77917A]"
//                                 />
//                                 Everyday stationery
//                             </span>
//                         </div>
//                     </div>

//                     {/* Hero image */}
//                     <div className="relative mx-auto w-full max-w-xl">
//                         <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-[#77917A]/15 blur-3xl" />
//                         <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[#203653]/10 blur-3xl" />

//                         <div className="relative rounded-[2rem] border border-white bg-white p-3 shadow-[0_25px_70px_-25px_rgba(32,54,83,0.2)]">
//                             <img
//                                 src={heroImage}
//                                 alt="Books, notebooks and study materials arranged on a desk"
//                                 className="h-[330px] w-full rounded-[1.5rem] bg-[#EBF2F7] object-cover sm:h-[430px] lg:h-[490px]"
//                             />

//                             <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-[#DCE3EB] bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-9 sm:left-9 sm:right-9 sm:p-5">
//                                 <div className="flex items-center gap-4">
//                                     <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7] text-[#203653]">
//                                         <GraduationCap size={25} />
//                                     </div>

//                                     <div>
//                                         <p className="font-serif text-lg font-bold text-[#203653]">
//                                             Your next chapter awaits.
//                                         </p>
//                                         <p className="mt-1 text-xs text-[#526071] sm:text-sm">
//                                             Everything you need to get started.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Trust strip */}
//             <section className="border-b border-[#DCE3EB] bg-white">
//                 <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:grid-cols-3 lg:px-8">
//                     <div className="flex items-center gap-3">
//                         <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7]">
//                             <BookOpen className="text-[#203653]" size={21} />
//                         </span>
//                         <div>
//                             <p className="text-sm font-semibold text-[#203653]">
//                                 Study essentials
//                             </p>
//                             <p className="mt-0.5 text-xs text-[#718096]">
//                                 For school and everyday learning
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3EE]">
//                             <Package className="text-[#77917A]" size={21} />
//                         </span>
//                         <div>
//                             <p className="text-sm font-semibold text-[#203653]">
//                                 Curated selection
//                             </p>
//                             <p className="mt-0.5 text-xs text-[#718096]">
//                                 Books, copies and stationery
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7]">
//                             <ShieldCheck className="text-[#203653]" size={21} />
//                         </span>
//                         <div>
//                             <p className="text-sm font-semibold text-[#203653]">
//                                 Simple shopping
//                             </p>
//                             <p className="mt-0.5 text-xs text-[#718096]">
//                                 Find your essentials in one place
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured products */}
//             <section className="bg-[#F5F7FA] py-16 sm:py-20">
//                 <div className="mx-auto max-w-7xl px-5 lg:px-8">
//                     <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
//                         <div>
//                             <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
//                                 A few desk favourites
//                             </p>

//                             <h2 className="mt-3 font-serif text-3xl font-bold text-[#203653] sm:text-4xl">
//                                 Stationery picks
//                             </h2>

//                             <p className="mt-3 max-w-lg text-sm leading-7 text-[#526071] sm:text-base">
//                                 The everyday essentials for notes, plans
//                                 and your next big idea.
//                             </p>
//                         </div>

//                         <Link
//                             to="/stationery"
//                             className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#203653] transition hover:text-[#77917A]"
//                         >
//                             View all stationery
//                             <ArrowRight size={17} />
//                         </Link>
//                     </div>

//                     {error && (
//                         <div
//                             role="alert"
//                             className="mt-8 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700"
//                         >
//                             {error}
//                         </div>
//                     )}

//                     {loading ? (
//                         <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
//                             {[1, 2, 3, 4].map((item) => (
//                                 <div
//                                     key={item}
//                                     className="animate-pulse overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white"
//                                 >
//                                     <div className="aspect-[4/4.2] bg-[#E8EDF3]" />
//                                     <div className="space-y-3 p-4">
//                                         <div className="h-3 w-1/3 rounded bg-[#E5EAF0]" />
//                                         <div className="h-4 w-3/4 rounded bg-[#E5EAF0]" />
//                                         <div className="h-4 w-1/4 rounded bg-[#E5EAF0]" />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : products.length > 0 ? (
//                         <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
//                             {products.map((product) => (
//                                 <Link
//                                     to={`/product/${product._id}`}
//                                     key={product._id}
//                                     className="group overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#B8C7BA] hover:shadow-[0_16px_40px_-20px_rgba(32,54,83,0.2)]"
//                                 >
//                                     <div className="relative overflow-hidden bg-[#EBF2F7]">
//                                         {product.image ? (
//                                             <img
//                                                 src={product.image}
//                                                 alt={product.name}
//                                                 loading="lazy"
//                                                 className="aspect-[4/4.2] w-full object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-6"
//                                             />
//                                         ) : (
//                                             <div className="flex aspect-[4/4.2] w-full items-center justify-center">
//                                                 <PencilRuler
//                                                     size={80}
//                                                     strokeWidth={1.1}
//                                                     className="text-[#203653]"
//                                                 />
//                                             </div>
//                                         )}

//                                         <span className="absolute left-3 top-3 rounded-full border border-[#DCE3EB] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#203653]">
//                                             {product.category || 'Stationery'}
//                                         </span>
//                                     </div>

//                                     <div className="p-4 sm:p-5">
//                                         <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#203653] sm:text-base">
//                                             {product.name}
//                                         </h3>

//                                         <div className="mt-4 flex items-center justify-between gap-2">
//                                             <p className="font-bold text-[#203653]">
//                                                 Rs.{' '}
//                                                 {Number(product.price).toLocaleString('en-PK')}
//                                             </p>

//                                             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF2F7] text-[#203653] transition group-hover:bg-[#203653] group-hover:text-white">
//                                                 <ArrowRight size={16} />
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </Link>
//                             ))}
//                         </div>
//                     ) : (
//                         !error && (
//                             <div className="mt-9 rounded-2xl border border-dashed border-[#C8D2DE] bg-white px-5 py-12 text-center">
//                                 <Package
//                                     size={30}
//                                     className="mx-auto text-[#77917A]"
//                                 />
//                                 <h3 className="mt-4 font-serif text-xl font-bold text-[#203653]">
//                                     Your desk essentials are on their way
//                                 </h3>
//                                 <p className="mt-2 text-sm text-[#526071]">
//                                     There are no stationery products available right now.
//                                 </p>
//                                 <Link
//                                     to="/stationery"
//                                     className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#203653] transition hover:text-[#77917A]"
//                                 >
//                                     Visit stationery
//                                     <ArrowRight size={16} />
//                                 </Link>
//                             </div>
//                         )
//                     )}
//                 </div>
//             </section>

//             {/* Newsletter */}
//             <section className="bg-white px-5 py-12 sm:py-16 lg:px-8">
//                 <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#DCE3EB] bg-[#203653]">
//                     <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-14 lg:py-16">
//                         <div>
//                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B9CBB9]">
//                                 <Mail size={23} />
//                             </div>

//                             <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#B9CBB9]">
//                                 Notes from BAHRIA STATIONERS
//                             </p>

//                             <h2 className="mt-3 max-w-lg font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
//                                 A little inspiration for your inbox.
//                             </h2>

//                             <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
//                                 Get updates about stationery, study essentials
//                                 and new arrivals.
//                             </p>
//                         </div>

//                         <div>
//                             <form
//                                 onSubmit={handleNewsletterSubmit}
//                                 className="flex flex-col gap-3 sm:flex-row"
//                             >
//                                 <label
//                                     htmlFor="newsletter-email"
//                                     className="sr-only"
//                                 >
//                                     Email address
//                                 </label>

//                                 <input
//                                     id="newsletter-email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(event) => {
//                                         setEmail(event.target.value)
//                                         setNewsletterMessage('')
//                                     }}
//                                     placeholder="Enter your email address"
//                                     required
//                                     className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-[#B9CBB9] focus:ring-2 focus:ring-[#B9CBB9]/20"
//                                 />

//                                 <button
//                                     type="submit"
//                                     className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7795A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B96B4D]"
//                                 >
//                                     Subscribe
//                                     <Send size={16} />
//                                 </button>
//                             </form>

//                             {newsletterMessage ? (
//                                 <p
//                                     role="status"
//                                     className="mt-4 text-sm leading-6 text-[#D8E4D8]"
//                                 >
//                                     {newsletterMessage}
//                                 </p>
//                             ) : (
//                                 <p className="mt-4 text-xs leading-5 text-white/55">
//                                     Newsletter subscriptions are not active yet.
//                                     Your email will not be saved.
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </section>

//         </main>
//     )
// }

// export default Home

import heroImage from '../assets/hero-image3.jfif'
// import heroImage from '../assets/hero-image2.jfif'
// import heroImage from '../assets/hero-image.png'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Mail,
    Package,
    PencilRuler,
    Send,
    ShieldCheck,
    Sparkles,
    School,
} from 'lucide-react'

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Home() {
    const [products, setProducts] = useState([])
    const [institutions, setInstitutions] = useState([])
    const [institutionsLoading, setInstitutionsLoading] = useState(true)
    const [institutionsError, setInstitutionsError] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [newsletterMessage, setNewsletterMessage] = useState('')

    useEffect(() => {
        let cancelled = false

        async function fetchProducts() {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(
                    `${API_URL}/api/products?category=Stationery`
                )
                const result = await response.json()

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || 'Unable to load products.'
                    )
                }

                if (!cancelled) {
                    const activeProducts = Array.isArray(result.data)
                        ? result.data.filter(
                            (product) =>
                                product.isActive !== false &&
                                Number(product.stock) > 0
                        )
                        : []

                    setProducts(activeProducts.slice(0, 4))
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message || 'Unable to load products.'
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

    useEffect(() => {
        let cancelled = false

        async function fetchInstitutions() {
            try {
                setInstitutionsLoading(true)
                setInstitutionsError('')

                const response = await fetch(`${API_URL}/api/institutions`)
                const result = await response.json()

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || 'Unable to load institutions.')
                }

                if (!cancelled) {
                    setInstitutions(
                        Array.isArray(result.data)
                            ? result.data.filter((institution) => institution.isActive !== false)
                            : []
                    )
                }
            } catch (err) {
                if (!cancelled) {
                    setInstitutionsError(err.message || 'Unable to load institutions.')
                }
            } finally {
                if (!cancelled) setInstitutionsLoading(false)
            }
        }

        fetchInstitutions()

        return () => {
            cancelled = true
        }
    }, [])

    function handleNewsletterSubmit(event) {
        event.preventDefault()
        setNewsletterMessage(
            'Thanks for your interest! Newsletter subscriptions will be available soon.'
        )
        setEmail('')
    }

    return (
        <main className="overflow-hidden bg-[#F5F7FA] text-[#292D32]">

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-[#DCE3EB] bg-gradient-to-br from-white via-[#F5F7FA] to-[#EAF0F5]">
                <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-[#77917A]/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-[#203653]/5 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE3EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#203653] shadow-sm">
                            <Sparkles size={15} className="text-[#77917A]" />
                            Made for curious minds
                        </div>

                        <h1 className="mt-7 font-serif text-5xl font-bold leading-[1.08] tracking-tight text-[#203653] sm:text-6xl lg:text-7xl">
                            Good ideas
                            <span className="mt-2 block italic text-[#526F8F]">
                                start on paper.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-base leading-8 text-[#526071] sm:text-lg">
                            From school books to your everyday stationery,
                            find the little essentials that make learning
                            feel a little more inspiring.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                to="/categories"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#203653] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2D496B]"
                            >
                                Explore categories
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/stationery"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#DCE3EB] bg-white px-6 py-3.5 text-sm font-semibold text-[#203653] transition hover:border-[#77917A] hover:bg-[#EBF2F7]"
                            >
                                Shop stationery
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 text-sm text-[#526071]">
                            <span className="flex items-center gap-2">
                                <BookOpen
                                    size={18}
                                    className="text-[#77917A]"
                                />
                                School essentials
                            </span>

                            <span className="flex items-center gap-2">
                                <PencilRuler
                                    size={18}
                                    className="text-[#77917A]"
                                />
                                Everyday stationery
                            </span>
                        </div>
                    </div>

                    {/* Hero image */}
                    <div className="relative mx-auto w-full max-w-xl">
                        <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-[#77917A]/15 blur-3xl" />
                        <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-[#203653]/10 blur-3xl" />

                        <div className="relative rounded-[2rem] border border-white bg-white p-3 shadow-[0_25px_70px_-25px_rgba(32,54,83,0.2)]">
                            <img
                                src={heroImage}
                                alt="Books, notebooks and study materials arranged on a desk"
                                className="h-[330px] w-full rounded-[1.5rem] bg-[#EBF2F7] object-cover sm:h-[430px] lg:h-[490px]"
                            />

                            <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-[#DCE3EB] bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-9 sm:left-9 sm:right-9 sm:p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7] text-[#203653]">
                                        <GraduationCap size={25} />
                                    </div>

                                    <div>
                                        <p className="font-serif text-lg font-bold text-[#203653]">
                                            Your next chapter awaits.
                                        </p>
                                        <p className="mt-1 text-xs text-[#526071] sm:text-sm">
                                            Everything you need to get started.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section className="border-b border-[#DCE3EB] bg-white">
                <div className="mx-auto grid max-w-7xl gap-5 px-5 py-7 sm:grid-cols-3 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7]">
                            <BookOpen className="text-[#203653]" size={21} />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-[#203653]">
                                Study essentials
                            </p>
                            <p className="mt-0.5 text-xs text-[#718096]">
                                For school and everyday learning
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF3EE]">
                            <Package className="text-[#77917A]" size={21} />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-[#203653]">
                                Curated selection
                            </p>
                            <p className="mt-0.5 text-xs text-[#718096]">
                                Books, copies and stationery
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBF2F7]">
                            <ShieldCheck className="text-[#203653]" size={21} />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-[#203653]">
                                Simple shopping
                            </p>
                            <p className="mt-0.5 text-xs text-[#718096]">
                                Find your essentials in one place
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutions */}
            <section className="bg-white py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
                                Find your institution
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-[#203653] sm:text-4xl">
                                Shop by institution
                            </h2>
                            <p className="mt-3 max-w-lg text-sm leading-7 text-[#526071] sm:text-base">
                                Choose your school or college, then select your class
                                to explore the books and copies you need.
                            </p>
                        </div>

                        <Link
                            to="/categories"
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#203653] transition hover:text-[#77917A]"
                        >
                            View all institutions
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {institutionsError ? (
                        <div role="alert" className="mt-8 rounded-xl border border-red-200 bg-[#F5F7FA] p-4 text-sm text-red-700">
                            {institutionsError}
                        </div>
                    ) : institutionsLoading ? (
                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="animate-pulse overflow-hidden rounded-2xl border border-[#DCE3EB] bg-[#F5F7FA] p-5">
                                    <div className="h-10 w-10 rounded-xl bg-[#E5EAF0]" />
                                    <div className="mt-8 h-4 w-3/4 rounded bg-[#E5EAF0]" />
                                    <div className="mt-4 h-3 w-1/2 rounded bg-[#E5EAF0]" />
                                </div>
                            ))}
                        </div>
                    ) : institutions.length > 0 ? (
                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {institutions.slice(0, 5).map((institution, index) => (
                                <Link
                                    key={institution._id}
                                    to={`/institution/${institution.slug}`}
                                    className="group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-[#DCE3EB] bg-[#F5F7FA] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#77917A] hover:bg-white hover:shadow-[0_18px_35px_-22px_rgba(32,54,83,0.3)] sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#EAF0EA] text-[#46634D] transition group-hover:bg-[#203653] group-hover:text-white">
                                            {institution.image ? (
                                                <img
                                                    src={institution.image}
                                                    alt={institution.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <School size={21} />
                                            )}
                                        </span>
                                        <span className="text-xs font-semibold tracking-wider text-[#94A3B8]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    <div className="mt-7">
                                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#203653] sm:text-lg">
                                            {institution.name}
                                        </h3>
                                        <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[#64748B] transition group-hover:text-[#203653]">
                                            <span>{institution.type || 'Institution'}</span>
                                            <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-2xl border border-dashed border-[#C8D2DE] bg-[#F5F7FA] px-5 py-12 text-center">
                            <GraduationCap size={30} className="mx-auto text-[#77917A]" />
                            <h3 className="mt-4 font-serif text-xl font-bold text-[#203653]">
                                Institutions will appear here
                            </h3>
                            <p className="mt-2 text-sm text-[#526071]">
                                There are no institutions available right now.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured products */}
            <section className="bg-[#F5F7FA] py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-5 lg:px-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#77917A]">
                                A few desk favourites
                            </p>

                            <h2 className="mt-3 font-serif text-3xl font-bold text-[#203653] sm:text-4xl">
                                Stationery picks
                            </h2>

                            <p className="mt-3 max-w-lg text-sm leading-7 text-[#526071] sm:text-base">
                                The everyday essentials for notes, plans
                                and your next big idea.
                            </p>
                        </div>

                        <Link
                            to="/stationery"
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#203653] transition hover:text-[#77917A]"
                        >
                            View all stationery
                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-8 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white"
                                >
                                    <div className="aspect-[4/4.2] bg-[#E8EDF3]" />
                                    <div className="space-y-3 p-4">
                                        <div className="h-3 w-1/3 rounded bg-[#E5EAF0]" />
                                        <div className="h-4 w-3/4 rounded bg-[#E5EAF0]" />
                                        <div className="h-4 w-1/4 rounded bg-[#E5EAF0]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {products.map((product) => (
                                <Link
                                    to={`/product/${product._id}`}
                                    key={product._id}
                                    className="group overflow-hidden rounded-2xl border border-[#DCE3EB] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#B8C7BA] hover:shadow-[0_16px_40px_-20px_rgba(32,54,83,0.2)]"
                                >
                                    <div className="relative overflow-hidden bg-[#EBF2F7]">
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                loading="lazy"
                                                className="aspect-[4/4.2] w-full object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-6"
                                            />
                                        ) : (
                                            <div className="flex aspect-[4/4.2] w-full items-center justify-center">
                                                <PencilRuler
                                                    size={80}
                                                    strokeWidth={1.1}
                                                    className="text-[#203653]"
                                                />
                                            </div>
                                        )}

                                        <span className="absolute left-3 top-3 rounded-full border border-[#DCE3EB] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#203653]">
                                            {product.category || 'Stationery'}
                                        </span>
                                    </div>

                                    <div className="p-4 sm:p-5">
                                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#203653] sm:text-base">
                                            {product.name}
                                        </h3>

                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            <p className="font-bold text-[#203653]">
                                                Rs.{' '}
                                                {Number(product.price).toLocaleString('en-PK')}
                                            </p>

                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF2F7] text-[#203653] transition group-hover:bg-[#203653] group-hover:text-white">
                                                <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        !error && (
                            <div className="mt-9 rounded-2xl border border-dashed border-[#C8D2DE] bg-white px-5 py-12 text-center">
                                <Package
                                    size={30}
                                    className="mx-auto text-[#77917A]"
                                />
                                <h3 className="mt-4 font-serif text-xl font-bold text-[#203653]">
                                    Your desk essentials are on their way
                                </h3>
                                <p className="mt-2 text-sm text-[#526071]">
                                    There are no stationery products available right now.
                                </p>
                                <Link
                                    to="/stationery"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#203653] transition hover:text-[#77917A]"
                                >
                                    Visit stationery
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="bg-white px-5 py-12 sm:py-16 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#DCE3EB] bg-[#203653]">
                    <div className="grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-14 lg:py-16">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#B9CBB9]">
                                <Mail size={23} />
                            </div>

                            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#B9CBB9]">
                                Notes from BAHRIA STATIONERS
                            </p>

                            <h2 className="mt-3 max-w-lg font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                                A little inspiration for your inbox.
                            </h2>

                            <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                                Get updates about stationery, study essentials
                                and new arrivals.
                            </p>
                        </div>

                        <div>
                            <form
                                onSubmit={handleNewsletterSubmit}
                                className="flex flex-col gap-3 sm:flex-row"
                            >
                                <label
                                    htmlFor="newsletter-email"
                                    className="sr-only"
                                >
                                    Email address
                                </label>

                                <input
                                    id="newsletter-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                        setNewsletterMessage('')
                                    }}
                                    placeholder="Enter your email address"
                                    required
                                    className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/55 focus:border-[#B9CBB9] focus:ring-2 focus:ring-[#B9CBB9]/20"
                                />

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C7795A] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#B96B4D]"
                                >
                                    Subscribe
                                    <Send size={16} />
                                </button>
                            </form>

                            {newsletterMessage ? (
                                <p
                                    role="status"
                                    className="mt-4 text-sm leading-6 text-[#D8E4D8]"
                                >
                                    {newsletterMessage}
                                </p>
                            ) : (
                                <p className="mt-4 text-xs leading-5 text-white/55">
                                    Newsletter subscriptions are not active yet.
                                    Your email will not be saved.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

        </main>
    )
}

export default Home