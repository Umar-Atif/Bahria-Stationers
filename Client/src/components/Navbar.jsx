import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
    ShoppingBasket,
    UserRound,
    Menu,
    X,
    Package,
    Settings,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    School,
    BookOpen,
    ShoppingCart,
    Store,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const { isLoggedIn, user, logout } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()
    const profileRef = useRef(null)

    const isAdmin = isLoggedIn && user?.role === 'admin'

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false)
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setProfileOpen(false)
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        setProfileOpen(false)
    }, [location.pathname])

    const closeMenus = () => {
        setMenuOpen(false)
        setProfileOpen(false)
    }

    const handleLogout = () => {
        logout()
        closeMenus()
        navigate(isAdmin ? '/admin/login' : '/', { replace: true })
    }

    const customerLinks = [
        { label: 'Home', to: '/' },
        { label: 'Categories', to: '/categories' },
        { label: 'Stationery', to: '/stationery' },
    ]

    const adminLinks = [
        { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
        { label: 'Orders', to: '/admin/orders', icon: ShoppingCart },
        { label: 'Products', to: '/admin/products', icon: Package },
        { label: 'Institutions', to: '/admin/institutions', icon: School },
        { label: 'Classes', to: '/admin/classes', icon: BookOpen },
    ]

    const navLinkClass =
        'rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white'

    const activeNavClass =
        'rounded-lg bg-[#77917A] px-3 py-2 text-sm font-bold text-white shadow-sm'

    const mobileCustomerLinkClass =
        'mb-1 block rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white'

    const mobileAdminLinkClass = ({ isActive }) =>
        `mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive
            ? 'bg-[#77917A] text-white shadow-sm'
            : 'text-slate-200 hover:bg-white/10 hover:text-white'
        }`

    return (
        <header className="sticky top-0 z-50 border-b border-[#344B68] bg-[#172A43] text-white shadow-[0_4px_18px_rgba(15,23,42,0.22)]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

                {/* Brand */}
                <Link
                    to={isAdmin ? '/admin' : '/'}
                    onClick={closeMenus}
                    className="group flex shrink-0 items-center gap-2.5"
                    aria-label="BAHRIA STATIONERS Home"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white text-lg font-black text-[#203653] shadow-sm transition group-hover:bg-[#E8EFE8]">
                        B
                    </span>

                    <span>
                        <span className="block text-lg font-black tracking-tight text-white sm:text-xl">
                            {/* PAPER<span className="text-[#A9C2AB]">&</span>PEN */}
                            BAHRIA STATIONERS
                        </span>

                        <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-300 sm:block">
                            {isAdmin
                                ? 'Admin Portal'
                                : 'Your Everyday Study Companion'}
                        </span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-1 lg:flex xl:gap-2"
                >
                    {isAdmin
                        ? adminLinks.map(({ label, to, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 ${isActive ? activeNavClass : navLinkClass
                                    }`
                                }
                            >
                                <Icon size={16} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        ))
                        : customerLinks.map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                className={navLinkClass}
                            >
                                {label}
                            </NavLink>
                        ))}
                </nav>

                {/* Header Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                    {/* Store Link or Cart */}
                    {isAdmin ? (
                        <Link
                            to="/"
                            title="View Store"
                            aria-label="View Store"
                            className="hidden h-10 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 text-sm font-semibold text-white transition hover:border-[#A9C2AB] hover:bg-white/10 sm:flex"
                        >
                            <Store size={17} />
                            Store
                        </Link>
                    ) : (
                        <Link
                            to="/cart"
                            aria-label="Shopping cart"
                            title="Shopping cart"
                            onClick={closeMenus}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-[#A9C2AB] hover:bg-white/10"
                        >
                            <ShoppingBasket size={20} strokeWidth={1.8} />
                        </Link>
                    )}

                    {/* Account Dropdown */}
                    {isLoggedIn && (
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                aria-label="Open account menu"
                                aria-haspopup="menu"
                                aria-expanded={profileOpen}
                                onClick={() => setProfileOpen((previous) => !previous)}
                                className={`flex h-10 items-center gap-2 rounded-xl border px-3 transition focus:outline-none focus:ring-4 focus:ring-[#A9C2AB]/20 ${profileOpen
                                        ? 'border-[#A9C2AB] bg-[#77917A] text-white'
                                        : 'border-white/20 bg-white/5 text-white hover:border-[#A9C2AB] hover:bg-white/10'
                                    }`}
                            >
                                <UserRound size={18} />
                                <ChevronDown
                                    size={15}
                                    className={`transition-transform ${profileOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-[#203653] shadow-xl shadow-slate-950/20"
                                >
                                    <div className="border-b border-slate-100 px-3 py-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#58765D]">
                                            {isAdmin ? 'Admin Account' : 'Your Account'}
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-[#203653]">
                                            {user?.name || user?.email || 'Account'}
                                        </p>

                                        {user?.email && user?.name && (
                                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>

                                    {isAdmin ? (
                                        <>
                                            <Link
                                                to="/admin"
                                                role="menuitem"
                                                onClick={closeMenus}
                                                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#77917A]/15 hover:text-[#203653]"
                                            >
                                                <LayoutDashboard size={17} />
                                                Admin Dashboard
                                            </Link>

                                            <Link
                                                to="/admin/orders"
                                                role="menuitem"
                                                onClick={closeMenus}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#77917A]/15 hover:text-[#203653]"
                                            >
                                                <ShoppingCart size={17} />
                                                Manage Orders
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/profile"
                                                role="menuitem"
                                                onClick={closeMenus}
                                                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#77917A]/15 hover:text-[#203653]"
                                            >
                                                <Settings size={17} />
                                                My Profile
                                            </Link>

                                            <Link
                                                to="/orders"
                                                role="menuitem"
                                                onClick={closeMenus}
                                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#77917A]/15 hover:text-[#203653]"
                                            >
                                                <Package size={17} />
                                                My Orders
                                            </Link>
                                        </>
                                    )}

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                    >
                                        <LogOut size={17} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Guest Sign-in Actions */}
                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="hidden h-10 items-center rounded-xl bg-[#77917A] px-4 text-sm font-semibold text-white transition hover:bg-[#58765D] sm:flex"
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/admin/login"
                                className="hidden h-10 items-center rounded-xl border border-white/30 px-3 text-sm font-semibold text-white transition hover:border-[#A9C2AB] hover:bg-white/10 md:flex"
                            >
                                Admin Sign In
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setMenuOpen((previous) => !previous)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white transition hover:border-[#A9C2AB] hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#A9C2AB]/20 lg:hidden"
                    >
                        {menuOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <nav
                    id="mobile-navigation"
                    aria-label="Mobile navigation"
                    className="border-t border-[#344B68] bg-[#203653] px-4 py-3 shadow-lg shadow-slate-950/10 lg:hidden sm:px-6"
                >
                    {isAdmin
                        ? adminLinks.map(({ label, to, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                onClick={closeMenus}
                                className={mobileAdminLinkClass}
                            >
                                <Icon size={18} strokeWidth={1.8} />
                                {label}
                            </NavLink>
                        ))
                        : customerLinks.map(({ label, to }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                onClick={closeMenus}
                                className={mobileCustomerLinkClass}
                            >
                                {label}
                            </NavLink>
                        ))}

                    <div className="my-2 border-t border-white/15" />

                    {isAdmin ? (
                        <Link
                            to="/"
                            onClick={closeMenus}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                        >
                            <Store size={18} />
                            View Store
                        </Link>
                    ) : (
                        <>
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={closeMenus}
                                        className={mobileCustomerLinkClass}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Settings size={18} />
                                            My Profile
                                        </span>
                                    </Link>

                                    <Link
                                        to="/orders"
                                        onClick={closeMenus}
                                        className={mobileCustomerLinkClass}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Package size={18} />
                                            My Orders
                                        </span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={closeMenus}
                                        className={mobileCustomerLinkClass}
                                    >
                                        <span className="flex items-center gap-3">
                                            <UserRound size={18} />
                                            Sign In
                                        </span>
                                    </Link>

                                    <Link
                                        to="/admin/login"
                                        onClick={closeMenus}
                                        className={mobileCustomerLinkClass}
                                    >
                                        <span className="flex items-center gap-3">
                                            <LayoutDashboard size={18} />
                                            Admin Sign In
                                        </span>
                                    </Link>
                                </>
                            )}

                            <Link
                                to="/cart"
                                onClick={closeMenus}
                                className={mobileCustomerLinkClass}
                            >
                                <span className="flex items-center gap-3">
                                    <ShoppingBasket size={18} />
                                    Shopping Cart
                                </span>
                            </Link>
                        </>
                    )}

                    {isLoggedIn && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    )}
                </nav>
            )}
        </header>
    )
}

export default Navbar
