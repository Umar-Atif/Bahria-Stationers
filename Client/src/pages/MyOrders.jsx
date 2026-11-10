import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package,
  RefreshCw,
  XCircle,
  MapPin,
  CalendarDays,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  X,
  Truck,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const statusStyles = {
  Pending: 'bg-amber-50 text-amber-800 border-amber-200',
  Processing: 'bg-blue-50 text-blue-800 border-blue-200',
  Shipped: 'bg-violet-50 text-violet-800 border-violet-200',
  Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-50 text-red-800 border-red-200',
}

function formatDate(date) {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return parsedDate.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-PK')
}

function MyOrders() {
  const { token } = useAppContext()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [busyOrderId, setBusyOrderId] = useState('')
  const [message, setMessage] = useState('')
  const [orderToCancel, setOrderToCancel] = useState(null)

  const loadOrders = useCallback(async (showRefresh = false) => {
    if (!token) {
      setLoading(false)
      navigate('/login', {
        state: { from: '/orders' },
        replace: true,
      })
      return
    }

    if (showRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError('')

    try {
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.status === 401 || response.status === 403) {
        navigate('/login', {
          state: { from: '/orders' },
          replace: true,
        })
        return
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to load your orders.')
      }

      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token, navigate])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  useEffect(() => {
    if (!message) return

    const timeout = setTimeout(() => setMessage(''), 4000)

    return () => clearTimeout(timeout)
  }, [message])

  useEffect(() => {
    if (!orderToCancel) return

    const handleEscape = (event) => {
      if (event.key === 'Escape' && !busyOrderId) {
        setOrderToCancel(null)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => document.removeEventListener('keydown', handleEscape)
  }, [orderToCancel, busyOrderId])

  const cancelOrder = async () => {
    if (!orderToCancel || orderToCancel.status !== 'Pending') return

    const orderId = orderToCancel._id

    setBusyOrderId(orderId)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (response.status === 401 || response.status === 403) {
        setOrderToCancel(null)
        navigate('/login', {
          state: { from: '/orders' },
          replace: true,
        })
        return
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to cancel this order.')
      }

      setOrderToCancel(null)
      setMessage('Your order has been cancelled successfully.')

      await loadOrders(true)
    } catch (err) {
      setError(err.message || 'Unable to cancel this order.')
    } finally {
      setBusyOrderId('')
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#F5F7FA] px-4">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#203653] text-white">
            <RefreshCw size={22} className="animate-spin" />
          </span>
          <p className="mt-4 font-semibold text-[#203653]">
            Loading your orders...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Please wait a moment.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Page Header */}
        <section className="flex flex-col justify-between gap-5 rounded-3xl bg-[#203653] p-6 text-white shadow-lg shadow-[#203653]/10 sm:flex-row sm:items-center sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#B8CFBA]">
              <ShoppingBag size={16} />
              BAHRIA STATIONERS
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              My Orders
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200 sm:text-base">
              Keep track of your purchases and manage your pending orders in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            <RefreshCw
              size={16}
              className={refreshing ? 'animate-spin' : ''}
            />
            {refreshing ? 'Refreshing...' : 'Refresh orders'}
          </button>
        </section>

        {/* Notifications */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-sm"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">Something went wrong</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError('')}
              className="rounded-lg p-1 transition hover:bg-red-50"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {message && (
          <div
            role="status"
            className="mt-6 flex items-center gap-3 rounded-2xl border border-[#D6E5D7] bg-white p-4 text-sm text-[#45664A] shadow-sm"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {/* Order Summary */}
        {orders.length > 0 && (
          <section className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Package size={17} />
                Total orders
              </div>
              <p className="mt-2 text-2xl font-black text-[#203653] sm:text-3xl">
                {orders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Truck size={17} />
                Pending orders
              </div>
              <p className="mt-2 text-2xl font-black text-[#203653] sm:text-3xl">
                {orders.filter((order) => order.status === 'Pending').length}
              </p>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!error && orders.length === 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8EFE8] text-[#58765D]">
              <ShoppingBag size={36} strokeWidth={1.7} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#203653]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              You have not placed any orders yet. Explore our stationery collection and find something you need.
            </p>

            <Link
              to="/stationery"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#203653] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2C4768] focus:outline-none focus:ring-4 focus:ring-[#203653]/20"
            >
              <ShoppingBag size={17} />
              Start shopping
            </Link>
          </section>
        )}

        {/* Order List */}
        {orders.length > 0 && (
          <section className="mt-8 space-y-5">
            {/* <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-black text-[#203653] sm:text-xl">
                Order history
              </h2>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div> */}
            
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-[#203653] sm:text-xl">
                  Order history
                </h2>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
                <AlertCircle size={18} className="mt-1 shrink-0" />
                <p>
                  Please note: Only orders placed within the last 30 days
                  are displayed here. Orders older than 30 days will no
                  longer appear in your order history.
                </p>
              </div>
            </div>

            {orders.map((order) => {
              const items = Array.isArray(order.items) ? order.items : []
              const canCancel = order.status === 'Pending'

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-[#F8FAFC] p-5 sm:flex-row sm:items-start sm:px-6 sm:py-5">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                        Order number
                      </p>

                      <h3 className="mt-1 break-all text-base font-black text-[#203653] sm:text-lg">
                        {order.orderNumber || order._id}
                      </h3>

                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={15} />
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles[order.status] ||
                        'border-slate-200 bg-slate-100 text-slate-700'
                        }`}
                    >
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                      {order.status || 'Unknown'}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-slate-100 px-5 sm:px-6">
                    {items.map((item, index) => (
                      <div
                        key={
                          item._id ||
                          item.product ||
                          `${item.name}-${index}`
                        }
                        className="flex items-center gap-3 py-4 sm:gap-4"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || 'Product'}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-white object-cover sm:h-20 sm:w-20"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F0F3F7] text-[#58765D] sm:h-20 sm:w-20">
                            <Package size={27} strokeWidth={1.6} />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-sm font-bold text-[#203653] sm:text-base">
                            {item.name || 'Product'}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            Rs. {formatPrice(item.price)} × {item.quantity || 0}
                          </p>
                        </div>

                        <p className="shrink-0 text-right text-sm font-extrabold text-[#203653] sm:text-base">
                          Rs.{' '}
                          {formatPrice(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          )}
                        </p>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <p className="py-5 text-sm text-slate-500">
                        No item details are available for this order.
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  {order.shippingAddress && (
                    <div className="mx-5 border-t border-slate-100 py-4 sm:mx-6">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-[#203653]">
                        <MapPin size={16} className="text-[#58765D]" />
                        Delivery address
                      </h4>

                      <p className="mt-2 pl-6 text-sm leading-6 text-slate-500">
                        {[
                          order.shippingAddress.recipientName,
                          order.shippingAddress.street,
                          order.shippingAddress.area,
                          order.shippingAddress.city,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'Address details unavailable'}
                      </p>
                    </div>
                  )}

                  {/* Order Footer */}
                  <div className="flex flex-col justify-between gap-4 border-t border-slate-200 bg-[#FBFCFD] p-5 sm:flex-row sm:items-center sm:px-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </p>

                      <p className="mt-1 text-xl font-black text-[#203653] sm:text-2xl">
                        Rs. {formatPrice(order.subtotal)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Order total
                      </p>
                    </div>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => setOrderToCancel(order)}
                        disabled={Boolean(busyOrderId)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={17} />
                        Cancel order
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {orderToCancel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101D2E]/60 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !busyOrderId
            ) {
              setOrderToCancel(null)
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-title"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <p className="text-sm font-bold text-[#203653]">
                Order cancellation
              </p>

              <button
                type="button"
                aria-label="Close confirmation"
                disabled={Boolean(busyOrderId)}
                onClick={() => setOrderToCancel(null)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#203653] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-5 py-6 text-center sm:px-7 sm:py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <XCircle size={31} strokeWidth={1.7} />
              </div>

              <h2
                id="cancel-order-title"
                className="mt-5 text-xl font-black text-[#203653] sm:text-2xl"
              >
                Cancel this order?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Are you sure you want to cancel order{' '}
                <span className="font-bold text-[#203653]">
                  {orderToCancel.orderNumber || orderToCancel._id}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={Boolean(busyOrderId)}
                  onClick={() => setOrderToCancel(null)}
                  className="min-h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Keep order
                </button>

                <button
                  type="button"
                  disabled={Boolean(busyOrderId)}
                  onClick={cancelOrder}
                  className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyOrderId ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      Yes, cancel order
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default MyOrders
