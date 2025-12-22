import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FindFood = () => {
    const [search, setSearch] = useState({ type: 'pincode', query: '' });
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial load - maybe show recent or nearby if geo available (skipping for now)

    const handleSearch = async (e, showAll = false) => {
        if (e) e.preventDefault();
        
        // If not showing all, require a query
        if (!showAll && !search.query) return toast.error('Please enter a search term');
        
        setLoading(true);
        try {
            // Using direct axios since this is a public page (no auth needed/AuthContext might not be loaded if strictly public)
            // But we can assume the baseURL from env
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            // Build params: if showAll is true, send empty params to fetch everything
            const params = showAll ? {} : (search.type === 'pincode' ? { pincode: search.query } : { area: search.query });
            
            const res = await axios.get(`${baseURL}/distribution/public`, { params });
            setDistributions(res.data.data);
            
            if (res.data.data.length === 0) {
                toast('No active distributions found', { icon: 'ℹ️' });
            } else if (showAll) {
                toast.success(`Found ${res.data.data.length} active distributions`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to search distributions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Find <span className="text-primary-600">Free Food</span> Nearby
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Search for active food distribution drives by NGOs in your area.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <select
                            value={search.type}
                            onChange={(e) => setSearch({ ...search, type: e.target.value })}
                            className="rounded-xl border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="pincode">Pincode</option>
                            <option value="area">Area / Locality</option>
                        </select>
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl p-3"
                                placeholder={search.type === 'pincode' ? "Enter 6-digit Pincode (e.g. 500081)" : "Enter Area Name (e.g. Madhapur)"}
                                value={search.query}
                                onChange={(e) => setSearch({ ...search, query: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto flex justify-center py-3 px-6 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Find Food'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSearch(null, true)}
                                disabled={loading}
                                className="w-full md:w-auto flex justify-center py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                            >
                                Show All
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div className="grid gap-6 md:grid-cols-2">
                    {distributions.map((dist) => (
                        <motion.div
                            key={dist._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dist.status === 'active' ? 'bg-green-100 text-green-800' :
                                            dist.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {dist.status.toUpperCase()}
                                        </span>
                                        <h3 className="mt-2 text-lg font-bold text-gray-900">{dist.ngo?.name || 'Local NGO'}</h3>
                                    </div>
                                    <div className="bg-primary-50 text-primary-700 p-2 rounded-lg">
                                        <ExternalLink size={20} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                                        <p className="text-gray-600 text-sm">
                                            {dist.location.address}, {dist.location.area}, {dist.location.pincode}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                        <p className="text-gray-600 text-sm">
                                            {new Date(dist.distributionDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">Food Available:</p>
                                        <p className="text-sm text-gray-600">{dist.foodDetails.quantity} ({dist.foodDetails.type})</p>
                                        {dist.foodDetails.description && <p className="text-xs text-gray-500 mt-1">{dist.foodDetails.description}</p>}
                                    </div>

                                    {dist.contactNumber && (
                                        <div className="mt-2">
                                            <a href={`tel:${dist.contactNumber}`} className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                                📞 Call: {dist.contactNumber}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FindFood;
