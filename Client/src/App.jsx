import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Institution from './pages/Institution'
import ClassPage from './pages/ClassPage'
import Stationery from './pages/Stationery'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminInstitutions from './pages/AdminInstitutions'
import AdminClasses from './pages/AdminClasses'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import Categories from './pages/Categories'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />

            <Route
              path="/institution/:institutionId"
              element={<Institution />}
            />

            <Route
              path="/institution/:institutionId/class/:classId"
              element={<ClassPage />}
            />

            <Route
              path="/stationery"
              element={<Stationery />}
            />

            <Route
              path="/product/:productId"
              element={<ProductDetails />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            <Route
              path="/institutions"
              element={<Categories />}
            />

            {/* Login-required routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/checkout"
                element={<Checkout />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/orders"
                element={<MyOrders />}
              />
            </Route>

            {/* Admin-only route */}
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/orders"
                element={<AdminOrders />} />

              <Route
                path="/admin/products"
                element={<AdminProducts />} />

              <Route
                path="/admin/institutions"
                element={<AdminInstitutions />} />

              <Route
                path="/admin/classes"
                element={<AdminClasses />} />
            </Route>
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
