import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Eye, EyeOff } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAppContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Admin login failed')
      }

      if (!data.token || data.admin?.role !== 'admin') {
        throw new Error('Invalid admin login response')
      }

      login(data.admin, data.token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#F5F7FA] px-4 py-12 sm:px-6 lg:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#77917A]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#203653]/10 blur-3xl"
      />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#203653] p-6 text-white sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 top-20 h-56 w-56 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -right-10 top-32 h-36 w-36 rounded-full border border-white/10"
          />

          <div className="relative">

            <div className="mb-8 flex items-center gap-2 sm:gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-[#203653] sm:h-11 sm:w-11">
                B
              </div>

              <span className="min-w-0 text-sm font-bold tracking-tight text-white sm:text-lg lg:text-xl leading-tight">
                BAHRIA STATIONERS
              </span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D7E4D8]">
              <span className="h-2 w-2 rounded-full bg-[#A9C2AB]" />
              Admin Portal
            </span>

            <h1 className="mt-6 max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
              Manage your store with confidence.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300 sm:text-base">
              Access your administration dashboard to manage products,
              orders, and store operations in one place.
            </p>
          </div>

          <div className="relative mt-12 border-t border-white/15 pt-6">
            <p className="text-sm font-medium text-white">
              Your stationery store, organized.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              BAHRIA STATIONERS Administration
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#77917A]/15 text-[#58765D]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3 19 6v5c0 4.5-2.9 7.8-7 10-4.1-2.2-7-5.5-7-10V6l7-3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 12 2 2 4-4"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#203653] sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in with your administrator credentials to continue.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 h-5 w-5 shrink-0"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  strokeLinecap="round"
                  d="M12 8v5m0 3h.01"
                />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="admin@example.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#58765D] focus:ring-4 focus:ring-[#77917A]/15"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#58765D] focus:ring-4 focus:ring-[#77917A]/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 rounded-r-xl px-4 text-xs font-semibold text-[#203653] transition"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#203653] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#203653]/15 transition hover:bg-[#2B4668] focus:outline-none focus:ring-4 focus:ring-[#203653]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />
                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-90"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Admin
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-200 bg-[#F5F7FA] p-4">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#58765D]"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"
              />
            </svg>
            <p className="text-xs leading-5 text-slate-500">
              This area is restricted to authorized administrators.
              Keep your login credentials secure.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminLogin
