import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, CreditCard, Heart } from 'lucide-react';

const DonateMoney = () => {
    const [amount, setAmount] = useState('');
    const [donationType, setDonationType] = useState('emergency_fund');
    const [recipientNGO, setRecipientNGO] = useState('');
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { api } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const res = await api.get('/verification/verified-ngos');
                setNgos(res.data.data);
            } catch (error) {
                console.error("Failed to fetch verified NGOs", error);
            }
        };
        fetchNGOs();
    }, [api]);

    const handleDonation = async (e) => {
        e.preventDefault();
        if (donationType === 'ngo' && !recipientNGO) {
            toast.error('Please select an NGO');
            return;
        }
        setShowModal(true);
    };

    const confirmPayment = async () => {
        setLoading(true);
        try {
            const payload = {
                amount,
                donationType,
                paymentMethod: 'card', // Mocking card payment
                recipientNGO: donationType === 'ngo' ? recipientNGO : undefined
            };

            await api.post('/money/donate', payload);

            setLoading(false);
            setShowModal(false);
            toast.success('Donation Successful! Thank you for your generosity.');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setLoading(false);
            setShowModal(false);
            toast.error(error.response?.data?.message || 'Donation failed');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-transparent flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="bg-orange-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Heart className="w-6 h-6 fill-current" /> Donate Money
                    </h2>
                    <p className="text-orange-100 text-sm mt-1">Every rupee feeds a hungry soul.</p>
                </div>

                <form onSubmit={handleDonation} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 py-3 border"
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Donation Type</label>
                        <select
                            value={donationType}
                            onChange={(e) => setDonationType(e.target.value)}
                            className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 py-3 border px-3"
                        >
                            <option value="emergency_fund">Emergency Food Fund (Pool)</option>
                            <option value="ngo">Specific Verified NGO</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Pool funds are distributed to NGOs with urgent needs.</p>
                    </div>

                    {donationType === 'ngo' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select NGO</label>
                            <select
                                value={recipientNGO}
                                onChange={(e) => setRecipientNGO(e.target.value)}
                                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 py-3 border px-3"
                                required
                            >
                                <option value="">-- Choose an NGO --</option>
                                {ngos.map(ngo => (
                                    <option key={ngo._id} value={ngo._id}>
                                        {ngo.organizationName || ngo.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Proceed to Pay
                    </motion.button>
                </form>
            </motion.div>

            {/* Dummy Payment Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6"
                        >
                            <div className="text-center mb-6">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <CreditCard className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Secure Payment</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    This is a secure connection. You are donating <span className="font-bold text-gray-900">₹{amount}</span>.
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Card ending in 4242</span>
                                    <div className="h-4 w-8 bg-blue-600 rounded"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmPayment}
                                    disabled={loading}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex justify-center items-center"
                                >
                                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Pay Now'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonateMoney;
