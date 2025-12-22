import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PublicFood from './pages/PublicFood';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DonateFood from './pages/DonateFood';
import DonateMoney from './pages/DonateMoney';
import Listings from './pages/Listings';
import RequestFood from './pages/RequestFood';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Notifications from './pages/Notifications';
import DistributionLog from './pages/ngo/DistributionLog';
import PostFood from './pages/ngo/PostFood';
import HungerDashboard from './pages/admin/HungerDashboard';
import FoodDrivePlanning from './pages/admin/FoodDrivePlanning';
import VerificationDashboard from './pages/admin/VerificationDashboard';
import FindFood from './pages/public/FindFood';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Login />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div className="text-center py-20 text-red-500">Access Denied: You do not have permission to view this page.</div>;
    }

    return children;
};

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search-donations" element={<PublicFood />} /> {/* Renamed to avoid conflict */}
                <Route path="/about" element={<div className="text-center py-20">About Page Coming Soon</div>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute> {/* Changed ProtectedRoute to PrivateRoute */}
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donate"
                    element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}> {/* Changed ProtectedRoute to PrivateRoute */}
                            <DonateFood />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donate-money"
                    element={
                        <ProtectedRoute allowedRoles={['donor', 'admin']}>
                            <DonateMoney />
                        </ProtectedRoute>
                    }
                />
                <Route path="/listings" element={<Listings />} />
                <Route
                    path="/request"
                    element={
                        <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                            <RequestFood />
                        </ProtectedRoute>
                    }
                />

                {/* NGO Routes */}
                <Route
                    path="/ngo/log-distribution"
                    element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <DistributionLog />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ngo/post-food"
                    element={
                        <ProtectedRoute allowedRoles={['ngo']}>
                            <PostFood />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/hunger-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <HungerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/plan-drive"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <FoodDrivePlanning />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/verification"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <VerificationDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Public Food Discovery */}
                <Route path="/find-food" element={<FindFood />} />

            </Routes>
        </div>
    );
}

export default App;
