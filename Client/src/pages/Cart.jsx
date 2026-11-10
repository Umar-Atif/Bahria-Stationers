import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ShoppingBag,
    Trash2,
    Minus,
    Plus,
    ArrowLeft,
    PackageCheck,
} from 'lucide-react'

import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Cart() {
    const navigate = useNavigate()

    const [items, setItems] = useState([])
    const [subtotal, setSubtotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [busyId, setBusyId] = useState('')
    const [error, setError] = useState('')

    const { logout } = useAppContext()

    const getToken = () => localStorage.getItem('token')

    const handleAuthError = useCallback(() => {
        logout()
        navigate('/login', {
            state: { from: '/cart' },
            replace: true,
        })
    }, [logout, navigate])

    const loadCart = useCallback(async () => {
        const token = getToken()

        if (!token) {
            setItems([])
            setSubtotal(0)
            setLoading(false)
            setError('Please log in to view your cart.')
            return
        }

        try {
            setError('')

            const response = await fetch(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (response.status === 401 || response.status === 403) {
                handleAuthError()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load cart.')
            }

            setItems(data.items || [])
            setSubtotal(data.subtotal || 0)
        } catch (err) {
            setError(err.message || 'Unable to connect to the server.')
        } finally {
            setLoading(false)
        }
    }, [handleAuthError])

    useEffect(() => {
        loadCart()
    }, [loadCart])

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1 || quantity > 100) return

        setBusyId(productId)
        setError('')

        try {
            const token = getToken()

            if (!token) {
                handleAuthError()
                return
            }

            const response = await fetch(
                `${API_URL}/api/cart/items/${productId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ quantity }),
                }
            )

            const data = await response.json()

            if (response.status === 401 || response.status === 403) {
                handleAuthError()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to update quantity.')
            }

            await loadCart()
        } catch (err) {
            setError(err.message || 'Unable to update quantity.')
        } finally {
            setBusyId('')
        }
    }

    const removeItem = async (productId) => {
        setBusyId(productId)
        setError('')

        try {
            const token = getToken()

            if (!token) {
                handleAuthError()
                return
            }

            const response = await fetch(
                `${API_URL}/api/cart/items/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (response.status === 401 || response.status === 403) {
                handleAuthError()
                return
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to remove item.')
            }

            await loadCart()
        } catch (err) {
            setError(err.message || 'Unable to remove item.')
        } finally {
            setBusyId('')
        }
    }

    const formatPrice = (amount) =>
        `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`

    if (loading) {
        return (
            <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F5F7FA] px-5 py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#203653]" />
                <p className="mt-4 text-sm font-medium text-slate-500">
                    Loading your cart...
                </p>
            </main>
        )
    }

    return (
        <main className="min-h-[60vh] bg-[#F5F7FA] px-5 py-10 md:py-14">
            <div className="mx-auto max-w-7xl">
                <Link
                    to="/stationery"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#203653]"
                >
                    <ArrowLeft size={17} />
                    Continue shopping
                </Link>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#203653] text-white">
                        <ShoppingBag size={23} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#203653] sm:text-4xl">
                            Shopping Cart
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review your items before checkout.
                        </p>
                    </div>

                    <span className="ml-auto rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-[#203653]">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <span>{error}</span>

                        {!getToken() && (
                            <Link
                                to="/login"
                                className="font-semibold underline"
                            >
                                Log in
                            </Link>
                        )}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#203653]">
                            <ShoppingBag size={32} strokeWidth={1.5} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-[#203653]">
                            Your cart is empty
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Find books, copies and stationery for your studies
                            and everyday needs.
                        </p>

                        <Link
                            to="/stationery"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2D496B]"
                        >
                            Explore products
                            <ArrowLeft className="rotate-180" size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_350px] lg:gap-8">
                        <section className="space-y-4">
                            {items.map((item) => {
                                const id = String(item.product)
                                const isBusy = busyId === id
                                const stock = Number(item.stock || 0)
                                const quantity = Number(item.quantity || 1)
                                const maxQuantity = Math.min(100, stock)

                                return (
                                    <article
                                        key={id}
                                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                                    >
                                        <Link
                                            to={`/product/${id}`}
                                            className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EBF2F7] sm:h-28 sm:w-28"
                                        >
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    className="h-full w-full object-contain p-2"
                                                />
                                            ) : (
                                                <ShoppingBag
                                                    size={32}
                                                    strokeWidth={1.3}
                                                    className="text-slate-300"
                                                />
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-[#77917A]">
                                                {item.category}
                                            </p>

                                            <Link
                                                to={`/product/${id}`}
                                                className="mt-1 block font-bold text-[#203653] transition hover:text-[#77917A]"
                                            >
                                                {item.name}
                                            </Link>

                                            <p className="mt-2 text-sm text-slate-500">
                                                {formatPrice(item.price)} each
                                            </p>

                                            {!item.available && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    Only {item.stock} available.
                                                    Update the quantity to continue.
                                                </p>
                                            )}

                                            {stock === 0 && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    Currently out of stock.
                                                </p>
                                            )}

                                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                                <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                                                    <button
                                                        type="button"
                                                        aria-label="Decrease quantity"
                                                        disabled={isBusy || quantity <= 1}
                                                        onClick={() =>
                                                            updateQuantity(id, quantity - 1)
                                                        }
                                                        className="p-2.5 text-[#203653] transition hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Minus size={15} />
                                                    </button>

                                                    <span className="min-w-9 text-center text-sm font-semibold text-[#203653]">
                                                        {quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        aria-label="Increase quantity"
                                                        disabled={
                                                            isBusy ||
                                                            quantity >= maxQuantity
                                                        }
                                                        onClick={() =>
                                                            updateQuantity(id, quantity + 1)
                                                        }
                                                        className="p-2.5 text-[#203653] transition hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Plus size={15} />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={isBusy}
                                                    onClick={() => removeItem(id)}
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-red-600 disabled:opacity-50"
                                                >
                                                    <Trash2 size={15} />
                                                    Remove
                                                </button>

                                                {isBusy && (
                                                    <span className="text-xs text-slate-400">
                                                        Updating...
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-lg font-bold text-[#203653] sm:min-w-28 sm:text-right">
                                            {formatPrice(item.lineTotal)}
                                        </p>
                                    </article>
                                )
                            })}
                        </section>

                        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                            <h2 className="text-lg font-bold text-[#203653]">
                                Order summary
                            </h2>

                            <div className="mt-5 flex justify-between gap-4 text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-[#203653]">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F5F7FA] p-3">
                                <PackageCheck
                                    size={17}
                                    className="mt-0.5 shrink-0 text-[#77917A]"
                                />
                                <p className="text-xs leading-5 text-slate-500">
                                    Delivery charges, if any, will be confirmed
                                    at checkout.
                                </p>
                            </div>

                            <div className="my-5 border-t border-slate-200" />

                            <div className="flex justify-between gap-4 text-base font-bold text-[#203653]">
                                <span>Estimated total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            <button
                                type="button"
                                disabled={items.some((item) => !item.available)}
                                onClick={() => navigate('/checkout')}
                                className="mt-6 w-full rounded-xl bg-[#203653] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2D496B] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Proceed to checkout
                            </button>

                            {items.some((item) => !item.available) && (
                                <p className="mt-3 text-xs leading-5 text-red-600">
                                    Adjust unavailable quantities before checkout.
                                </p>
                            )}

                            <Link
                                to="/stationery"
                                className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#203653]"
                            >
                                <ArrowLeft size={15} />
                                Continue shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Cart
