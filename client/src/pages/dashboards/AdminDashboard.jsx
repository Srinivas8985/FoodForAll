import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { List, Gift, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { validateResponse } from '../../utils/validate';
import { DonationListResponse, RequestListResponse } from '../../schemas/apiSchemas';
import DistributionForm from '../../components/DistributionForm';
import AddProofModal from '../../components/AddProofModal';
import ViewProofModal from '../../components/ViewProofModal';

const AdminDashboard = () => {
    const { user, api } = useAuth();
    const [stats, setStats] = useState({
        totalDonations: 0,
        totalRequests: 0,
        mealsServed: 0,
        totalMoney: 0,
        ngoCount: 0
    });
    const [users, setUsers] = useState([]);
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewDetailsDonation, setViewDetailsDonation] = useState(null);
    const [modifyProofDonation, setModifyProofDonation] = useState(null);
    const [viewingProof, setViewingProof] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resDonations, resRequests, resUsers, resAnalytics] = await Promise.all([
                    api.get('/donations'),
                    api.get('/requests'),
                    api.get('/admin/users'),
                    api.get('/admin/analytics')
                ]);

                // Validate Core Lists
                const validDonations = validateResponse(resDonations.data, DonationListResponse, "Invalid Admin Donation Data");
                const validRequests = validateResponse(resRequests.data, RequestListResponse, "Invalid Admin Request Data");

                const donations = validDonations ? validDonations.data : [];
                const requests = validRequests ? validRequests.data : [];

                setMyItems([...donations, ...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

                // Users and Analytics less critical for crash-prevention but good to have. 
                // Assuming simple array for users (implement strict user schema later if needed)
                setUsers(resUsers.data.data || []);

                setStats({
                    totalDonations: resDonations.data.count,
                    totalRequests: resRequests.data.count,
                    mealsServed: resAnalytics.data.data?.mealsServed || 0,
                    totalMoney: resAnalytics.data.data?.totalMoney || 0,
                    ngoCount: resAnalytics.data.data?.ngoCount || 0
                });
            } catch (err) {
                console.error("Failed to fetch admin dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api]);

    const handleVerifyNGO = async (id) => {
        try {
            await api.put(`/verification/verify-ngo/${id}`, {
                action: 'verified',
                method: 'dashboard',
                notes: 'Verified via Admin Dashboard Quick Action'
            });

            setUsers(users.map(u => u._id === id ? { ...u, isVerified: true, verificationStatus: 'approved' } : u));
            toast.success('NGO Verified Successfully!');
        } catch (error) {
            console.error('Verification failed', error);
            // toast handled by global interceptor likely
        }
    };

    const handleDonationAction = async (id, action) => {
        setActionLoading(true);
        try {
            await api.put(`/donations/${id}`, {
                donationStatus: action, // 'accepted' or 'rejected'
                status: 'assigned' // Admin override usually implies finality or assignment
            });
            toast.success(`Donation ${action} successfully!`);
            setViewDetailsDonation(null);
            // Quick refresh logic or just update local state
            setMyItems(myItems.map(i => i._id === id ? { ...i, donationStatus: action } : i));
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        } finally {
            setActionLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-100 text-primary-600 rounded-xl"><Gift size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">System Donations</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalDonations}</h3>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl"><List size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">System Requests</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalRequests}</h3>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Activity size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Money Raised</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalMoney || 0}</h3>
                        </div>
                    </div>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><List size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Meals Served</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.mealsServed || 0}</h3>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* User Management Table */}
            <div className="mb-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                        User Verification & Management
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reg ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-gray-100">
                            {users.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {u.organizationId || <span className="text-gray-400 italic">N/A</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 capitalize">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {u.phone || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {u.fullAddress || u.address ? (
                                            <span title={`${u.fullAddress || u.address}, ${u.city} ${u.pincode}`}>
                                                {[u.fullAddress || u.address, u.city, u.pincode].filter(Boolean).join(', ')}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">No address</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {u.role === 'ngo' ? (
                                            u.isVerified ? (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                                    <CheckCircle className="w-3 h-3" /> Verified
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                                                    Pending Verification
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {u.role === 'ngo' && !u.isVerified && (
                                            <div className="flex justify-end items-center gap-2">
                                                <Link
                                                    to="/admin/verification"
                                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium hover:underline"
                                                >
                                                    View Details
                                                </Link>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => handleVerifyNGO(u._id)}
                                                    className="text-primary-600 hover:text-primary-800 text-sm font-medium hover:underline"
                                                >
                                                    Quick Approve
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System Activity Log */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        System Activity Log
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-gray-100">
                            {myItems.length > 0 ? (
                                myItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                                    {item.itemsNeeded ? '📋' : '🎁'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.foodName || item.itemsNeeded}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.pickupLocation || item.location || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {item.quantity || item.quantityNeeded}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${(item.status === 'available' || item.status === 'active') ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    (item.status === 'assigned' || item.status === 'fulfilled') ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {(item.foodName) && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setViewDetailsDonation(item)}
                                                        className="text-primary-600 hover:text-primary-800 font-medium hover:underline text-xs"
                                                    >
                                                        Manage
                                                    </button>
                                                    {['assigned', 'distributed', 'delivered'].includes(item.status) && (
                                                        <button
                                                            onClick={() => setModifyProofDonation(item)}
                                                            className="text-secondary-600 hover:text-secondary-800 font-medium hover:underline text-xs"
                                                        >
                                                            {item.usageProofImages?.length > 0 ? 'Edit Proof' : 'Add Proof'}
                                                        </button>
                                                    )}
                                                    {item.usageProofImages?.length > 0 && (
                                                        <button
                                                            onClick={() => setViewingProof(item)}
                                                            className="text-gray-600 hover:text-gray-800 font-medium hover:underline text-xs"
                                                        >
                                                            View Proof
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-300 mb-3"><List /></div>
                                        <p className="text-gray-500 font-medium">No activity yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Public Distribution */}
            <div className="mt-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        Log Public Distribution (Emergency/Drive)
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Directly log a distribution event on behalf of the platform.</p>
                </div>
                <div className="p-6">
                    <DistributionForm onSuccess={() => toast.success("Admin Distribution logged successfully.")} />
                </div>
            </div>

            {/* View Details Modal for Admin */}
            {viewDetailsDonation && (
                <DonationDetailsModal
                    donation={viewDetailsDonation}
                    onClose={() => setViewDetailsDonation(null)}
                    onAction={handleDonationAction}
                    actionLoading={actionLoading}
                />
            )}

            {modifyProofDonation && (
                <AddProofModal
                    donation={modifyProofDonation}
                    onClose={() => setModifyProofDonation(null)}
                    onSuccess={() => {
                        setModifyProofDonation(null);
                        // fetchData(); // Ideally refresh data
                        window.location.reload(); // Quick refresh for now
                    }}
                />
            )}

            {viewingProof && (
                <ViewProofModal
                    donation={viewingProof}
                    onClose={() => setViewingProof(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
