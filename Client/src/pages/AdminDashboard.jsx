import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Building2,
    CheckCircle2,
    Clock3,
    LayoutDashboard,
    LoaderCircle,
    LogOut,
    Package,
    RefreshCw,
    ShoppingBag,
    Store,
    Users,
    AlertCircle,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const managementItems = [
    {
        title: 'Manage Orders',
        description: 'Review customer orders and update their status.',
        to: '/admin/orders',
        icon: ShoppingBag,
    },
    {
        title: 'Manage Products',
        description: 'Organize products, pricing and availability.',
        to: '/admin/products',
        icon: Package,
    },
    {
        title: 'Manage Institutions',
        description: 'Manage institutions available in your store.',
        to: '/admin/institutions',
        icon: Building2,
    },
    {
        title: 'Manage Classes',
        description: 'Maintain class records and related information.',
        to: '/admin/classes',
        icon: BookOpen,
    },
]

function getStatusStyle(status) {
    switch (status?.toLowerCase()) {
        case 'delivered':
            return 'bg-emerald-50 text-emerald-800 ring-emerald-200'
        case 'pending':
            return 'bg-amber-50 text-amber-800 ring-amber-200'
        case 'cancelled':
            return 'bg-rose-50 text-rose-700 ring-rose-200'
        case 'processing':
            return 'bg-blue-50 text-blue-800 ring-blue-200'
        case 'shipped':
            return 'bg-violet-50 text-violet-800 ring-violet-200'
        default:
            return 'bg-slate-100 text-slate-700 ring-slate-200'
    }
}

function AdminDashboard() {
    const { token, user, logout } = useAppContext()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState('')

    const fetchOrders = useCallback(async (isRefresh = false) => {
        if (!token) {
            setOrders([])
            setLoading(false)
            setError('Your session is unavailable. Please log in again.')
            return
        }

        if (isRefresh) {
            setRefreshing(true)
        } else {
            setLoading(true)
        }

        setError('')

        try {
            const response = await fetch(`${API_URL}/api/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load orders.')
            }

            setOrders(Array.isArray(data.orders) ? data.orders : [])
        } catch (err) {
            setError(err.message || 'Server connection failed.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [token])

    useEffect(() => {
        fetchOrders()

        return () => { }
    }, [fetchOrders])

    const pending = orders.filter(
        (order) => order.status?.toLowerCase() === 'pending'
    ).length

    const delivered = orders.filter(
        (order) => order.status?.toLowerCase() === 'delivered'
    ).length

    const stats = [
        {
            label: 'Total Orders',
            value: orders.length,
            description: 'All received orders',
            icon: ShoppingBag,
            iconStyle: 'bg-blue-50 text-[#203653]',
        },
        {
            label: 'Pending Orders',
            value: pending,
            description: 'Awaiting completion',
            icon: Clock3,
            iconStyle: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Delivered Orders',
            value: delivered,
            description: 'Successfully delivered',
            icon: CheckCircle2,
            iconStyle: 'bg-[#E8F0E8] text-[#58765D]',
        },
    ]

    return (
        <main className="min-h-screen bg-[#F5F7FA] text-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
                <header className="overflow-hidden rounded-3xl bg-[#172A43] text-white shadow-lg">
                    <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
                        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
                        <div className="absolute -bottom-28 right-40 h-52 w-52 rounded-full bg-white/[0.03]" />

                        <div className="relative">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                    <LayoutDashboard size={22} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B9D0BB]">
                                        BAHRIA STATIONERS
                                    </p>
                                    <p className="mt-1 text-xs text-slate-300">
                                        Store administration
                                    </p>
                                </div>
                            </div>

                            <h1 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                                Admin Dashboard
                            </h1>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                Welcome back, {user?.name || user?.email || 'Admin'}.
                                Here is an overview of your store activity.
                            </p>
                        </div>

                        <div className="relative flex flex-wrap items-center gap-3">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                            >
                                <Store size={17} />
                                View Store
                                <ArrowUpRight size={15} />
                            </Link>

                            <button
                                type="button"
                                onClick={logout}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#203653] transition hover:bg-slate-100"
                            >
                                <LogOut size={17} />
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="mt-0.5 shrink-0 text-rose-600" size={20} />
                            <div>
                                <p className="font-semibold text-rose-800">
                                    Unable to load dashboard data
                                </p>
                                <p className="mt-1 text-sm text-rose-700">{error}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fetchOrders()}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                            <RefreshCw size={15} />
                            Try again
                        </button>
                    </div>
                )}

                <section className="mt-8">
                    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58765D]">
                                Store overview
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-[#203653] sm:text-2xl">
                                Order Statistics
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {loading ? 'Updating statistics...' : 'Based on all available orders'}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon

                            return (
                                <article
                                    key={stat.label}
                                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {stat.label}
                                            </p>
                                            <p className="mt-3 text-3xl font-bold tracking-tight text-[#203653] sm:text-4xl">
                                                {loading ? (
                                                    <LoaderCircle className="animate-spin text-slate-400" size={30} />
                                                ) : (
                                                    stat.value
                                                )}
                                            </p>
                                        </div>

                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconStyle}`}>
                                            <Icon size={23} />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                                        {index === 1 ? (
                                            <ArrowDownRight size={16} className="text-amber-600" />
                                        ) : (
                                            <ArrowUpRight size={16} className="text-[#58765D]" />
                                        )}
                                        <p className="text-xs text-slate-500">
                                            {stat.description}
                                        </p>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                </section>

                <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F0E8] text-[#58765D]">
                                <ShoppingBag size={21} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#203653] sm:text-xl">
                                    Recent Orders
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    The latest orders received by your store.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fetchOrders(true)}
                                disabled={loading || refreshing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#203653] transition hover:border-[#77917A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={refreshing ? 'animate-spin' : ''}
                                />
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </button>

                            <Link
                                to="/admin/orders"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203653] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#172A43]"
                            >
                                All Orders
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center px-4 py-16">
                            <LoaderCircle size={30} className="animate-spin text-[#58765D]" />
                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Loading your orders...
                            </p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <ShoppingBag size={28} />
                            </div>
                            <h3 className="mt-4 font-semibold text-[#203653]">
                                No orders yet
                            </h3>
                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                Orders will appear here when customers place them in your store.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="w-full min-w-[650px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4 font-semibold">Order ID</th>
                                            <th className="px-6 py-4 font-semibold">Customer</th>
                                            <th className="px-6 py-4 font-semibold">Date</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {orders.slice(0, 8).map((order) => (
                                            <tr
                                                key={order._id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-[#203653]">
                                                        #{order._id?.slice(-6).toUpperCase() || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F0E8] text-xs font-bold text-[#58765D]">
                                                            {(order.user?.name || order.user?.email || 'C')
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-semibold text-slate-700">
                                                                {order.user?.name || 'Customer'}
                                                            </p>
                                                            {order.user?.email && (
                                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                                    {order.user.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString()
                                                        : '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(order.status)}`}>
                                                        {order.status || 'Unknown'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="divide-y divide-slate-100 md:hidden">
                                {orders.slice(0, 8).map((order) => (
                                    <article key={order._id} className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">
                                                    Order ID
                                                </p>
                                                <p className="mt-1 font-bold text-[#203653]">
                                                    #{order._id?.slice(-6).toUpperCase() || '—'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(order.status)}`}>
                                                {order.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F0E8] font-bold text-[#58765D]">
                                                {(order.user?.name || order.user?.email || 'C')
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-700">
                                                    {order.user?.name || order.user?.email || 'Customer'}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {order.createdAt
                                                        ? new Date(order.createdAt).toLocaleDateString()
                                                        : 'Date unavailable'}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {orders.length > 8 && (
                                <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-center">
                                    <Link
                                        to="/admin/orders"
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#58765D] transition hover:text-[#203653]"
                                    >
                                        View all {orders.length} orders
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </section>

                <section className="mt-8">
                    <div className="mb-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#58765D]">
                            Quick access
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-[#203653] sm:text-2xl">
                            Store Management
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Access the main tools for managing your store.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {managementItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#77917A] hover:shadow-md sm:p-6"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F0E8] text-[#58765D] transition group-hover:bg-[#58765D] group-hover:text-white">
                                        <Icon size={22} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-[#203653]">
                                                {item.title}
                                            </h3>
                                            <ArrowUpRight
                                                size={18}
                                                className="shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#58765D]"
                                            />
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>

                <footer className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        <span className="font-bold tracking-wide text-[#203653]">
                            BAHRIA STATIONERS
                        </span>
                        {' '}Admin Panel
                    </p>
                    <p>Store management made simple.</p>
                </footer>
            </div>
        </main>
    )
}

export default AdminDashboard
