import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    CheckCircle2,
    PackageCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ProductDetails() {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { logout } = useAppContext()

    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function fetchProduct() {
            setLoading(true)
            setError('')
            setProduct(null)
            setQuantity(1)
            setMessage('')

            try {
                const response = await fetch(
                    `${API_URL}/api/products/${productId}`
                )
                const result = await response.json()

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || 'Unable to load product.'
                    )
                }

                if (!cancelled) setProduct(result.data)
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Unable to connect to the server.')
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchProduct()

        return () => {
            cancelled = true
        }
    }, [productId])

    async function handleAddToCart() {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login', {
                state: { from: `/product/${productId}` },
            })
            return
        }

        if (!product || product.stock < quantity || adding) return

        setAdding(true)
        setMessage('')
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity,
                }),
            })

            const result = await response.json()

            if (response.status === 401 || response.status === 403) {
                logout()
                navigate('/login', {
                    state: { from: `/product/${productId}` },
                    replace: true,
                })
                return
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to add product to cart.'
                )
            }

            setMessage('Product successfully added to your cart.')
        } catch (err) {
            setError(err.message || 'Unable to update cart.')
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return (
            <main className="flex min-h-[65vh] flex-col items-center justify-center bg-[#F5F7FA] px-5 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#203653]" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading product details...
                </p>
            </main>
        )
    }

    if (error && !product) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F7FA] text-[#203653]">
                        <ShoppingBag size={26} />
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-[#203653]">
                        Unable to load product
                    </h1>

                    <p className="mt-3 text-sm text-red-600">{error}</p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        <ArrowLeft size={16} />
                        Go back
                    </button>
                </div>
            </main>
        )
    }

    if (!product) {
        return (
            <main className="flex min-h-[65vh] items-center justify-center bg-[#F5F7FA] px-5 py-16">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#203653]">
                        Product not found
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        This product may have been removed or is unavailable.
                    </p>
                    <Link
                        to="/stationery"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                    >
                        Browse stationery
                    </Link>
                </div>
            </main>
        )
    }

    const stock = Number(product.stock || 0)
    const isOutOfStock = stock <= 0
    const isLowStock = stock > 0 && stock <= 5

    const backTo =
        product.category === 'Stationery' ? '/stationery' : null

    return (
        <main className="min-h-[65vh] bg-[#F5F7FA] px-5 py-8 sm:py-10 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() => {
                        if (backTo) {
                            navigate(backTo)
                        } else {
                            navigate(-1)
                        }
                    }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#203653]"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                    <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-[#EBF2F7] p-5 sm:min-h-[440px] sm:p-8">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-[500px] w-full object-contain"
                            />
                        ) : (
                            <ShoppingBag
                                size={100}
                                strokeWidth={1.1}
                                className="text-[#203653]"
                            />
                        )}
                    </div>

                    <div className="flex flex-col justify-center py-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#EAF0EB] px-3 py-1.5 text-xs font-semibold text-[#58765D]">
                                {product.category}
                            </span>

                            {product.institution?.name && (
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                                    {product.institution.name}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#203653] sm:text-4xl lg:text-[42px]">
                            {product.name}
                        </h1>

                        <p className="mt-5 text-3xl font-bold text-[#203653]">
                            Rs. {Number(product.price).toLocaleString('en-PK')}
                        </p>

                        {product.class?.name && (
                            <p className="mt-4 text-sm text-slate-500">
                                <span className="font-semibold text-[#203653]">
                                    Class:
                                </span>{' '}
                                {product.class.name}
                            </p>
                        )}

                        <div className="mt-6 border-t border-slate-200 pt-5">
                            <h2 className="text-sm font-bold text-[#203653]">
                                Product description
                            </h2>

                            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                                {product.description ||
                                    'No description available for this product.'}
                            </p>
                        </div>

                        <div
                            className={`mt-5 flex items-center gap-2 text-sm font-semibold ${isOutOfStock
                                    ? 'text-red-600'
                                    : isLowStock
                                        ? 'text-amber-700'
                                        : 'text-[#58765D]'
                                }`}
                        >
                            {isOutOfStock ? (
                                <PackageCheck size={18} />
                            ) : (
                                <CheckCircle2 size={18} />
                            )}

                            {isOutOfStock
                                ? 'Currently out of stock'
                                : isLowStock
                                    ? `Only ${stock} left in stock`
                                    : 'In stock'}
                        </div>

                        <div className="mt-7">
                            <p className="mb-3 text-sm font-semibold text-[#203653]">
                                Quantity
                            </p>

                            <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={quantity <= 1 || adding}
                                    onClick={() =>
                                        setQuantity((value) =>
                                            Math.max(1, value - 1)
                                        )
                                    }
                                    className="p-3 text-[#203653] transition hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="min-w-12 text-center text-sm font-semibold text-[#203653]">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={
                                        quantity >= Math.min(stock, 100) ||
                                        adding
                                    }
                                    onClick={() =>
                                        setQuantity((value) =>
                                            Math.min(stock, 100, value + 1)
                                        )
                                    }
                                    className="p-3 text-[#203653] transition hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || adding}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#203653] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#2D496B] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                        >
                            <ShoppingBag size={18} />
                            {adding
                                ? 'Adding to cart...'
                                : isOutOfStock
                                    ? 'Out of stock'
                                    : 'Add to cart'}
                        </button>

                        {message && (
                            <div
                                role="status"
                                className="mt-4 rounded-xl border border-[#D5E3D7] bg-[#EEF4EF] p-4 text-sm text-[#426449]"
                            >
                                <div className="flex items-start gap-2">
                                    <CheckCircle2
                                        size={18}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {message}
                                        </p>
                                        <Link
                                            to="/cart"
                                            className="mt-1 inline-block font-semibold underline underline-offset-2"
                                        >
                                            View cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <PackageCheck
                                size={20}
                                className="mt-0.5 shrink-0 text-[#77917A]"
                            />
                            <div>
                                <p className="text-sm font-semibold text-[#203653]">
                                    Shopping made simple
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Review your cart and confirm your order at checkout.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProductDetails
