import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, User, ArrowRight, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Listings = () => {
    const { api, user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // all, expiring_soon, newest, nearest
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log('Location access denied or error')
            );
        }

        const fetchDonations = async () => {
            try {
                // Keep silent refresh for subsequent calls
                const res = await api.get('/donations');
                setDonations(res.data.data);
            } catch (error) {
                if (loading) toast.error('Failed to load donations');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();

        // Real-time polling every 10 seconds
        const interval = setInterval(fetchDonations, 10000);
        return () => clearInterval(interval);
    }, [api]);

    const handleRequest = async (id) => {
        try {
            await api.put(`/donations/${id}`, { status: 'assigned', assignedTo: user._id });
            toast.success('You have successfully claimed this donation!');
            setDonations(donations.filter(d => d._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to claim donation');
        }
    };

    // Filter Logic
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            donation.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'expiring_soon') {
            const hoursUntilExpiry = (new Date(donation.expiryTime) - new Date()) / (1000 * 60 * 60);
            return matchesSearch && hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
        }

        return matchesSearch;
    }).sort((a, b) => {
        if (filterType === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (filterType === 'expiring_soon') {
            return new Date(a.expiryTime) - new Date(b.expiryTime);
        }
        if (filterType === 'nearest' && userLocation) {
            // Simple distance sort (hypotenuse approximation is enough for sorting small distances)
            const getDist = (loc) => {
                if (!loc || !loc.coordinates) return Infinity;
                const dLat = loc.coordinates[1] - userLocation.lat;
                const dLon = loc.coordinates[0] - userLocation.lng;
                return dLat * dLat + dLon * dLon;
            }
            return getDist(a.location) - getDist(b.location);
        }
        return 0;
    });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-heading font-bold text-gray-900">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">Available Food</span>
                        </h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">Browse available food donations. Claim what you need.</p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search food or location..."
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-full sm:w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3 top-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <select
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Items</option>
                            <option value="newest">Newest First</option>
                            <option value="expiring_soon">Expiring Soon (&lt; 24h)</option>
                            <option value="nearest">Nearest to Me</option>
                        </select>
                    </div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {filteredDonations.length > 0 ? (
                        filteredDonations.map((donation) => {
                            // Calculate distance if 'nearest' is selected
                            let distance = null;
                            if (userLocation && donation.location && donation.location.coordinates) {
                                const R = 6371; // km
                                const dLat = (donation.location.coordinates[1] - userLocation.lat) * Math.PI / 180;
                                const dLon = (donation.location.coordinates[0] - userLocation.lng) * Math.PI / 180;
                                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(donation.location.coordinates[1] * Math.PI / 180) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                distance = (R * c).toFixed(1);
                            }

                            return (
                                <motion.div key={donation._id} variants={item} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{donation.foodName}</h2>
                                                    <p className="text-sm text-green-600 font-medium">{donation.quantity}</p>
                                                </div>
                                            </div>
                                            {distance && (
                                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                                                    {distance} km away
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                                "{donation.message || "Fresh food available for pickup."}"
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-gray-600" /></div>
                                                <span>Expires {new Date(donation.expiryTime).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-gray-600" /></div>
                                                <span className="truncate">{donation.pickupLocation}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gray-600" /></div>
                                                <span>{donation.donor?.name || 'Anonymous Donor'}</span>
                                            </div>
                                        </div>

                                        {user ? (
                                            user.role === 'ngo' ? (
                                                <button
                                                    onClick={() => handleRequest(donation._id)}
                                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                                                >
                                                    Claim This Donation <ArrowRight className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <div className="bg-gray-50 text-gray-500 text-xs text-center py-2 rounded-lg border border-gray-100">
                                                    For NGOs Only
                                                </div>
                                            )
                                        ) : (
                                            <Link to="/login" className="block w-full text-center py-3 px-4 rounded-xl bg-white border-2 border-primary-100 text-primary-600 font-semibold hover:border-primary-200 hover:bg-primary-50 transition-all">
                                                Login to Claim
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No matching listings</h3>
                            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Listings;
