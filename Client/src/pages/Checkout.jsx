import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    CreditCard,
    LoaderCircle,
    MapPin,
    Package,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Truck,
    X,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const emptyAddress = {
    label: 'Home',
    recipientName: '',
    phone: '',
    street: '',
    area: '',
    city: '',
}

const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10'

function Checkout() {
    const { token } = useAppContext()
    const navigate = useNavigate()

    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState('')
    const [items, setItems] = useState([])
    const [subtotal, setSubtotal] = useState(0)
    const [addressForm, setAddressForm] = useState(emptyAddress)
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [savingAddress, setSavingAddress] = useState(false)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const authHeaders = {
        Authorization: `Bearer ${token}`,
    }

    const loadCheckout = useCallback(async () => {
        if (!token) {
            navigate('/login', {
                state: { from: '/checkout' },
                replace: true,
            })
            return
        }

        setLoading(true)
        setError('')

        try {
            const [addressResponse, cartResponse] = await Promise.all([
                fetch(`${API_URL}/api/addresses`, {
                    headers: authHeaders,
                }),
                fetch(`${API_URL}/api/cart`, {
                    headers: authHeaders,
                }),
            ])

            const [addressData, cartData] = await Promise.all([
                addressResponse.json(),
                cartResponse.json(),
            ])

            if (
                addressResponse.status === 401 ||
                addressResponse.status === 403 ||
                cartResponse.status === 401 ||
                cartResponse.status === 403
            ) {
                navigate('/login', {
                    state: { from: '/checkout' },
                    replace: true,
                })
                return
            }

            if (!addressResponse.ok || !addressData.success) {
                throw new Error(
                    addressData.message || 'Unable to load saved addresses.'
                )
            }

            if (!cartResponse.ok || !cartData.success) {
                throw new Error(cartData.message || 'Unable to load your cart.')
            }

            const savedAddresses = addressData.addresses || []

            setAddresses(savedAddresses)
            setSelectedAddressId((current) => {
                if (savedAddresses.some((address) => address._id === current)) {
                    return current
                }
                return savedAddresses[0]?._id || ''
            })

            setItems(cartData.items || [])
            setSubtotal(Number(cartData.subtotal) || 0)
        } catch (err) {
            setError(err.message || 'Unable to load checkout.')
        } finally {
            setLoading(false)
        }
    }, [token, navigate])

    useEffect(() => {
        loadCheckout()
    }, [loadCheckout])

    const handleAddressChange = (event) => {
        const { name, value } = event.target

        setAddressForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    const handleAddAddress = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')
        setSavingAddress(true)

        try {
            const response = await fetch(`${API_URL}/api/addresses`, {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressForm),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to save address.')
            }

            const savedAddresses = data.addresses || []
            setAddresses(savedAddresses)

            const newAddress = savedAddresses[savedAddresses.length - 1]
            setSelectedAddressId(newAddress?._id || '')
            setAddressForm(emptyAddress)
            setShowAddressForm(false)
            setSuccess('Address saved successfully.')
        } catch (err) {
            setError(err.message || 'Unable to save address.')
        } finally {
            setSavingAddress(false)
        }
    }

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError('Please select or add a delivery address.')
            return
        }

        if (items.length === 0) {
            setError('Your cart is empty.')
            return
        }

        setError('')
        setSuccess('')
        setPlacingOrder(true)

        const storageKey = `paperpen-order-key-${selectedAddressId}`
        let idempotencyKey = sessionStorage.getItem(storageKey)

        if (!idempotencyKey) {
            idempotencyKey =
                globalThis.crypto?.randomUUID?.() ||
                `${Date.now()}-${Math.random().toString(36).slice(2)}`

            sessionStorage.setItem(storageKey, idempotencyKey)
        }

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    addressId: selectedAddressId,
                    idempotencyKey,
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to place order.')
            }

            sessionStorage.removeItem(storageKey)

            setSuccess('Your order has been placed successfully!')

            navigate('/orders', {
                replace: true,
                state: {
                    order: data.order,
                    message: 'Your order has been placed successfully!',
                },
            })
        } catch (err) {
            setError(err.message || 'Unable to place order. Please try again.')
        } finally {
            setPlacingOrder(false)
        }
    }

    const formatPrice = (price) =>
        `Rs. ${Number(price || 0).toLocaleString('en-PK')}`

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F7FA] px-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#203653] text-white shadow-lg shadow-[#203653]/15">
                        <LoaderCircle size={27} className="animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                        Preparing your checkout...
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#F5F7FA] pb-16 text-[#203653]">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#203653] text-white transition group-hover:bg-[#172A43]">
                            <ShoppingBag size={21} />
                        </div>
                        <div>
                            <p className="text-lg font-black tracking-[0.08em] text-[#203653]">
                                BAHRIA STATIONERS
                            </p>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Stationery & more
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#203653] transition hover:border-[#203653] hover:bg-[#F5F7FA]"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back to cart</span>
                        <span className="sm:hidden">Cart</span>
                    </Link>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
                <div className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#77917A]">
                        <span className="h-px w-7 bg-[#77917A]" />
                        Almost there
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-[#203653] sm:text-4xl">
                        Checkout
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                        Confirm your delivery details and review your stationery
                        before placing your order.
                    </p>

                    <div className="mt-6 flex max-w-md items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#203653] text-white">
                            <Check size={16} />
                        </div>
                        <div className="h-px flex-1 bg-[#77917A]" />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#203653] text-white">
                            <MapPin size={16} />
                        </div>
                        <div className="h-px flex-1 bg-slate-200" />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400">
                            <Package size={16} />
                        </div>
                    </div>

                    <div className="mt-2 flex max-w-md justify-between text-[11px] font-semibold text-slate-500">
                        <span>Cart</span>
                        <span className="text-[#203653]">Delivery</span>
                        <span>Order</span>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <X size={18} className="mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-6 flex items-start gap-3 rounded-2xl border border-[#77917A]/30 bg-[#77917A]/10 p-4 text-sm text-[#203653]"
                    >
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#58765D]" />
                        <p>{success}</p>
                    </div>
                )}

                {items.length === 0 ? (
                    <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F7FA] text-[#203653]">
                            <ShoppingBag size={28} />
                        </div>

                        <h2 className="mt-5 text-xl font-extrabold text-[#203653]">
                            Your cart is empty
                        </h2>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                            Your next favourite stationery item is waiting for you.
                            Explore the store and add something you love.
                        </p>

                        <Link
                            to="/"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#203653] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#172A43]"
                        >
                            Continue shopping
                            <ArrowRight size={16} />
                        </Link>
                    </section>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
                        <section className="space-y-6">
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F7FA] text-[#203653]">
                                            <MapPin size={21} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-extrabold text-[#203653]">
                                                Delivery address
                                            </h2>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Where should we deliver your order?
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddressForm((current) => !current)
                                            setError('')
                                        }}
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#203653]/20 px-4 py-2.5 text-sm font-bold text-[#203653] transition hover:border-[#203653] hover:bg-[#F5F7FA]"
                                    >
                                        {showAddressForm ? (
                                            <>
                                                <X size={16} />
                                                Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={16} />
                                                Add address
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="p-5 sm:p-7">
                                    {addresses.length === 0 && !showAddressForm && (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F5F7FA] px-5 py-8 text-center">
                                            <MapPin className="mx-auto text-slate-400" size={25} />
                                            <p className="mt-3 font-bold text-[#203653]">
                                                No saved addresses yet
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Add a delivery address to continue.
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {addresses.map((address) => {
                                            const isSelected =
                                                selectedAddressId === address._id

                                            return (
                                                <label
                                                    key={address._id}
                                                    className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition sm:p-5 ${isSelected
                                                            ? 'border-[#77917A] bg-[#77917A]/[0.07] ring-1 ring-[#77917A]/30'
                                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="deliveryAddress"
                                                        value={address._id}
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            setSelectedAddressId(address._id)
                                                        }
                                                        className="mt-1 h-4 w-4 shrink-0 accent-[#58765D]"
                                                    />

                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex flex-wrap items-center gap-2">
                                                            <span className="font-bold text-[#203653]">
                                                                {address.label || 'Home'}
                                                            </span>

                                                            {isSelected && (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#77917A]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#58765D]">
                                                                    <Check size={11} />
                                                                    Selected
                                                                </span>
                                                            )}
                                                        </span>

                                                        <span className="mt-2 block text-sm font-semibold text-slate-700">
                                                            {address.recipientName}
                                                        </span>

                                                        <span className="mt-1 block text-sm leading-6 text-slate-500">
                                                            {address.street}, {address.area}, {address.city}
                                                        </span>

                                                        <span className="mt-1 block text-sm text-slate-500">
                                                            {address.phone}
                                                        </span>
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>

                                    {showAddressForm && (
                                        <form
                                            onSubmit={handleAddAddress}
                                            className="mt-6 rounded-2xl border border-slate-200 bg-[#F5F7FA]/70 p-4 sm:p-6"
                                        >
                                            <div className="mb-5">
                                                <h3 className="font-extrabold text-[#203653]">
                                                    Add a new address
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Enter your details for a smooth delivery.
                                                </p>
                                            </div>

                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="address-label"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        Address label
                                                    </label>
                                                    <select
                                                        id="address-label"
                                                        name="label"
                                                        value={addressForm.label}
                                                        onChange={handleAddressChange}
                                                        className={inputClass}
                                                    >
                                                        <option>Home</option>
                                                        <option>Work</option>
                                                        <option>Other</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="recipientName"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        Recipient name
                                                    </label>
                                                    <input
                                                        id="recipientName"
                                                        required
                                                        name="recipientName"
                                                        value={addressForm.recipientName}
                                                        onChange={handleAddressChange}
                                                        placeholder="Full name"
                                                        autoComplete="name"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="phone"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        WhatsApp number
                                                    </label>
                                                    <input
                                                        id="phone"
                                                        required
                                                        type="tel"
                                                        name="phone"
                                                        value={addressForm.phone}
                                                        onChange={handleAddressChange}
                                                        placeholder="03XX XXXXXXX"
                                                        autoComplete="tel"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="city"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        City
                                                    </label>
                                                    <input
                                                        id="city"
                                                        required
                                                        name="city"
                                                        value={addressForm.city}
                                                        onChange={handleAddressChange}
                                                        placeholder="Your city"
                                                        autoComplete="address-level2"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="street"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        Street / House address
                                                    </label>
                                                    <input
                                                        id="street"
                                                        required
                                                        name="street"
                                                        value={addressForm.street}
                                                        onChange={handleAddressChange}
                                                        placeholder="House number, street, building"
                                                        autoComplete="street-address"
                                                        className={inputClass}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="area"
                                                        className="mb-1.5 block text-sm font-semibold text-slate-700"
                                                    >
                                                        Area / Locality
                                                    </label>
                                                    <input
                                                        id="area"
                                                        required
                                                        name="area"
                                                        value={addressForm.area}
                                                        onChange={handleAddressChange}
                                                        placeholder="Area or neighbourhood"
                                                        className={inputClass}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={savingAddress}
                                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#203653] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#172A43] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                            >
                                                {savingAddress ? (
                                                    <>
                                                        <LoaderCircle size={17} className="animate-spin" />
                                                        Saving address...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check size={17} />
                                                        Save address
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5F7FA] text-[#58765D]">
                                    <ShieldCheck size={21} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#203653]">
                                        A checkout you can trust
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Your order details are checked by our server when you place your order.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
                            <div className="bg-[#203653] px-5 py-5 text-white sm:px-7">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                        <ShoppingBag size={21} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-extrabold">
                                            Order summary
                                        </h2>
                                        <p className="mt-0.5 text-xs text-white/65">
                                            {items.length} {items.length === 1 ? 'item' : 'items'} in your order
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 sm:p-7">
                                <div className="space-y-1 divide-y divide-slate-100">
                                    {items.map((item) => {
                                        const product = item.product || item
                                        const productId =
                                            typeof item.product === 'string'
                                                ? item.product
                                                : product._id

                                        const name =
                                            item.name || product.name || 'Product'
                                        const image = item.image || product.image
                                        const price =
                                            Number(item.price ?? product.price) || 0
                                        const quantity = Number(item.quantity) || 0

                                        return (
                                            <div
                                                key={productId || name}
                                                className="flex gap-3 py-4 first:pt-0"
                                            >
                                                <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-[#F5F7FA]">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                            <Package size={25} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1 py-1">
                                                    <p className="line-clamp-2 text-sm font-bold leading-5 text-[#203653]">
                                                        {name}
                                                    </p>
                                                    <p className="mt-1.5 text-xs text-slate-500">
                                                        Quantity: {quantity}
                                                    </p>
                                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                                        {formatPrice(price)} each
                                                    </p>
                                                </div>

                                                <p className="whitespace-nowrap pt-1 text-sm font-extrabold text-[#203653]">
                                                    {formatPrice(price * quantity)}
                                                </p>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-3 space-y-3 border-t border-slate-200 pt-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-semibold text-[#203653]">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-slate-500">
                                            <Truck size={16} />
                                            Delivery
                                        </span>
                                        <span className="font-semibold text-[#58765D]">
                                            No Extra Delivery Charges
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
                                        <span className="font-bold text-[#203653]">
                                            Total
                                        </span>
                                        <span className="text-2xl font-black tracking-tight text-[#203653]">
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                </div>

                                <p className="mt-4 rounded-xl bg-[#F5F7FA] p-3 text-xs leading-5 text-slate-500">
                                    Final stock and prices are verified by the server when you place your order.
                                </p>

                                <button
                                    type="button"
                                    onClick={handlePlaceOrder}
                                    disabled={
                                        placingOrder ||
                                        !selectedAddressId ||
                                        items.length === 0
                                    }
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#203653] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-[#203653]/10 transition hover:bg-[#172A43] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    {placingOrder ? (
                                        <>
                                            <LoaderCircle size={18} className="animate-spin" />
                                            Placing order...
                                        </>
                                    ) : (
                                        <>
                                            Place order
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                {!selectedAddressId && (
                                    <p className="mt-3 text-center text-xs font-medium text-slate-500">
                                        Select or add a delivery address to continue.
                                    </p>
                                )}

                                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <CreditCard size={15} />
                                    <span>Order securely with BAHRIA STATIONERS</span>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Checkout
