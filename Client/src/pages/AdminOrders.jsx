import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleAlert,
    Clock3,
    LoaderCircle,
    MapPin,
    Package,
    RefreshCw,
    Search,
    ShoppingBag,
    Truck,
    UserRound,
    X,
    MessageCircle,
    Printer
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function openWhatsAppConfirmation(order) {
    const phone = String(order.shippingAddress?.phone || '').replace(/\D/g, '')

    if (!phone) {
        return
    }

    // Convert Pakistani mobile numbers such as 03XXXXXXXXX to 923XXXXXXXXX.
    const whatsappNumber = phone.startsWith('0')
        ? `92${phone.slice(1)}`
        : phone

    const orderNumber = getOrderNumber(order)
    const customerName = order.shippingAddress?.recipientName || 'Customer'

    const message = `Assalam-o-Alaikum ${customerName}! 

Thank you for choosing BAHRIA STATIONERS. We truly appreciate your order!

Here are your order details for your reference:

🧾 Order ID: #${orderNumber}
📅 Order Date: ${formatDate(order.createdAt)}
📦 Order Status: ${order.status || 'Pending'}
💳 Order Total: ${formatPrice(order.subtotal)}

🛍️ Items:
${order.items.map(item => `${item.name} × ${item.quantity}`).join('\n')}

Please review your order details and confirm if everything is correct.

✅ If you would like to proceed with this order, kindly reply with "OK" to confirm it.

If you have any questions or need to make any changes, feel free to let us know.

Thank you for shopping with BAHRIA STATIONERS. Have a lovely day! ✨`;

    const whatsappUrl = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
}

const statuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
]

const nextStatus = {
    Pending: 'Confirmed',
    Confirmed: 'Processing',
    Processing: 'Shipped',
    Shipped: 'Delivered',
}

const statusStyle = {
    Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    Confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
    Processing: 'bg-violet-50 text-violet-700 ring-violet-200',
    Shipped: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    Delivered: 'bg-[#77917A]/10 text-[#58765D] ring-[#77917A]/30',
    Cancelled: 'bg-red-50 text-red-700 ring-red-200',
}

function formatDate(date) {
    if (!date) return '—'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return '—'

    return parsedDate.toLocaleString('en-PK', {
        dateStyle: 'medium',
        timeStyle: 'short',
    })
}

function formatPrice(price) {
    return `Rs. ${Number(price || 0).toLocaleString('en-PK')}`
}

function getOrderNumber(order) {
    return (
        order.orderNumber ||
        `#${String(order._id || '').slice(-6).toUpperCase()}`
    )
}

function getItemTotal(item) {
    return Number(item.price || 0) * Number(item.quantity || 0)
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character])
}

// function generateOrderSlip(order) {
//     const slipWindow = window.open('', '_blank', 'width=850,height=700')

//     if (!slipWindow) {
//         alert('Please allow pop-ups for this website to generate the order slip.')
//         return
//     }

//     const address = order.shippingAddress || {}
//     const items = order.items || []

//     const itemRows = items.map((item, index) => `
//         <tr>
//             <td>${index + 1}</td>
//             <td>${escapeHtml(item.name || 'Unnamed product')}</td>
//             <td>${Number(item.quantity || 0)}</td>
//             <td>${escapeHtml(formatPrice(item.price))}</td>
//             <td>${escapeHtml(formatPrice(getItemTotal(item)))}</td>
//         </tr>
//     `).join('')

//     const fullAddress = [
//         address.street,
//         address.area,
//         address.city,
//     ].filter(Boolean).map(escapeHtml).join(', ')

//     slipWindow.document.write(`<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Order Slip - ${escapeHtml(getOrderNumber(order))}</title>

//     <style>
//         * { box-sizing: border-box; }

//         body {
//             margin: 0;
//             padding: 36px;
//             color: #203653;
//             font-family: Arial, sans-serif;
//         }

//         .slip {
//             max-width: 760px;
//             margin: 0 auto;
//         }

//         .top {
//             display: flex;
//             justify-content: space-between;
//             gap: 20px;
//             padding-bottom: 22px;
//             border-bottom: 3px solid #203653;
//         }

//         h1 {
//             margin: 0;
//             font-size: 27px;
//             letter-spacing: 1px;
//         }

//         .muted {
//             color: #64748b;
//             font-size: 12px;
//         }

//         h2 {
//             margin: 28px 0 12px;
//             font-size: 15px;
//         }

//         .meta {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 14px;
//             margin-top: 22px;
//         }

//         .field {
//             padding: 12px;
//             border: 1px solid #e2e8f0;
//             border-radius: 8px;
//         }

//         .label {
//             display: block;
//             margin-bottom: 6px;
//             color: #64748b;
//             font-size: 10px;
//             font-weight: bold;
//             text-transform: uppercase;
//         }

//         .value {
//             font-size: 13px;
//             font-weight: 600;
//             overflow-wrap: anywhere;
//         }

//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin-top: 12px;
//         }

//         th, td {
//             padding: 11px 8px;
//             border-bottom: 1px solid #e2e8f0;
//             text-align: left;
//             font-size: 12px;
//         }

//         th {
//             background: #f5f7fa;
//             font-size: 10px;
//             text-transform: uppercase;
//         }

//         .total {
//             display: flex;
//             justify-content: flex-end;
//             margin-top: 18px;
//             font-size: 18px;
//             font-weight: bold;
//         }

//         .thanks {
//             margin-top: 42px;
//             padding-top: 16px;
//             border-top: 1px solid #e2e8f0;
//             text-align: center;
//             color: #64748b;
//             font-size: 12px;
//         }

//         @media print {
//             body { padding: 0; }
//             .slip { max-width: none; }
//         }
//     </style>
// </head>

// <body>
//     <main class="slip">
//         <header class="top">
//             <div>
//                 <h1>PAPER&amp;PEN</h1>
//                 <p class="muted">ORDER SLIP</p>
//             </div>

//             <div style="text-align:right">
//                 <strong>Order ${escapeHtml(getOrderNumber(order))}</strong>
//                 <p class="muted">${escapeHtml(formatDate(order.createdAt))}</p>
//             </div>
//         </header>

//         <section class="meta">
//             <div class="field">
//                 <span class="label">Customer</span>
//                 <div class="value">
//                     ${escapeHtml(address.recipientName || order.user?.name || 'Customer')}
//                 </div>
//             </div>

//             <div class="field">
//                 <span class="label">Phone</span>
//                 <div class="value">${escapeHtml(address.phone || '—')}</div>
//             </div>

//             <div class="field">
//                 <span class="label">Delivery address</span>
//                 <div class="value">${fullAddress || '—'}</div>
//             </div>

//             <div class="field">
//                 <span class="label">Order status</span>
//                 <div class="value">${escapeHtml(order.status || 'Pending')}</div>
//             </div>
//         </section>

//         <h2>ORDER ITEMS</h2>

//         <table>
//             <thead>
//                 <tr>
//                     <th>#</th>
//                     <th>Product</th>
//                     <th>Qty</th>
//                     <th>Unit Price</th>
//                     <th>Amount</th>
//                 </tr>
//             </thead>

//             <tbody>
//                 ${itemRows || '<tr><td colspan="5">No product details available.</td></tr>'}
//             </tbody>
//         </table>

//         <div class="total">
//             Subtotal: ${escapeHtml(formatPrice(order.subtotal))}
//         </div>

//         <footer class="thanks">
//             Thank you for shopping with PAPER&amp;PEN!
//         </footer>
//     </main>
// </body>
// </html>`)

//     slipWindow.document.close()
//     slipWindow.focus()

//     setTimeout(() => slipWindow.print(), 300)
// }


function generateOrderSlip(order) {
    const slipWindow = window.open('', '_blank', 'width=900,height=750')

    if (!slipWindow) {
        alert('Please allow pop-ups for this website to generate the order slip.')
        return
    }

    const address = order.shippingAddress || {}
    const items = order.items || []

    const itemRows = items.map((item, index) => `
        <tr>
            <td class="item-number">${String(index + 1).padStart(2, '0')}</td>
            <td>
                <div class="product-name">${escapeHtml(item.name || 'Unnamed product')}</div>
            </td>
            <td class="center">${Number(item.quantity || 0)}</td>
            <td class="right">${escapeHtml(formatPrice(item.price))}</td>
            <td class="right amount">${escapeHtml(formatPrice(getItemTotal(item)))}</td>
        </tr>
    `).join('')

    const fullAddress = [
        address.street,
        address.area,
        address.city,
    ].filter(Boolean).map(escapeHtml).join(', ')

    const customerName = escapeHtml(
        address.recipientName || order.user?.name || 'Customer'
    )

    const orderNumber = escapeHtml(getOrderNumber(order))
    const orderDate = escapeHtml(formatDate(order.createdAt))

    slipWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>Order Slip - ${orderNumber}</title>

    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 35px;
            background: #eef1f5;
            color: #203653;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page {
            max-width: 850px;
            min-height: 1050px;
            margin: 0 auto;
            padding: 48px;
            background: #ffffff;
            box-shadow: 0 8px 35px rgba(32, 54, 83, 0.10);
            position: relative;
        }

        /* HEADER */

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 25px;
            padding-bottom: 28px;
            border-bottom: 2px solid #203653;
        }

        .brand {
            font-size: 30px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #203653;
            margin: 0;
        }

        .brand span {
            color: #77917A;
        }

        .tagline {
            margin: 7px 0 0;
            font-size: 10px;
            letter-spacing: 2px;
            color: #8290a0;
            text-transform: uppercase;
        }

        .document-label {
            text-align: right;
        }

        .document-label h2 {
            margin: 0;
            font-size: 23px;
            letter-spacing: 1px;
            color: #203653;
        }

        .document-label p {
            margin: 7px 0 0;
            font-size: 11px;
            color: #8290a0;
        }

        /* ORDER SUMMARY */

        .order-summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 28px;
            padding: 20px;
            background: #f5f7fa;
            border: 1px solid #e8edf2;
            border-radius: 10px;
        }

        .summary-label {
            display: block;
            margin-bottom: 7px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1.2px;
            color: #8290a0;
            text-transform: uppercase;
        }

        .summary-value {
            font-size: 14px;
            font-weight: 700;
            color: #203653;
            overflow-wrap: anywhere;
        }

        /* CUSTOMER DETAILS */

        .section {
            margin-top: 32px;
        }

        .section-heading {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 0 16px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #203653;
            text-transform: uppercase;
        }

        .section-heading::before {
            content: '';
            display: block;
            width: 4px;
            height: 17px;
            border-radius: 5px;
            background: #77917A;
        }

        .customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .detail-card {
            padding: 15px;
            border: 1px solid #e8edf2;
            border-radius: 8px;
        }

        .detail-label {
            display: block;
            margin-bottom: 7px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #8290a0;
            text-transform: uppercase;
        }

        .detail-value {
            font-size: 12px;
            font-weight: 600;
            line-height: 1.6;
            color: #203653;
            overflow-wrap: anywhere;
        }

        /* ITEMS TABLE */

        .items-table {
            width: 100%;
            margin-top: 12px;
            border-collapse: collapse;
        }

        .items-table thead {
            background: #203653;
            color: #ffffff;
        }

        .items-table th {
            padding: 14px 12px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-align: left;
            text-transform: uppercase;
        }

        .items-table td {
            padding: 17px 12px;
            border-bottom: 1px solid #e9edf1;
            font-size: 11px;
            color: #475569;
        }

        .items-table tbody tr:nth-child(even) {
            background: #fafbfc;
        }

        .item-number {
            width: 45px;
            color: #94a3b8 !important;
            font-weight: 700;
        }

        .product-name {
            color: #203653;
            font-size: 12px;
            font-weight: 700;
            overflow-wrap: anywhere;
        }

        .center {
            text-align: center !important;
        }

        .right {
            text-align: right !important;
            white-space: nowrap;
        }

        .amount {
            color: #203653 !important;
            font-weight: 700;
        }

        /* TOTAL */

        .total-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 22px;
        }

        .total-box {
            width: 270px;
            padding: 18px;
            border-radius: 9px;
            background: #f5f7fa;
            border: 1px solid #e8edf2;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }

        .total-label {
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
        }

        .total-value {
            font-size: 19px;
            font-weight: 900;
            color: #203653;
            white-space: nowrap;
        }

        /* FOOTER */

        .footer {
            margin-top: 65px;
            padding-top: 22px;
            border-top: 1px solid #e8edf2;
            text-align: center;
        }

        .footer-brand {
            margin: 0;
            color: #203653;
            font-size: 15px;
            font-weight: 900;
            letter-spacing: 2px;
        }

        .footer p {
            margin: 8px 0 0;
            color: #8290a0;
            font-size: 10px;
            line-height: 1.6;
        }

        .footer-note {
            margin-top: 18px !important;
            color: #77917A !important;
            font-weight: 700;
        }

        /* PRINT BUTTON */

        .print-button {
            display: block;
            margin: 25px auto;
            padding: 13px 25px;
            border: 0;
            border-radius: 8px;
            background: #203653;
            color: white;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
        }

        .print-button:hover {
            background: #172A43;
        }

        @media (max-width: 600px) {
            body {
                padding: 10px;
            }

            .page {
                padding: 22px;
            }

            .brand {
                font-size: 23px;
            }

            .document-label h2 {
                font-size: 17px;
            }

            .items-table th,
            .items-table td {
                padding: 10px 6px;
                font-size: 9px;
            }
        }

        @page {
            size: A4;
            margin: 12mm;
        }

        @media print {
            body {
                padding: 0;
                background: white;
            }

            .page {
                max-width: none;
                min-height: auto;
                padding: 15px;
                box-shadow: none;
            }

            .print-button {
                display: none;
            }

            .items-table tr {
                break-inside: avoid;
            }
        }
    </style>
</head>

<body>
    <main class="page">

        <header class="header">
            <div>
                <h1 class="brand">BAHRIA STATIONERS</h1>
                <p class="tagline">Everything you need, beautifully organized.</p>
            </div>

            <div class="document-label">
                <h2>ORDER SLIP</h2>
                <p>Customer Copy</p>
            </div>
        </header>

        <section class="order-summary">
            <div>
                <span class="summary-label">Order Number</span>
                <div class="summary-value">#${orderNumber}</div>
            </div>

            <div>
                <span class="summary-label">Order Date</span>
                <div class="summary-value">${orderDate}</div>
            </div>
        </section>

        <section class="section">
            <h3 class="section-heading">Customer Information</h3>

            <div class="customer-grid">
                <div class="detail-card">
                    <span class="detail-label">Customer Name</span>
                    <div class="detail-value">${customerName}</div>
                </div>

                <div class="detail-card">
                    <span class="detail-label">Contact Number</span>
                    <div class="detail-value">${escapeHtml(address.phone || '—')}</div>
                </div>

                <div class="detail-card">
                    <span class="detail-label">Delivery Address</span>
                    <div class="detail-value">${fullAddress || '—'}</div>
                </div>

                <div class="detail-card">
                    <span class="detail-label">Address Label</span>
                    <div class="detail-value">${escapeHtml(address.label || '—')}</div>
                </div>
            </div>
        </section>

        <section class="section">
            <h3 class="section-heading">Order Items</h3>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Description</th>
                        <th style="text-align:center">Qty</th>
                        <th style="text-align:right">Unit Price</th>
                        <th style="text-align:right">Total</th>
                    </tr>
                </thead>

                <tbody>
                    ${itemRows || `
                        <tr>
                            <td colspan="5" style="text-align:center">
                                No product details available.
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        </section>

        <div class="total-wrapper">
            <div class="total-box">
                <div class="total-row">
                    <span class="total-label">Order Subtotal</span>
                    <span class="total-value">${escapeHtml(formatPrice(order.subtotal))}</span>
                </div>
            </div>
        </div>

        <footer class="footer">
            <h3 class="footer-brand">BAHRIA STATIONERS</h3>
            <p>Thank you for choosing us!</p>
            <p>We appreciate your order and hope you enjoy your purchase.</p>
            <p class="footer-note">Made with care, packed with love.</p>
        </footer>

    </main>

    <button class="print-button" onclick="window.print()">
        Print / Save as PDF
    </button>
</body>
</html>`)

    slipWindow.document.close()
    slipWindow.focus()
}


function Detail({ label, value }) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-1.5 break-words text-sm font-medium leading-5 text-[#203653]">
                {value || '—'}
            </p>
        </div>
    )
}

function StatusBadge({ status }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyle[status] || 'bg-slate-100 text-slate-600 ring-slate-200'
                }`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status || 'Unknown'}
        </span>
    )
}

function AdminOrders() {
    const { token } = useAppContext()

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('All')
    const [expandedId, setExpandedId] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [updatingId, setUpdatingId] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        let cancelled = false

        async function fetchOrders() {
            setLoading(true)
            setError('')
            setSuccess('')

            try {
                const query =
                    filter === 'All'
                        ? ''
                        : `?status=${encodeURIComponent(filter)}`

                const response = await fetch(
                    `${API_URL}/api/admin/orders${query}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )

                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Unable to load orders.')
                }

                if (!cancelled) {
                    setOrders(data.orders || [])
                    setExpandedId('')
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Server connection failed.')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                    setRefreshing(false)
                }
            }
        }

        if (!token) {
            setLoading(false)
            setRefreshing(false)
            setError('Admin login required.')
        } else {
            fetchOrders()
        }

        return () => {
            cancelled = true
        }
    }, [token, filter, reloadKey])

    async function handleStatusUpdate(order) {
        const status = nextStatus[order.status]

        if (!status || updatingId || !token) return

        setUpdatingId(order._id)
        setError('')
        setSuccess('')

        try {
            const response = await fetch(
                `${API_URL}/api/admin/orders/${order._id}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to update order status.')
            }

            setOrders(current =>
                filter === 'All'
                    ? current.map(item =>
                        item._id === order._id
                            ? { ...item, ...(data.order || {}), status }
                            : item
                    )
                    : current.filter(item => item._id !== order._id)
            )

            setSuccess(`Order status updated to ${status}.`)
        } catch (err) {
            setError(err.message || 'Server connection failed.')
        } finally {
            setUpdatingId('')
        }
    }

    function handleRefresh() {
        setRefreshing(true)
        setReloadKey(current => current + 1)
    }

    const visibleOrders = useMemo(() => {
        const query = search.trim().toLowerCase()

        if (!query) return orders

        return orders.filter(order => {
            const searchableValues = [
                getOrderNumber(order),
                order._id,
                order.user?.name,
                order.user?.email,
                order.status,
                order.shippingAddress?.recipientName,
                order.shippingAddress?.phone,
            ]

            return searchableValues.some(value =>
                String(value || '').toLowerCase().includes(query)
            )
        })
    }, [orders, search])

    const orderStats = useMemo(() => {
        const all = orders.length
        const pending = orders.filter(
            order => order.status === 'Pending'
        ).length
        const inProgress = orders.filter(order =>
            ['Confirmed', 'Processing', 'Shipped'].includes(order.status)
        ).length
        const delivered = orders.filter(
            order => order.status === 'Delivered'
        ).length

        return { all, pending, inProgress, delivered }
    }, [orders])

    return (
        <main className="min-h-screen bg-[#F5F7FA] pb-12">
            {/* <header className="bg-[#172A43] text-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                            <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] text-[#C7D6C7]">
                                PAPER&PEN
                            </p>
                            <p className="mt-1 text-sm text-white/70">
                                Admin workspace
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/admin"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
            </header> */}

            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">

                <header className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-[#203653] p-6 text-white shadow-lg shadow-[#203653]/10 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8CFBA]">
                            <ShoppingBag size={16} />
                            BAHRIA STATIONERS ADMIN
                        </div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            Order Management
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                            Review customer orders, check delivery details and manage
                            order progress.
                        </p>
                    </div>

                    <Link
                        to="/admin"
                        className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 sm:self-center"
                    >
                        <ArrowLeft size={17} />
                        Dashboard
                    </Link>
                </header>

                {/* <div className="mb-8">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#58765D]">
                        Sales & fulfilment
                    </p>

                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#203653] sm:text-4xl">
                                Order Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Review customer orders, check delivery details and manage
                                order progress.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#203653] shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading || refreshing ? 'animate-spin' : ''
                                    }`}
                            />
                            Refresh Orders
                        </button>
                    </div>
                </div> */}

                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <div className="flex items-start gap-2.5">
                            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError('')}
                            aria-label="Dismiss error"
                            className="rounded-lg p-1 hover:bg-red-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {success && (
                    <div
                        role="status"
                        className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-[#77917A]/30 bg-[#77917A]/10 p-4 text-sm text-[#3F6146]"
                    >
                        <div className="flex items-start gap-2.5">
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                            <p>{success}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSuccess('')}
                            aria-label="Dismiss success message"
                            className="rounded-lg p-1 hover:bg-[#77917A]/15"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: 'Orders Loaded',
                            value: orderStats.all,
                            detail: 'Orders in current view',
                            icon: Package,
                            color: 'bg-blue-50 text-blue-700',
                        },
                        {
                            label: 'Pending',
                            value: orderStats.pending,
                            detail: 'Awaiting confirmation',
                            icon: Clock3,
                            color: 'bg-amber-50 text-amber-700',
                        },
                        {
                            label: 'In Progress',
                            value: orderStats.inProgress,
                            detail: 'Confirmed, processing or shipped',
                            icon: ArrowUpRight,
                            color: 'bg-indigo-50 text-indigo-700',
                        },
                        {
                            label: 'Delivered',
                            value: orderStats.delivered,
                            detail: 'Successfully delivered',
                            icon: CheckCircle2,
                            color: 'bg-[#77917A]/10 text-[#58765D]',
                        },
                    ].map(stat => {
                        const Icon = stat.icon

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {stat.label}
                                        </p>
                                        <p className="mt-3 text-3xl font-bold tracking-tight text-[#203653]">
                                            {loading ? '—' : stat.value.toLocaleString()}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">
                                    {stat.detail}
                                </p>
                            </div>
                        )
                    })}
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div>
                            <h2 className="text-xl font-bold text-[#203653]">
                                All Orders
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {loading
                                    ? 'Loading orders...'
                                    : `${visibleOrders.length} orders found`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="hidden text-sm font-medium text-slate-500 sm:inline">
                                Status
                            </span>
                            <div className="relative">
                                <select
                                    id="order-filter"
                                    value={filter}
                                    onChange={event => setFilter(event.target.value)}
                                    className="min-w-36 appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-[#203653] outline-none focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10"
                                >
                                    <option value="All">All Orders</option>
                                    {statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-slate-100 p-4 sm:px-6">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Search order number, customer, email or phone..."
                                aria-label="Search orders"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10 pr-4 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:bg-white focus:ring-4 focus:ring-[#77917A]/10"
                            />
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        {loading ? (
                            <div className="py-16 text-center">
                                <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#58765D]" />
                                <p className="mt-4 text-sm text-slate-500">
                                    Loading orders...
                                </p>
                            </div>
                        ) : visibleOrders.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                                    <ShoppingBag className="h-7 w-7" />
                                </div>
                                <h3 className="mt-4 font-bold text-[#203653]">
                                    No orders found
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Try a different status filter or search term.
                                </p>
                                {(search || filter !== 'All') && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('')
                                            setFilter('All')
                                        }}
                                        className="mt-4 text-sm font-semibold text-[#58765D] hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {visibleOrders.map(order => {
                                    const isExpanded = expandedId === order._id
                                    const address = order.shippingAddress || {}
                                    const items = order.items || []
                                    const status = order.status || 'Unknown'
                                    const followingStatus = nextStatus[status]

                                    return (
                                        <article
                                            key={order._id}
                                            className={`overflow-hidden rounded-2xl border transition ${isExpanded
                                                ? 'border-[#77917A]/50 shadow-sm'
                                                : 'border-slate-200'
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedId(current =>
                                                        current === order._id ? '' : order._id
                                                    )
                                                }
                                                aria-expanded={isExpanded}
                                                className="grid w-full gap-4 p-4 text-left transition hover:bg-slate-50/80 sm:p-5 lg:grid-cols-[1.2fr_1.3fr_1fr_0.8fr_auto] lg:items-center"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                        Order Number
                                                    </p>
                                                    <p className="mt-1.5 break-all font-bold text-[#203653]">
                                                        {getOrderNumber(order)}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {items.length} product type(s)
                                                    </p>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                        Customer
                                                    </p>
                                                    <p className="mt-1.5 truncate font-semibold text-[#203653]">
                                                        {order.user?.name || 'Customer'}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs text-slate-500">
                                                        {order.user?.email || 'No email'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                        Order Date
                                                    </p>
                                                    <p className="mt-1.5 text-sm font-medium text-slate-700">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                                        Subtotal
                                                    </p>
                                                    <p className="mt-1.5 font-bold text-[#203653]">
                                                        {formatPrice(order.subtotal)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                                                    <StatusBadge status={status} />
                                                    <span className="text-slate-400">
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-5 w-5" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5" />
                                                        )}
                                                    </span>
                                                </div>
                                            </button>

                                            <div className="flex justify-end border-t border-slate-100 bg-white px-4 py-3 sm:px-5">
                                                <button
                                                    type="button"
                                                    onClick={() => generateOrderSlip(order)}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#203653]/20 bg-white px-4 py-2.5 text-sm font-semibold text-[#203653] transition hover:bg-slate-50"
                                                >
                                                    <Printer size={17} />
                                                    Generate Slip
                                                </button>
                                            </div>

                                            {isExpanded && (
                                                <div className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-6">
                                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                                        <h3 className="text-lg font-bold text-[#203653]">
                                                            Order Details
                                                        </h3>
                                                        <StatusBadge status={status} />
                                                    </div>

                                                    <div className="mt-5 grid gap-5 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
                                                        <Detail
                                                            label="Order Number"
                                                            value={getOrderNumber(order)}
                                                        />
                                                        <Detail label="Order ID" value={order._id} />
                                                        <Detail
                                                            label="Order Placed"
                                                            value={formatDate(order.createdAt)}
                                                        />
                                                        <Detail
                                                            label="Last Updated"
                                                            value={formatDate(order.updatedAt)}
                                                        />
                                                        <Detail label="Current Status" value={status} />
                                                        <Detail
                                                            label="Subtotal"
                                                            value={formatPrice(order.subtotal)}
                                                        />
                                                    </div>

                                                    <div className="mt-8">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <h3 className="font-bold text-[#203653]">
                                                                Products Ordered
                                                            </h3>
                                                            <span className="text-xs font-medium text-slate-500">
                                                                {items.length} product type(s)
                                                            </span>
                                                        </div>

                                                        {items.length === 0 ? (
                                                            <p className="mt-3 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
                                                                Product details are not available for this order.
                                                            </p>
                                                        ) : (
                                                            <div className="mt-4 space-y-3">
                                                                {items.map((item, index) => (
                                                                    <div
                                                                        key={`${item.product || item.name || 'item'}-${index}`}
                                                                        className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                                                                    >
                                                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                                            {item.image ? (
                                                                                <img
                                                                                    src={item.image}
                                                                                    alt={item.name || 'Product'}
                                                                                    className="h-full w-full object-contain"
                                                                                />
                                                                            ) : (
                                                                                <Package className="h-6 w-6 text-slate-300" />
                                                                            )}
                                                                        </div>

                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="break-words font-semibold text-[#203653]">
                                                                                {item.name || 'Unnamed product'}
                                                                            </p>
                                                                            <p className="mt-1 text-xs text-slate-500">
                                                                                Unit price: {formatPrice(item.price)}
                                                                            </p>
                                                                            <p className="mt-1 text-xs text-slate-500">
                                                                                Quantity: {item.quantity ?? 0}
                                                                            </p>
                                                                        </div>

                                                                        <div className="ml-auto text-right">
                                                                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                                                Item Total
                                                                            </p>
                                                                            <p className="mt-1 font-bold text-[#203653]">
                                                                                {formatPrice(getItemTotal(item))}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-4 flex justify-end">
                                                            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4">
                                                                <div className="flex items-center justify-between gap-4">
                                                                    <span className="text-sm font-medium text-slate-500">
                                                                        Order Subtotal
                                                                    </span>
                                                                    <span className="text-lg font-bold text-[#203653]">
                                                                        {formatPrice(order.subtotal)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8">
                                                        <div className="mb-4 flex items-center gap-2">
                                                            <MapPin className="h-5 w-5 text-[#58765D]" />
                                                            <h3 className="font-bold text-[#203653]">
                                                                Delivery Address
                                                            </h3>
                                                        </div>

                                                        <div className="grid gap-5 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
                                                            <Detail
                                                                label="Recipient"
                                                                value={address.recipientName}
                                                            />
                                                            <Detail label="Phone" value={address.phone} />
                                                            <Detail
                                                                label="Address Label"
                                                                value={address.label}
                                                            />
                                                            <Detail label="Street" value={address.street} />
                                                            <Detail label="Area" value={address.area} />
                                                            <Detail label="City" value={address.city} />
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <Truck className="h-5 w-5 text-[#58765D]" />
                                                                    <h3 className="font-bold text-[#203653]">
                                                                        Manage Order Status
                                                                    </h3>
                                                                </div>
                                                                <p className="mt-2 text-sm text-slate-500">
                                                                    {followingStatus
                                                                        ? `Move this order to ${followingStatus}.`
                                                                        : status === 'Cancelled' ||
                                                                            status === 'Delivered'
                                                                            ? 'This order has reached its final status.'
                                                                            : 'No further status update is available.'}
                                                                </p>
                                                            </div>

                                                            {followingStatus && (
                                                                <div className='gap-2 flex'>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleStatusUpdate(order)}
                                                                        disabled={Boolean(updatingId)}
                                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#172A43] disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        {updatingId === order._id ? (
                                                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <ArrowUpRight className="h-4 w-4" />
                                                                        )}
                                                                        {updatingId === order._id
                                                                            ? 'Updating...'
                                                                            : `Move to ${followingStatus}`}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openWhatsAppConfirmation(order)}
                                                                        disabled={!address.phone}
                                                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#58765D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#46634B] disabled:cursor-not-allowed disabled:opacity-50"
                                                                    >
                                                                        <MessageCircle size={17} />
                                                                        Send Confirmation
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {followingStatus && (
                                                            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                                                                <span className="text-xs font-semibold text-slate-400">
                                                                    STATUS FLOW
                                                                </span>
                                                                <StatusBadge status={status} />
                                                                <ArrowDownRight className="h-4 w-4 text-slate-300" />
                                                                <StatusBadge status={followingStatus} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default AdminOrders
