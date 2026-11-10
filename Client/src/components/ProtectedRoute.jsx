import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function ProtectedRoute({ allowedRole }) {
    const { isLoggedIn, user } = useAppContext()
    const location = useLocation()

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        )
    }

    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
