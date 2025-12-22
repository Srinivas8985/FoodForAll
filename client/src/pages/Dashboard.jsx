import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import DonorDashboard from './dashboards/DonorDashboard';
import NGODashboard from './dashboards/NGODashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-transparent pt-28 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">{user.name}</span>
                        </h1>
                        <p className="text-gray-600 mt-2">Welcome back to your dashboard. Here's what's happening.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50">
                        <div className={`w-3 h-3 rounded-full ${user.role === 'admin' ? 'bg-red-500' : user.role === 'donor' ? 'bg-primary-500' : 'bg-secondary-500'}`}></div>
                        <span className="capitalize font-medium text-gray-700">{user.role} Account</span>
                    </div>
                </motion.div>

                {/* Role Router */}
                {user.role === 'donor' && <DonorDashboard />}
                {user.role === 'ngo' && <NGODashboard />}
                {user.role === 'admin' && <AdminDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
