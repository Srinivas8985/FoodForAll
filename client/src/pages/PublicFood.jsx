import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Clock, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicFood = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, cooked, raw, packaged

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            // Fetching all donations (public endpoint doesn't exist, using standard one but filtering client side for now or create public route)
            // Ideally we need a public route.
            // Let's assume /api/donations is protected. I need to make a public endpoint or use a workaround.
            // For now, I will assume I need to create a public endpoint or unprotect GET /api/donations?
            // "Senior Architect" said "Public Access (No Login)".
            // I should unprotect GET /api/donations or create /api/donations/public.
            // Let's create getPublicDonations in controller and route.
            // Since I'm in Frontend phase, I will try to fetch, if 401, I'll fix backend.
            // Actually, best practice: Create a dedicated public route now.
            // I'll write the frontend code assuming endpoint 'http://localhost:5000/api/donations/public' exists.
            // I will implement that endpoint in the next step to be correct.

            const res = await axios.get('http://localhost:5000/api/donations/public');
            setDonations(res.data.data);
        } catch (error) {
            console.error('Error fetching donations', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDonations = donations.filter(item => {
        if (filter === 'all') return true;
        return item.foodType === filter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            {/* Hero / Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-heading font-bold text-gray-900 mb-4"
                >
                    Find Food Nearby
                </motion.h1>
                <p className="text-lg text-gray-600 mb-8">
                    Browse available food donations in your area. No account required to view.
                </p>

                {/* Search & Filter Bar */}
                <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search location or food..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {['all', 'cooked', 'raw', 'packaged'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === type
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : filteredDonations.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No food donations available right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    <AnimatePresence>
                        {filteredDonations.map((donation, index) => (
                            <motion.div
                                key={donation._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            {donation.foodType && (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${donation.foodType === 'cooked' ? 'bg-orange-100 text-orange-700' :
                                                        donation.foodType === 'raw' ? 'bg-green-100 text-green-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {donation.foodType.toUpperCase()}
                                                </span>
                                            )}
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {donation.foodName}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">{donation.pickupLocation}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>Expires: {new Date(donation.expiryTime).toLocaleString()}</span>
                                        </div>
                                        {donation.servings && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 flex items-center justify-center font-bold text-gray-400 text-xs">S</div>
                                                <span>{donation.servings} Servings</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-sm font-semibold text-primary-600">
                                            {donation.quantity}
                                        </span>

                                        <Link
                                            to="/login"
                                            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                            Login to Claim <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default PublicFood;
