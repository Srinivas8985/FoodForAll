import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Gift, Clock, TrendingUp, List } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { validateResponse } from '../../utils/validate';
import { DonationListResponse } from '../../schemas/apiSchemas';

import ViewProofModal from '../../components/ViewProofModal';

const DonorDashboard = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDonations: 0,
        activeDonations: 0
    });
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingProof, setViewingProof] = useState(null);

    const handleStartChat = async (recipientId) => {
        try {
            await api.post('/chat/conversation', {
                senderId: user._id,
                receiverId: recipientId
            });
            navigate('/chat');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both food and money donations
                const [resFood, resMoney] = await Promise.all([
                    api.get('/donations/my'),
                    api.get('/money/my')
                ]);

                // Validate API Responses
                const validFood = validateResponse(resFood.data, DonationListResponse, "Invalid Food Donation Data");

                // Need to validate money manually or add MoneyListResponse to this file imports if needed
                // Assuming resMoney structure is similar
                const moneyData = resMoney.data.data || [];

                const foodItems = validFood ? validFood.data.map(i => ({ ...i, type: 'donation' })) : [];
                const moneyItems = moneyData.map(i => ({ ...i, type: 'money', quantity: `₹${i.amount}`, foodName: 'Money Donation', status: 'completed' }));

                const allItems = [...foodItems, ...moneyItems].sort((a, b) => new Date(b.createdAt || b.transactionDate) - new Date(a.createdAt || a.transactionDate));

                setMyItems(allItems);
                setStats({
                    totalDonations: allItems.length,
                    activeDonations: allItems.filter(d => d.status === 'available').length
                });
            } catch (err) {
                console.error("Failed to fetch donor data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api]);

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
                <motion.div variants={item} className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Gift size={60} /></div>
                    <div className="relative z-10">
                        <p className="text-primary-100 font-medium mb-1">Total Donations</p>
                        <h3 className="text-4xl font-bold">{stats.totalDonations}</h3>
                    </div>
                </motion.div>
                <motion.div variants={item} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-secondary-100 text-secondary-600 rounded-xl"><Clock size={24} /></div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeDonations}</h3>
                    <p className="text-gray-500 text-sm">Donations currently listed</p>
                </motion.div>
            </motion.div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        Recent Donations
                    </h2>
                    <Link to="/donate" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
                        <Plus className="h-5 w-5" /> New Donation
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proof</th>
                            </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-gray-100">
                            {myItems.length > 0 ? (
                                myItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                                                    {item.type === 'money' ? '💰' : '🎁'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.foodName}</div>
                                                    <div className="text-xs text-gray-500">{item.recipientNGO?.name ? `To: ${item.recipientNGO.name}` : (item.pickupLocation || 'General Fund')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.createdAt || item.transactionDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${(item.status === 'available') ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    (item.donationStatus === 'accepted' || item.status === 'assigned') ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                                        (item.donationStatus === 'distributed' || item.status === 'delivered') ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                            'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                {item.donationStatus === 'accepted' ? 'Accepted' :
                                                    item.donationStatus === 'distributed' ? 'Distributed' :
                                                        item.status === 'assigned' ? 'Accepted' : /* Fallback if donationStatus not set */
                                                            item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(item.type === 'money' || item.type === 'donation') && item.usageProofImages?.length > 0 && (
                                                <button
                                                    onClick={() => setViewingProof(item)}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                                                >
                                                    View Proof
                                                </button>
                                            )}
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

            {viewingProof && (
                <ViewProofModal
                    donation={viewingProof}
                    onClose={() => setViewingProof(null)}
                />
            )}
        </div>
    );
};

export default DonorDashboard;
