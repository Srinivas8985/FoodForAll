import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, List, Gift, Activity, TrendingUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { validateResponse } from '../../utils/validate';
import { RequestListResponse, DonationListResponse, MoneyListResponse } from '../../schemas/apiSchemas';
import DistributionForm from '../../components/DistributionForm';
import DonationDetailsModal from '../../components/DonationDetailsModal';

import AddProofModal from '../../components/AddProofModal';

const NGODashboard = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalRequests: 0,
        pendingRequests: 0,
        incomingDonations: 0,
        totalMoneyReceived: 0
    });
    const [myItems, setMyItems] = useState([]);

    const handleContactSupport = async () => {
        try {
            // Fetch an admin ID (temp solution: get first admin from user list or similar)
            // For now, let's try to find an admin via a new endpoint or fallback
            // Creating a robust way:
            const res = await api.get('/auth/admin-contact');
            if (res.data.data) {
                await api.post('/chat/conversation', {
                    senderId: user._id,
                    receiverId: res.data.data._id
                });
                navigate('/chat');
            } else {
                toast.error("No support agents available");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to contact support");
        }
    };

    const [loading, setLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [viewDetailsDonation, setViewDetailsDonation] = useState(null);

    const fetchData = async () => {
        try {
            // Robust fetching using Promise.allSettled
            const [resRequests, resDirectDonations, resMoney] = await Promise.allSettled([
                api.get('/requests/my'),
                api.get('/donations/ngo'),
                api.get('/money/ngo')
            ]);

            let allItems = [];
            let statsUpdate = {
                totalRequests: 0,
                pendingRequests: 0,
                incomingDonations: 0,
                totalMoneyReceived: 0
            };

            // Handle Food Requests
            if (resRequests.status === 'fulfilled') {
                const validReq = validateResponse(resRequests.value.data, RequestListResponse, "Invalid Request Data");
                if (validReq) {
                    allItems = [...allItems, ...validReq.data.map(i => ({ ...i, type: 'request' }))];
                    statsUpdate.totalRequests = validReq.data.length;
                    statsUpdate.pendingRequests = validReq.data.filter(r => r.status === 'active').length;
                }
            } else {
                console.error("Failed to fetch requests", resRequests.reason);
            }

            // Handle Direct Donations
            if (resDirectDonations.status === 'fulfilled') {
                const validDonations = validateResponse(resDirectDonations.value.data, DonationListResponse, "Invalid Donation Data");
                if (validDonations) {
                    allItems = [...allItems, ...validDonations.data.map(i => ({ ...i, type: 'donation' }))];
                    statsUpdate.incomingDonations = validDonations.data.length;
                }
            } else {
                console.error("Failed to fetch NGO donations", resDirectDonations.reason);
            }

            // Handle Money Donations
            if (resMoney.status === 'fulfilled') {
                const validMoney = validateResponse(resMoney.value.data, MoneyListResponse, "Invalid Money Data");
                if (validMoney) {
                    allItems = [...allItems, ...validMoney.data.map(i => ({ ...i, type: 'money' }))];
                    const totalMoney = validMoney.data.reduce((sum, item) => sum + Number(item.amount), 0);
                    statsUpdate.totalMoneyReceived = totalMoney;
                }
            } else {
                console.error("Failed to fetch NGO money donations", resMoney.reason);
            }

            setMyItems(allItems.sort((a, b) => new Date(b.createdAt || b.transactionDate) - new Date(a.createdAt || a.transactionDate)));
            setStats(statsUpdate);
        } catch (err) {
            console.error("Failed to fetch NGO dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [api]);

    const handleDonationAction = async (id, action) => {
        setActionLoading(true);
        try {
            await api.put(`/donations/${id}`, {
                donationStatus: action, // 'accepted' or 'rejected'
                status: action === 'accepted' ? 'assigned' : 'available'
            });
            toast.success(`Donation ${action} successfully!`);
            setViewDetailsDonation(null);
            fetchData(); // Refresh list
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
                <motion.div variants={item} className="bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-2xl p-6 text-white shadow-lg shadow-secondary-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><List size={60} /></div>
                    <div className="relative z-10">
                        <p className="text-secondary-100 font-medium mb-1">Total Requests</p>
                        <h3 className="text-4xl font-bold">{stats.totalRequests}</h3>
                    </div>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Activity size={24} /></div>
                        <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full">Urgent</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingRequests}</h3>
                    <p className="text-gray-500 text-sm">Pending active requests</p>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Gift size={24} /></div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">New</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.incomingDonations}</h3>
                    <p className="text-gray-500 text-sm">Direct Food Donations</p>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><Activity size={24} /></div>
                        <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Funds</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">₹{stats.totalMoneyReceived}</h3>
                    <p className="text-gray-500 text-sm">Total Money Received</p>
                </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        Recent Requests
                    </h2>
                    <Link to="/request" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary-600 text-white rounded-xl hover:bg-secondary-700 transition shadow-lg shadow-secondary-500/30">
                        <Plus className="h-5 w-5" /> New Request
                    </Link>
                    <button
                        onClick={handleContactSupport}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                    >
                        <MessageSquare className="h-5 w-5" /> Contact Admin
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
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
                                                    {item.type === 'money' ? '💰' : item.type === 'donation' ? '🎁' : '🍲'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.foodName || item.itemsNeeded || (item.amount ? `₹${item.amount} Donation` : 'Item')}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {item.pickupLocation || item.location || (item.donor?.name && `From: ${item.donor.name}`) || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {item.quantity || item.quantityNeeded || (item.amount ? `₹${item.amount}` : '-')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.createdAt || item.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${(item.status === 'active' || item.status === 'available') ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    (item.status === 'fulfilled' || item.status === 'assigned') ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setViewDetailsDonation(item)}
                                                    className="text-primary-600 hover:text-primary-800 font-medium hover:underline text-xs"
                                                >
                                                    View Details
                                                </button>
                                                {(item.type === 'money' || (item.type === 'donation' && (item.status === 'assigned' || item.status === 'distributed'))) && (
                                                    <button
                                                        onClick={() => setSelectedDonation(item)}
                                                        className="text-secondary-600 hover:text-secondary-800 font-medium hover:underline text-xs"
                                                    >
                                                        {item.usageProofImages?.length > 0 ? 'Edit Proof' : 'Add Proof'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-300 mb-3"><List /></div>
                                        <p className="text-gray-500 font-medium">No activity yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Log Distribution Section */}
            <div className="mt-10 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        Log Food Distribution
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Record a food distribution event to make it visible to the public.</p>
                </div>
                <div className="p-6">
                    <DistributionForm onSuccess={() => toast.success("Distribution logged! It's now public.")} />
                </div>
            </div>

            {selectedDonation && (
                <AddProofModal
                    donation={selectedDonation}
                    onClose={() => setSelectedDonation(null)}
                    onSuccess={() => {
                        setSelectedDonation(null);
                        fetchData();
                    }}
                />
            )}

            {/* View Details Modal for Acceptance */}
            {viewDetailsDonation && viewDetailsDonation.type === 'donation' && (
                <DonationDetailsModal
                    donation={viewDetailsDonation}
                    onClose={() => setViewDetailsDonation(null)}
                    onAction={handleDonationAction}
                    actionLoading={actionLoading}
                />
            )}
        </div>
    );
};

export default NGODashboard;
