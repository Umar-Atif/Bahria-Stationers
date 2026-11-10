import schoolImage from '../assets/school-image.avif'
import collegeImage from '../assets/college-image.avif'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    GraduationCap,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    School,
    Trash2,
    X,
    XCircle,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const fallbackImages = {
    school: schoolImage,
    college: collegeImage
}

const initialForm = {
    name: '',
    slug: '',
    type: 'school',
    image: '',
}

function getFallbackImage(type) {
    return fallbackImages[type] || fallbackImages.school
}

function InstitutionImage({ src, type, name, className = '' }) {
    const [imageSrc, setImageSrc] = useState(
        src?.trim() || getFallbackImage(type)
    )

    useEffect(() => {
        setImageSrc(src?.trim() || getFallbackImage(type))
    }, [src, type])

    return (
        <img
            src={imageSrc}
            alt={name || 'Institution'}
            onError={() => {
                const fallback = getFallbackImage(type)

                if (imageSrc !== fallback) {
                    setImageSrc(fallback)
                }
            }}
            className={className}
            loading="lazy"
        />
    )
}

function AdminInstitutions() {
    const { token } = useAppContext()

    const [institutions, setInstitutions] = useState([])
    const [form, setForm] = useState(initialForm)
    const [editingId, setEditingId] = useState(null)
    const [deletingInstitution, setDeletingInstitution] = useState(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    async function fetchInstitutions() {
        setLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_URL}/api/institutions`)
            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to load institutions.')
            }

            setInstitutions(Array.isArray(data.data) ? data.data : [])
        } catch (err) {
            setError(err.message || 'Failed to load institutions.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchInstitutions()
    }, [])

    function handleChange(e) {
        const { name, value } = e.target
        setForm(current => ({ ...current, [name]: value }))
    }

    function resetForm() {
        setForm(initialForm)
        setEditingId(null)
    }

    function startEditing(institution) {
        setError('')
        setSuccess('')
        setEditingId(institution._id)

        setForm({
            name: institution.name || '',
            slug: institution.slug || '',
            type: institution.type || 'school',
            image: institution.image || '',
        })

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!token) {
            setError('Admin login required.')
            return
        }

        setSaving(true)

        try {
            const url = editingId
                ? `${API_URL}/api/institutions/${editingId}`
                : `${API_URL}/api/institutions`

            const response = await fetch(url, {
                method: editingId ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    slug: form.slug.trim().toLowerCase(),
                    type: form.type,
                    image: form.image.trim(),
                }),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    (editingId
                        ? 'Failed to update institution.'
                        : 'Failed to add institution.')
                )
            }

            const wasEditing = Boolean(editingId)
            resetForm()

            setSuccess(
                wasEditing
                    ? 'Institution updated successfully.'
                    : 'Institution added successfully.'
            )

            await fetchInstitutions()
        } catch (err) {
            setError(err.message || 'The request could not be completed.')
        } finally {
            setSaving(false)
        }
    }

    async function handleDeactivate() {
        if (!deletingInstitution || !token) {
            setError('Admin login required.')
            setDeletingInstitution(null)
            return
        }

        const institution = deletingInstitution
        setError('')
        setSuccess('')

        try {
            setDeletingId(institution._id)

            const response = await fetch(
                `${API_URL}/api/institutions/${institution._id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data = await response.json()

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to delete institution.')
            }

            setInstitutions(current =>
                current.filter(item => item._id !== institution._id)
            )

            if (editingId === institution._id) {
                resetForm()
            }

            setSuccess('Institution deleted successfully.')
            setDeletingInstitution(null)
        } catch (err) {
            setError(err.message || 'Failed to delete institution.')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <main className="min-h-screen bg-[#F5F7FA] px-4 py-8 text-[#203653] sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#77917A]">
                            PAPER&PEN ADMIN
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            Institution Management
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage schools and colleges displayed in your store.
                        </p>
                    </div>

                    <Link
                        to="/admin"
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#77917A] hover:bg-slate-50"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>
                </header> */}

                <header className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-[#203653] p-6 text-white shadow-lg shadow-[#203653]/10 sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8CFBA]">
                            <School size={16} />
                            BAHRIA STATIONERS ADMIN
                        </div>

                        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                            Institution Management
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
                            Manage schools and colleges displayed in your store.
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

                {(error || success) && (
                    <div
                        role={error ? 'alert' : 'status'}
                        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 ${error
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-[#D6E4D7] bg-[#EEF5EE] text-[#58765D]'
                            }`}
                    >
                        {error ? (
                            <XCircle size={20} className="mt-0.5 shrink-0" />
                        ) : (
                            <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                        )}

                        <p className="flex-1 text-sm font-medium">
                            {error || success}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setError('')
                                setSuccess('')
                            }}
                            aria-label="Dismiss notification"
                            className="rounded-lg p-1 transition hover:bg-black/5"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF5EE] text-[#58765D]">
                                {editingId ? <Pencil size={21} /> : <Plus size={22} />}
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">
                                    {editingId ? 'Edit Institution' : 'Add Institution'}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {editingId
                                        ? 'Update institution details and image.'
                                        : 'Add a school or college to your store.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-5 p-5 sm:grid-cols-2 sm:p-7">
                        <div>
                            <label
                                htmlFor="institution-name"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Institution Name *
                            </label>

                            <input
                                id="institution-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                maxLength={120}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10"
                                placeholder="e.g. City School"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="institution-slug"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Slug *
                            </label>

                            <input
                                id="institution-slug"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                required
                                maxLength={120}
                                pattern="[a-zA-Z0-9-]+"
                                title="Use letters, numbers, and hyphens only."
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10"
                                placeholder="e.g. city-school"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="institution-type"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Institution Type *
                            </label>

                            <select
                                id="institution-type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10"
                            >
                                <option value="school">School</option>
                                <option value="college">College</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="institution-image"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Image URL
                                <span className="ml-2 font-normal text-slate-400">
                                    (Optional)
                                </span>
                            </label>

                            <input
                                id="institution-image"
                                name="image"
                                type="url"
                                value={form.image}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-[#77917A] focus:ring-4 focus:ring-[#77917A]/10"
                                placeholder="https://example.com/image.jpg"
                            />

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Leave empty to use the default image for the selected type.
                            </p>
                        </div>

                        {/* <div className="sm:col-span-2">
                            <p className="mb-2 text-sm font-semibold text-slate-700">
                                Image Preview
                            </p>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                <InstitutionImage
                                    src={form.image}
                                    type={form.type}
                                    name={form.name || 'Institution image preview'}
                                    className="h-44 w-full object-cover sm:h-52"
                                />
                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Preview automatically switches to a fallback image if the URL
                                is empty or the image fails to load.
                            </p>
                        </div> */}

                        <div className="flex flex-wrap gap-3 pt-1 sm:col-span-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#203653] px-6 py-3 font-semibold text-white transition hover:bg-[#172A43] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? (
                                    <LoaderCircle size={18} className="animate-spin" />
                                ) : editingId ? (
                                    <Pencil size={18} />
                                ) : (
                                    <Plus size={19} />
                                )}

                                {saving
                                    ? 'Saving...'
                                    : editingId
                                        ? 'Update Institution'
                                        : 'Add Institution'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F7] text-[#203653]">
                                <Building2 size={22} />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold">Active Institutions</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {institutions.length}{' '}
                                    {institutions.length === 1 ? 'institution' : 'institutions'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchInstitutions}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? 'animate-spin' : ''}
                            />
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>
                    </div>

                    <div className="p-5 sm:p-7">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                <LoaderCircle size={30} className="mb-3 animate-spin text-[#77917A]" />
                                <p className="text-sm">Loading institutions...</p>
                            </div>
                        ) : institutions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
                                <Building2 size={36} className="mb-3 text-slate-300" />
                                <h3 className="font-semibold text-slate-700">
                                    No institutions found
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Add your first school or college using the form above.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {institutions.map(institution => (
                                    <article
                                        key={institution._id}
                                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-[#C9D8CA] hover:shadow-lg hover:shadow-slate-200/50"
                                    >
                                        <div className="relative overflow-hidden bg-slate-100">
                                            <InstitutionImage
                                                src={institution.image}
                                                type={institution.type}
                                                name={institution.name}
                                                className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                            />

                                            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-xs font-bold capitalize text-[#203653] shadow-sm">
                                                {institution.type === 'college' ? (
                                                    <GraduationCap size={14} />
                                                ) : (
                                                    <School size={14} />
                                                )}
                                                {institution.type || 'School'}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <h3 className="break-words text-lg font-bold text-[#203653]">
                                                {institution.name}
                                            </h3>

                                            <p className="mt-1 break-all text-sm text-slate-500">
                                                Slug: {institution.slug}
                                            </p>

                                            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditing(institution)}
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#EEF2F7] px-3 py-2.5 text-sm font-semibold text-[#203653] transition hover:bg-[#E0E7F0]"
                                                >
                                                    <Pencil size={15} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setDeletingInstitution(institution)}
                                                    disabled={deletingId === institution._id}
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                                >
                                                    {deletingId === institution._id ? (
                                                        <LoaderCircle size={15} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={15} />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {deletingInstitution && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#172A43]/60 p-4 backdrop-blur-sm"
                    onMouseDown={e => {
                        if (e.target === e.currentTarget && !deletingId) {
                            setDeletingInstitution(null)
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-institution-title"
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={23} />
                        </div>

                        <h2
                            id="delete-institution-title"
                            className="mt-4 text-xl font-bold text-[#203653]"
                        >
                            Delete Institution?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-slate-800">
                                {deletingInstitution.name}
                            </span>
                            ? This institution will be removed from the active list.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeletingInstitution(null)}
                                disabled={Boolean(deletingId)}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeactivate}
                                disabled={Boolean(deletingId)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingId ? (
                                    <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                    <Trash2 size={17} />
                                )}
                                {deletingId ? 'Deleting...' : 'Delete Institution'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default AdminInstitutions
