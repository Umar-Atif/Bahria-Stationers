import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    BookOpen,
    Boxes,
    Check,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    ImagePlus,
    LoaderCircle,
    Package,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShoppingBag,
    Trash2,
    X,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const initialForm = {
    name: '',
    slug: '',
    description: '',
    category: 'Stationery',
    price: '',
    stock: '',
    institution: '',
    classes: [],
}

const categories = ['Stationery', 'Books', 'Copies']

const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10 disabled:cursor-not-allowed disabled:bg-slate-100'

function AdminProducts() {
    const { token } = useAppContext()

    const [products, setProducts] = useState([])
    const [institutions, setInstitutions] = useState([])
    const [classes, setClasses] = useState([])
    const [form, setForm] = useState(initialForm)
    const [image, setImage] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')

    const [loading, setLoading] = useState(true)
    const [loadingInstitutions, setLoadingInstitutions] = useState(true)
    const [loadingClasses, setLoadingClasses] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function fetchProducts() {
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/products`)
            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to load products.')
            }

            setProducts(data.data || [])
        } catch (err) {
            setError(err.message || 'Unable to load products.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        let cancelled = false

        async function fetchInstitutions() {
            try {
                const response = await fetch(`${API_URL}/api/institutions`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Unable to load institutions.')
                }

                if (!cancelled) {
                    setInstitutions(data.data || [])
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Unable to load institutions.')
                }
            } finally {
                if (!cancelled) setLoadingInstitutions(false)
            }
        }

        fetchInstitutions()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        if (form.category === 'Stationery' || !form.institution) {
            setClasses([])
            setLoadingClasses(false)

            return () => {
                cancelled = true
            }
        }

        async function fetchClasses() {
            setLoadingClasses(true)

            try {
                const response = await fetch(
                    `${API_URL}/api/classes/institution/${form.institution}`
                )
                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Unable to load classes.')
                }

                if (!cancelled) {
                    setClasses(data.data || [])
                }
            } catch (err) {
                if (!cancelled) {
                    setClasses([])
                    setError(err.message || 'Unable to load classes.')
                }
            } finally {
                if (!cancelled) setLoadingClasses(false)
            }
        }

        fetchClasses()

        return () => {
            cancelled = true
        }
    }, [form.institution, form.category])

    // function handleChange(event) {
    //     const { name, value } = event.target

    //     setForm(current => {
    //         if (name === 'category') {
    //             return {
    //                 ...current,
    //                 category: value,
    //                 institution: '',
    //                 classes: [],
    //             }
    //         }

    //         if (name === 'institution') {
    //             return {
    //                 ...current,
    //                 institution: value,
    //                 classes: [],
    //             }
    //         }

    //         return {
    //             ...current,
    //             [name]: value,
    //         }
    //     })
    // }


    function handleChange(event) {
        const { name, value } = event.target

        setForm(current => {
            if (name === 'category') {
                return {
                    ...current,
                    category: value,
                    institution: '',
                    class: '',
                }
            }

            if (name === 'institution') {
                return {
                    ...current,
                    institution: value,
                    class: '',
                }
            }

            if (name === 'name') {
                return {
                    ...current,
                    name: value,
                    slug: value
                        .toLowerCase()
                        .trim()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-'),
                }
            }

            return {
                ...current,
                [name]: value,
            }
        })
    }


    function resetForm() {
        setForm(initialForm)
        setImage(null)
        setEditingId(null)

        const fileInput = document.getElementById('product-image')
        if (fileInput) fileInput.value = ''
    }

    function startEditing(product) {
        setError('')
        setSuccess('')
        setEditingId(product._id)
        setImage(null)

        setForm({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            category: product.category || 'Stationery',
            price: String(product.price ?? ''),
            stock: String(product.stock ?? ''),
            institution:
                product.institution?._id || product.institution || '',
            classes: (product.classes?.length
                ? product.classes
                : product.class
                    ? [product.class]
                    : []
            ).map(item => typeof item === 'object' ? item._id : item),
        })

        const fileInput = document.getElementById('product-image')
        if (fileInput) fileInput.value = ''

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSuccess('')

        if (!token) {
            setError('Admin login required.')
            return
        }

        if (
            form.category !== 'Stationery' &&
            (!form.institution || form.classes.length === 0)
        ) {
            setError('Please select an institution and at least one class.')
            return
        }

        setSaving(true)

        try {
            const formData = new FormData()

            Object.entries(form).forEach(([key, value]) => {
                if (key === 'classes') {
                    formData.append('classes', JSON.stringify(value))
                } else {
                    formData.append(key, value)
                }
            })

            if (image) {
                formData.append('image', image)
            }

            const url = editingId
                ? `${API_URL}/api/products/${editingId}`
                : `${API_URL}/api/products`

            const response = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    (editingId
                        ? 'Unable to update product.'
                        : 'Unable to add product.')
                )
            }

            const wasEditing = Boolean(editingId)
            if (wasEditing) {
                resetForm()
            }

            setSuccess(
                wasEditing
                    ? 'Product updated successfully.'
                    : 'Product added successfully.'
            )

            await fetchProducts()
        } catch (err) {
            setError(err.message || 'The request could not be completed.')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (!deleteTarget || !token) {
            if (!token) setError('Admin login required.')
            return
        }

        const product = deleteTarget
        setError('')
        setSuccess('')
        setDeletingId(product._id)

        try {
            const response = await fetch(
                `${API_URL}/api/products/${product._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Unable to delete product.')
            }

            setProducts(current =>
                current.filter(item => item._id !== product._id)
            )

            if (editingId === product._id) resetForm()

            setDeleteTarget(null)
            setSuccess('Product deleted successfully.')
        } catch (err) {
            setError(err.message || 'Unable to delete product.')
        } finally {
            setDeletingId(null)
        }
    }

    function getInstitutionName(product) {
        if (!product.institution) return 'Unassigned'

        if (typeof product.institution === 'object') {
            return product.institution.name || 'Unassigned'
        }

        return (
            institutions.find(item => item._id === product.institution)?.name ||
            'Unassigned'
        )
    }

    function getClassName(product) {
        // New products use classes[]; the class fallback supports older records.
        const assignedClasses = product.classes?.length
            ? product.classes
            : product.class
                ? [product.class]
                : []

        if (!assignedClasses.length) return 'Unassigned'

        return assignedClasses.map(item => {
            if (typeof item === 'object') return item.name || 'Unknown class'
            return classes.find(classItem => classItem._id === item)?.name || 'Unknown class'
        }).join(', ')
    }

    const stationeryProducts = products.filter(
        product => product.category === 'Stationery'
    )

    const booksAndCopies = products.filter(product =>
        ['Books', 'Copies'].includes(product.category)
    )

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase()

        return products.filter(product => {
            const matchesSearch =
                !query ||
                [product.name, product.slug, product.category]
                    .filter(Boolean)
                    .some(value => value.toLowerCase().includes(query))

            const matchesCategory =
                categoryFilter === 'All' || product.category === categoryFilter

            return matchesSearch && matchesCategory
        })
    }, [products, search, categoryFilter])

    const filteredStationery = filteredProducts.filter(
        product => product.category === 'Stationery'
    )

    const filteredBooksAndCopies = filteredProducts.filter(product =>
        ['Books', 'Copies'].includes(product.category)
    )

    const groupedProducts = filteredBooksAndCopies.reduce((groups, product) => {
        const institutionName = getInstitutionName(product)
        const className = getClassName(product)
        const key = `${institutionName}|||${className}`

        if (!groups[key]) {
            groups[key] = {
                institution: institutionName,
                className,
                products: [],
            }
        }

        groups[key].products.push(product)
        return groups
    }, {})

    const totalStock = products.reduce(
        (total, product) => total + (Number(product.stock) || 0),
        0
    )

    const lowStockCount = products.filter(
        product => Number(product.stock) <= 5
    ).length

    function renderProductTable(items) {
        if (!items.length) {
            return (
                <div className="px-5 py-12 text-center">
                    <Package className="mx-auto mb-3 h-9 w-9 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                        No products in this section.
                    </p>
                </div>
            )
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-5 py-4 font-semibold">Product</th>
                            <th className="px-4 py-4 font-semibold">Category</th>
                            <th className="px-4 py-4 font-semibold">Price</th>
                            <th className="px-4 py-4 font-semibold">Stock</th>
                            <th className="px-5 py-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {items.map(product => (
                            <tr
                                key={product._id}
                                className="transition hover:bg-slate-50/70"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Package className="h-5 w-5 text-slate-400" />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-[#203653]">
                                                {product.name}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {product.slug || 'No slug'}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                                        {product.category}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#203653]">
                                    Rs. {Number(product.price || 0).toLocaleString()}
                                </td>

                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${Number(product.stock) <= 5
                                            ? 'bg-amber-50 text-amber-700'
                                            : 'bg-[#77917A]/10 text-[#58765D]'
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${Number(product.stock) <= 5
                                                ? 'bg-amber-500'
                                                : 'bg-[#77917A]'
                                                }`}
                                        />
                                        {product.stock} units
                                    </span>
                                </td>

                                <td className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(product)}
                                            aria-label={`Edit ${product.name}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#203653] transition hover:border-[#77917A] hover:bg-[#77917A]/10"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(product)}
                                            disabled={deletingId === product._id}
                                            aria-label={`Delete ${product.name}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    function renderSection(title, subtitle, items, icon) {
        const Icon = icon

        return (
            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#77917A]/10 text-[#58765D]">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#203653]">{title}</h3>
                            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                        </div>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {items.length} products
                    </span>
                </div>

                {renderProductTable(items)}
            </section>
        )
    }

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
                            <p className="mt-1 text-sm text-white/70">Admin workspace</p>
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
                            Product Management
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                            Manage your stationery, books and copies from one place.
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
                        Inventory control
                    </p>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#203653] sm:text-4xl">
                                Product Management
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Manage your stationery, books and copies from one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setError('')
                                setSuccess('')
                                resetForm()
                                document
                                    .getElementById('product-form')
                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#203653] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#172A43]"
                        >
                            <Plus className="h-4 w-4" />
                            Add Product
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

                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: 'Total Products',
                            value: products.length,
                            icon: Package,
                            detail: 'Products in inventory',
                        },
                        {
                            label: 'Stationery',
                            value: stationeryProducts.length,
                            icon: ShoppingBag,
                            detail: 'Stationery products',
                        },
                        {
                            label: 'Books & Copies',
                            value: booksAndCopies.length,
                            icon: BookOpen,
                            detail: 'Academic supplies',
                        },
                        {
                            label: 'Low Stock',
                            value: lowStockCount,
                            icon: Boxes,
                            detail: `${totalStock.toLocaleString()} total units`,
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
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#77917A]/10 text-[#58765D]">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">{stat.detail}</p>
                            </div>
                        )
                    })}
                </section>

                <section
                    id="product-form"
                    className="mb-8 scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                >
                    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#203653] text-white">
                            {editingId ? (
                                <Pencil className="h-5 w-5" />
                            ) : (
                                <Plus className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#203653]">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? 'Update the details below and save your changes.'
                                    : 'Enter the product details to add it to your inventory.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-7">
                        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="product-name"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="product-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="e.g. Blue Ball Pen"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="product-slug"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="product-slug"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="e.g. blue-ball-pen"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="product-category"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="product-category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} appearance-none pr-10`}
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="product-price"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="product-price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="product-stock"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="product-stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.stock}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                    placeholder="0"
                                />
                            </div>

                            {form.category !== 'Stationery' && (
                                <>
                                    <div>
                                        <label
                                            htmlFor="product-institution"
                                            className="mb-2 block text-sm font-semibold text-[#203653]"
                                        >
                                            Institution <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="product-institution"
                                                name="institution"
                                                value={form.institution}
                                                onChange={handleChange}
                                                required
                                                disabled={loadingInstitutions}
                                                className={`${inputClass} appearance-none pr-10`}
                                            >
                                                <option value="">
                                                    {loadingInstitutions
                                                        ? 'Loading institutions...'
                                                        : 'Select Institution'}
                                                </option>
                                                {institutions.map(institution => (
                                                    <option
                                                        key={institution._id}
                                                        value={institution._id}
                                                    >
                                                        {institution.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 lg:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold text-[#203653]">
                                            Classes <span className="text-red-500">*</span>
                                        </label>

                                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                                            {!form.institution ? (
                                                <p className="text-sm text-slate-500">Select institution first.</p>
                                            ) : loadingClasses ? (
                                                <p className="text-sm text-slate-500">Loading classes...</p>
                                            ) : classes.length === 0 ? (
                                                <p className="text-sm text-slate-500">No classes available for this institution.</p>
                                            ) : (
                                                <>
                                                    <p className="mb-3 text-xs text-slate-500">
                                                        Select every class that can use this product.
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                        {classes.map(item => (
                                                            <label
                                                                key={item._id}
                                                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm text-[#203653] transition hover:bg-slate-50"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={form.classes.includes(item._id)}
                                                                    onChange={event => {
                                                                        setForm(current => ({
                                                                            ...current,
                                                                            classes: event.target.checked
                                                                                ? [...current.classes, item._id]
                                                                                : current.classes.filter(id => id !== item._id),
                                                                        }))
                                                                    }}
                                                                    className="h-4 w-4 accent-[#203653]"
                                                                />
                                                                <span>{item.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">
                                            {form.classes.length} class(es) selected
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label
                                    htmlFor="product-description"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="product-description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`${inputClass} resize-y`}
                                    placeholder="Describe the product, its features and intended use..."
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-3">
                                <label
                                    htmlFor="product-image"
                                    className="mb-2 block text-sm font-semibold text-[#203653]"
                                >
                                    Product Image
                                </label>

                                <label
                                    htmlFor="product-image"
                                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-5 py-7 text-center transition hover:border-[#77917A] hover:bg-[#77917A]/5"
                                >
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#58765D] shadow-sm">
                                        <ImagePlus className="h-6 w-6" />
                                    </div>
                                    <span className="text-sm font-semibold text-[#203653]">
                                        {image ? image.name : 'Choose an image'}
                                    </span>
                                    <span className="mt-1 text-xs text-slate-500">
                                        {editingId
                                            ? 'Optional — choose a new image to replace the current one.'
                                            : 'Optional — upload a product image.'}
                                    </span>
                                    <input
                                        id="product-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={event =>
                                            setImage(event.target.files?.[0] || null)
                                        }
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                            <button
                                type="submit"
                                disabled={
                                    saving ||
                                    loadingInstitutions ||
                                    loadingClasses ||
                                    (form.category !== 'Stationery' &&
                                        (!form.institution || form.classes.length === 0))
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203653] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#172A43] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : editingId ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {saving
                                    ? 'Saving...'
                                    : editingId
                                        ? 'Update Product'
                                        : 'Add Product'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-[#203653]">
                                Existing Products
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Search, review and manage your inventory.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchProducts}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#203653] shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                            />
                            Refresh
                        </button>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                                placeholder="Search by product name, slug or category..."
                                aria-label="Search products"
                                className={`${inputClass} pl-10`}
                            />
                        </div>

                        <div className="relative sm:w-52">
                            <select
                                value={categoryFilter}
                                onChange={event => setCategoryFilter(event.target.value)}
                                aria-label="Filter products by category"
                                className={`${inputClass} appearance-none pr-10`}
                            >
                                <option value="All">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                            <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-[#58765D]" />
                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Loading products...
                            </p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                                <Package className="h-7 w-7" />
                            </div>
                            <h3 className="mt-4 font-bold text-[#203653]">
                                No products found
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Try a different search term or category.
                            </p>
                            {(search || categoryFilter !== 'All') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('')
                                        setCategoryFilter('All')
                                    }}
                                    className="mt-4 text-sm font-semibold text-[#58765D] hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {(categoryFilter === 'All' ||
                                categoryFilter === 'Stationery') &&
                                renderSection(
                                    'Stationery',
                                    'Pens, pencils and everyday supplies',
                                    filteredStationery,
                                    ShoppingBag
                                )}

                            {(categoryFilter === 'All' ||
                                categoryFilter === 'Books' ||
                                categoryFilter === 'Copies') && (
                                    <section className="space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#77917A]/10 text-[#58765D]">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#203653]">
                                                    Books & Copies
                                                </h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Academic products organized by institution and class
                                                </p>
                                            </div>
                                        </div>

                                        {filteredBooksAndCopies.length === 0 ? (
                                            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
                                                No books or copies match the current filters.
                                            </div>
                                        ) : (
                                            <div className="space-y-5">
                                                {Object.values(groupedProducts)
                                                    .sort(
                                                        (a, b) =>
                                                            a.institution.localeCompare(b.institution) ||
                                                            a.className.localeCompare(b.className)
                                                    )
                                                    .map(group => (
                                                        <div
                                                            key={`${group.institution}|||${group.className}`}
                                                            className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
                                                        >
                                                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                                                                <div>
                                                                    <p className="font-bold text-[#203653]">
                                                                        {group.institution}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        Class: {group.className}
                                                                    </p>
                                                                </div>
                                                                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                                                    {group.products.length} products
                                                                </span>
                                                            </div>
                                                            {renderProductTable(group.products)}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </section>
                                )}
                        </>
                    )}
                </section>
            </div>

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A43]/60 p-4 backdrop-blur-sm"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget && !deletingId) {
                            setDeleteTarget(null)
                        }
                    }}
                    onKeyDown={event => {
                        if (event.key === 'Escape' && !deletingId) {
                            setDeleteTarget(null)
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 className="h-6 w-6" />
                        </div>

                        <h2
                            id="delete-dialog-title"
                            className="mt-5 text-xl font-bold text-[#203653]"
                        >
                            Delete Product?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-[#203653]">
                                {deleteTarget.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                disabled={Boolean(deletingId)}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={Boolean(deletingId)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingId ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                {deletingId ? 'Deleting...' : 'Delete Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default AdminProducts