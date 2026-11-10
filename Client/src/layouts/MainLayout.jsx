import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppContext } from '../context/AppContext'

function MainLayout() {
    const { isLoggedIn, user } = useAppContext()
    const isAdmin = isLoggedIn && user?.role === 'admin'
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            {!isAdmin && <Footer />}
        </div>
    )
}

export default MainLayout
