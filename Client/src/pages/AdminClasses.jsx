import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    BookOpen,
    Building2,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    ClipboardList,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
    X,
    XCircle,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const AdminClasses = () => {
    const { token } = useAppContext()

    const [institutions, setInstitutions] = useState([])
    const [classes, setClasses] = useState([])
    const [institutionId, setInstitutionId] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [classToDelete, setClassToDelete] = useState(null)

    const [form, setForm] = useState({
        name: '',
        slug: '',
        sortOrder: 0,
    })

    const [loadingInstitutions, setLoadingInstitutions] = useState(true)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const request = useCallback(async (path, options = {}) => {
        const response = await fetch(`${API_URL}/api${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        })

        const result = await response.json().catch(() => ({}))

        if (!response.ok || result.success === false) {
            throw new Error(result.message || 'Request failed. Please try again.')
        }

        return result
    }, [token])

    const loadInstitutions = useCallback(async () => {
        setLoadingInstitutions(true)

        try {
            const result = await request('/institutions')
            setInstitutions(result.data || [])
        } catch (err) {
            setError(err.message || 'Unable to load institutions.')
        } finally {
            setLoadingInstitutions(false)
        }
    }, [request])

    const loadClasses = useCallback(async (id = institutionId) => {
        if (!id) {
            setClasses([])
            setLoading(false)
            return
        }

        setLoading(true)

        try {
            const result = await request(`/classes/institution/${id}`)
            setClasses(result.data || [])
        } catch (err) {
            setError(err.message || 'Unable to load classes.')
            setClasses([])
        } finally {
            setLoading(false)
        }
    }, [institutionId, request])

    useEffect(() => {
        loadInstitutions()
    }, [loadInstitutions])

    useEffect(() => {
        loadClasses(institutionId)
    }, [institutionId, loadClasses])

    useEffect(() => {
        if (!message) return

        const timeout = setTimeout(() => setMessage(''), 4000)
        return () => clearTimeout(timeout)
    }, [message])

    useEffect(() => {
        if (!classToDelete) return

        const handleEscape = (event) => {
            if (event.key === 'Escape' && !deleting) {
                setClassToDelete(null)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [classToDelete, deleting])

    const resetForm = () => {
        setForm({
            name: '',
            slug: '',
            sortOrder: 0,
        })
        setEditingId(null)
    }

    const clearNotices = () => {
        setMessage('')
        setError('')
    }

    const handleNameChange = (name) => {
        setForm((current) => ({
            ...current,
            name,
            slug: editingId
                ? current.slug
                : name
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, ''),
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        clearNotices()

        if (!institutionId) {
            setError('Please select an institution first.')
            return
        }

        if (!form.name.trim() || !form.slug.trim()) {
            setError('Class name and slug are required.')
            return
        }

        setSaving(true)

        try {
            if (editingId) {
                await request(`/classes/${editingId}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: form.name.trim(),
                        slug: form.slug.trim().toLowerCase(),
                        sortOrder: Number(form.sortOrder),
                    }),
                })

                setMessage('Class updated successfully.')
            } else {
                await request('/classes', {
                    method: 'POST',
                    body: JSON.stringify({
                        ...form,
                        name: form.name.trim(),
                        slug: form.slug.trim().toLowerCase(),
                        sortOrder: Number(form.sortOrder),
                        institutionId,
                    }),
                })

                setMessage('Class added successfully.')
            }

            resetForm()
            await loadClasses(institutionId)
        } catch (err) {
            setError(err.message || 'Unable to save class.')
        } finally {
            setSaving(false)
        }
    }

    const startEdit = (item) => {
        setEditingId(item._id)
        setForm({
            name: item.name || '',
            slug: item.slug || '',
            sortOrder: item.sortOrder ?? 0,
        })

        clearNotices()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deactivateClass = async () => {
        if (!classToDelete) return

        setDeleting(true)
        clearNotices()

        try {
            await request(`/classes/${classToDelete._id}`, {
                method: 'DELETE',
            })

            setMessage('Class deleted successfully.')

            if (editingId === classToDelete._id) {
                resetForm()
            }

            setClassToDelete(null)
            await loadClasses(institutionId)
        } catch (err) {
            setError(err.message || 'Unable to delete this class.')
        } finally {
            setDeleting(false)
        }
    }

    const handleInstitutionChange = (event) => {
        setInstitutionId(event.target.value)
        resetForm()
        clearNotices()
    }

    return (
        <main className="min-h-screen bg-[#F5F7FA] px-4 py-7 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <header className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-[#203653] p-6 text-white shadow-lg shadow-[#203653]/10 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8CFBA]">
                            <BookOpen size={16} />
                            BAHRIA STATIONERS ADMIN
                        </div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            Class Management
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                            Organize classes by institution and manage their display order.
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

                {/* Notifications */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 text-sm text-red-700 shadow-sm"
                    >
                        <CircleAlert size={19} className="mt-0.5 shrink-0" />
                        <p className="flex-1">{error}</p>
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
                        className="mb-5 flex items-center gap-3 rounded-2xl border border-[#D6E5D7] bg-white p-4 text-sm font-medium text-[#45664A] shadow-sm"
                    >
                        <CheckCircle2 size={19} className="shrink-0" />
                        <p className="flex-1">{message}</p>
                        <button
                            type="button"
                            aria-label="Dismiss message"
                            onClick={() => setMessage('')}
                            className="rounded-lg p-1 transition hover:bg-[#77917A]/10"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Institution Selection */}
                <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE8] text-[#58765D]">
                            <Building2 size={20} />
                        </span>

                        <div>
                            <h2 className="font-bold text-[#203653]">
                                Select Institution
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Choose which institution you want to manage.
                            </p>
                        </div>
                    </div>

                    <div className="relative max-w-xl">
                        <select
                            value={institutionId}
                            onChange={handleInstitutionChange}
                            disabled={loadingInstitutions}
                            className="w-full appearance-none rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 pr-11 text-sm font-medium text-[#203653] outline-none transition focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="">
                                {loadingInstitutions
                                    ? 'Loading institutions...'
                                    : 'Choose an institution'}
                            </option>

                            {institutions.map((institution) => (
                                <option key={institution._id} value={institution._id}>
                                    {institution.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                    </div>
                </section>

                {/* Add / Edit Form */}
                <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#203653] text-white">
                            {editingId ? <Pencil size={19} /> : <Plus size={21} />}
                        </span>

                        <div>
                            <h2 className="text-lg font-black text-[#203653] sm:text-xl">
                                {editingId ? 'Edit Class' : 'Add New Class'}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {editingId
                                    ? 'Update the selected class details.'
                                    : 'Create a class for the selected institution.'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 sm:p-6">
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label
                                    htmlFor="class-name"
                                    className="mb-2 block text-sm font-bold text-[#203653]"
                                >
                                    Class Name <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="class-name"
                                    required
                                    maxLength={100}
                                    value={form.name}
                                    onChange={(event) => handleNameChange(event.target.value)}
                                    placeholder="e.g. Class 9"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/15"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="class-slug"
                                    className="mb-2 block text-sm font-bold text-[#203653]"
                                >
                                    Slug <span className="text-red-500">*</span>
                                </label>

                                <input
                                    id="class-slug"
                                    required
                                    maxLength={100}
                                    value={form.slug}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            slug: event.target.value
                                                .toLowerCase()
                                                .trim()
                                                .replace(/\s+/g, '-'),
                                        }))
                                    }
                                    placeholder="e.g. class-9"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/15"
                                />

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Used in URLs and class references.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="sort-order"
                                    className="mb-2 block text-sm font-bold text-[#203653]"
                                >
                                    Sort Order
                                </label>

                                <input
                                    id="sort-order"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.sortOrder}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            sortOrder: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#203653] outline-none transition focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/15"
                                />

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Lower numbers appear first.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                            <button
                                type="submit"
                                disabled={saving || !institutionId || loadingInstitutions}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#203653] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2C4768] focus:outline-none focus:ring-4 focus:ring-[#203653]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : editingId ? (
                                    <CheckCircle2 size={17} />
                                ) : (
                                    <Plus size={18} />
                                )}

                                {saving
                                    ? 'Saving...'
                                    : editingId
                                        ? 'Save Changes'
                                        : 'Add Class'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm()
                                        clearNotices()
                                    }}
                                    disabled={saving}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    <X size={17} />
                                    Cancel Editing
                                </button>
                            )}
                        </div>

                        {!institutionId && (
                            <p className="mt-4 text-xs font-medium text-amber-700">
                                Select an institution before adding or editing classes.
                            </p>
                        )}
                    </form>
                </section>

                {/* Classes Table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5 sm:px-6">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8EFE8] text-[#58765D]">
                                <ClipboardList size={20} />
                            </span>

                            <div>
                                <h2 className="text-lg font-black text-[#203653] sm:text-xl">
                                    Active Classes
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    {institutionId
                                        ? `${classes.length} ${classes.length === 1 ? 'class' : 'classes'
                                        } listed`
                                        : 'Select an institution to view classes.'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                clearNotices()
                                loadClasses(institutionId)
                            }}
                            disabled={!institutionId || loading}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#203653] transition hover:border-[#77917A] hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={15}
                                className={loading ? 'animate-spin' : ''}
                            />
                            Refresh
                        </button>
                    </div>

                    {!institutionId ? (
                        <div className="px-5 py-14 text-center">
                            <Building2
                                size={35}
                                className="mx-auto text-slate-300"
                                strokeWidth={1.6}
                            />
                            <p className="mt-4 font-semibold text-[#203653]">
                                No institution selected
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Select an institution above to manage its classes.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="px-5 py-14 text-center">
                            <LoaderCircle
                                size={30}
                                className="mx-auto animate-spin text-[#58765D]"
                            />
                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Loading classes...
                            </p>
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="px-5 py-14 text-center">
                            <BookOpen
                                size={36}
                                className="mx-auto text-slate-300"
                                strokeWidth={1.6}
                            />
                            <p className="mt-4 font-bold text-[#203653]">
                                No active classes found
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                Add the first class using the form above.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[650px] text-left">
                                <thead className="bg-[#F5F7FA]">
                                    <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        <th className="px-5 py-4 sm:px-6">Class</th>
                                        <th className="px-5 py-4">Slug</th>
                                        <th className="px-5 py-4">Sort Order</th>
                                        <th className="px-5 py-4 text-right sm:px-6">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {classes.map((item) => (
                                        <tr
                                            key={item._id}
                                            className="transition-colors hover:bg-[#F8FAFC]"
                                        >
                                            <td className="px-5 py-4 sm:px-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE8] text-[#58765D]">
                                                        <BookOpen size={18} />
                                                    </span>

                                                    <span className="font-bold text-[#203653]">
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                                                    {item.slug}
                                                </code>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="inline-flex min-w-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-600">
                                                    {item.sortOrder ?? 0}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 sm:px-6">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => startEdit(item)}
                                                        disabled={saving || deleting}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8D0F0] bg-[#F4F0FF] px-3 py-2 text-xs font-bold text-[#6547A5] transition hover:bg-[#EAE2FF] disabled:opacity-50"
                                                    >
                                                        <Pencil size={14} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            clearNotices()
                                                            setClassToDelete(item)
                                                        }}
                                                        disabled={saving || deleting}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Delete Confirmation Modal */}
                {classToDelete && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101D2E]/60 px-4 py-6 backdrop-blur-sm"
                        onMouseDown={(event) => {
                            if (
                                event.target === event.currentTarget &&
                                !deleting
                            ) {
                                setClassToDelete(null)
                            }
                        }}
                    >
                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="delete-class-title"
                            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                                <p className="text-sm font-bold text-[#203653]">
                                    Delete Class
                                </p>

                                <button
                                    type="button"
                                    aria-label="Close confirmation"
                                    disabled={deleting}
                                    onClick={() => setClassToDelete(null)}
                                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="px-5 py-7 text-center sm:px-7">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <Trash2 size={29} />
                                </div>

                                <h2
                                    id="delete-class-title"
                                    className="mt-5 text-xl font-black text-[#203653]"
                                >
                                    Delete this class?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Are you sure you want to delete{' '}
                                    <span className="font-bold text-[#203653]">
                                        {classToDelete.name}
                                    </span>
                                    ? It may no longer appear in active class lists.
                                </p>

                                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        disabled={deleting}
                                        onClick={() => setClassToDelete(null)}
                                        className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Keep Class
                                    </button>

                                    <button
                                        type="button"
                                        disabled={deleting}
                                        onClick={deactivateClass}
                                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {deleting ? (
                                            <>
                                                <LoaderCircle size={16} className="animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <XCircle size={16} />
                                                Delete Class
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    )
}

export default AdminClasses
