import { Link } from 'react-router-dom'
import {
    BookOpen,
    ArrowUpRight,
    Mail,
    MapPin,
    Heart,
} from 'lucide-react'

function Footer() {
    return (
        <footer className="border-t border-[#203653]/15 bg-[#F5F7FA] text-slate-700">
            <div className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pt-14 lg:pt-16">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

                    {/* Brand */}
                    <div>
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-2.5"
                            aria-label="BAHRIA STATIONERS Home"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#203653] text-white shadow-sm transition-colors group-hover:bg-[#2C4768]">
                                <BookOpen size={22} strokeWidth={1.8} />
                            </span>

                            <span className="text-2xl font-black tracking-tight text-[#203653]">
                                {/* PAPER<span className="text-[#77917A]">&</span>PEN */}
                                BAHRIA STATIONERS
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-slate-600">
                            Everything you need for a better school day. Discover books,
                            copies, and stationery essentials in one place.
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#77917A]/30 bg-[#77917A]/10 px-3 py-2 text-xs font-semibold text-[#203653]">
                            <span className="h-2 w-2 rounded-full bg-[#77917A]" />
                            Made for curious minds
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#203653]">
                            Explore
                        </h3>

                        <div className="mt-5 flex flex-col items-start gap-3.5 text-sm text-slate-600">
                            <Link
                                to="/"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                Home
                            </Link>

                            <Link
                                to="/institutions"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                Institutions
                            </Link>

                            <Link
                                to="/stationery"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                Stationery
                            </Link>
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#203653]">
                            Customer Care
                        </h3>

                        <div className="mt-5 flex flex-col items-start gap-3.5 text-sm text-slate-600">
                            <Link
                                to="#"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                <span className="inline-flex items-center gap-2">
                                    Contact Us
                                </span>
                            </Link>

                            <Link
                                to="#"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                FAQs
                            </Link>

                            <Link
                                to="#"
                                className="transition-colors hover:text-[#58765D]"
                            >
                                Shipping Information
                            </Link>
                        </div>
                    </div>

                    {/* Our Promise */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#203653]">
                            Our Promise
                        </h3>

                        <p className="mt-5 text-sm leading-7 text-slate-600">
                            Making school shopping simpler, one class, one notebook,
                            and one bright idea at a time.
                        </p>

                        <Link
                            to="/stationery"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#203653] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2C4768] focus:outline-none focus:ring-4 focus:ring-[#77917A]/30"
                        >
                            Explore stationery
                            <ArrowUpRight size={16} />
                        </Link>

                        <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-[#58765D]" />
                            <p>Here for your everyday learning essentials.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#203653]/10 pt-6 text-center sm:flex-row sm:text-left">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} BAHRIA STATIONERS. All rights reserved.
                    </p>

                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        Made for learners, with
                        <Heart
                            size={13}
                            className="fill-[#77917A] text-[#77917A]"
                        />
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
