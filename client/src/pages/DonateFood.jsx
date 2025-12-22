import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Heart, Upload, MapPin, Phone, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

const DonateFood = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        foodName: '',
        quantity: '',
        foodType: 'cooked',
        preparationTime: '',
        servings: '',
        isVegetarian: true,
        expiryTime: '',
        pickupLocation: '',
        contactPhone: '',
        message: '',
        location: {
            type: 'Point',
            coordinates: [] // [longitude, latitude]
        }
    });

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            toast.loading('Getting location...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    toast.dismiss();
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            type: 'Point',
                            coordinates: [position.coords.longitude, position.coords.latitude]
                        }
                    }));
                    toast.success('Location captured!');
                },
                (error) => {
                    toast.dismiss();
                    toast.error('Unable to retrieve location');
                    console.error('Location error:', error);
                }
            );
        } else {
            toast.error('Geolocation not supported');
        }
    };

    const [recipientType, setRecipientType] = useState('portal');
    const [recipientId, setRecipientId] = useState('');
    const [verifiedNGOs, setVerifiedNGOs] = useState([]);

    // Fetch verified NGOs
    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const res = await api.get('/verification/verified-ngos');
                setVerifiedNGOs(res.data.data);
            } catch (error) {
                console.error("Failed to fetch verified NGOs", error);
                // toast.error("Could not load NGO list");
            }
        };
        fetchNGOs();
    }, [api]);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        const donationData = {
            ...formData,
            recipientType,
            recipientId: recipientType === 'ngo' ? recipientId : null
        };

        // Remove location validation if empty (prevents 500 error)
        if (donationData.location && donationData.location.coordinates.length === 0) {
            delete donationData.location;
        }

        try {
            await api.post('/donations', donationData);
            toast.success('Donation listed successfully! Thank you for your kindness.');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error listing donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-200/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
                        <Heart className="w-4 h-4 fill-primary-500" /> Share the Love
                    </span>
                    <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Donate Food</h1>
                    <p className="text-lg text-gray-600">Your surplus food can save a life today. Fill in the details below.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/50 relative">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Donation Recipient Choice */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="block text-sm font-medium text-blue-900 mb-2">Who would you like to donate to?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="portal"
                                        checked={recipientType === 'portal'}
                                        onChange={() => setRecipientType('portal')}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700 font-medium">FoodForAll Portal (Admin assigns)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="recipientType"
                                        value="ngo"
                                        checked={recipientType === 'ngo'}
                                        onChange={() => setRecipientType('ngo')}
                                        className="text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700 font-medium">Specific Verified NGO</span>
                                </label>
                            </div>

                            {recipientType === 'ngo' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 space-y-4"
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Verified NGO</label>
                                        <select
                                            required
                                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-3 px-4 border bg-white"
                                            value={recipientId}
                                            onChange={(e) => setRecipientId(e.target.value)}
                                        >
                                            <option value="">-- Choose an NGO --</option>
                                            {verifiedNGOs.map(ngo => (
                                                <option key={ngo._id} value={ngo._id}>
                                                    {ngo.organizationName || ngo.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {verifiedNGOs.find(n => n._id === recipientId) && (
                                        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-primary-100 flex gap-4 items-start">
                                            <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{verifiedNGOs.find(n => n._id === recipientId).organizationName || verifiedNGOs.find(n => n._id === recipientId).name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{verifiedNGOs.find(n => n._id === recipientId).fullAddress || verifiedNGOs.find(n => n._id === recipientId).address || "Address not available"}</p>
                                                <p className="text-sm text-gray-600">{verifiedNGOs.find(n => n._id === recipientId).city ? `${verifiedNGOs.find(n => n._id === recipientId).city} - ` : ''}{verifiedNGOs.find(n => n._id === recipientId).pincode || ''}</p>
                                                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {verifiedNGOs.find(n => n._id === recipientId).phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Food Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <Upload className="w-5 h-5 text-primary-600" /> Food Information
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Food Name</label>
                                    <input
                                        type="text"
                                        name="foodName"
                                        required
                                        placeholder="e.g. Vegetable Curry, Rice Packets"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.foodName}
                                        onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Food Type</label>
                                    <select
                                        name="foodType"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.foodType}
                                        onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                                    >
                                        <option value="cooked">Cooked Food</option>
                                        <option value="packaged">Packaged/Canned</option>
                                        <option value="raw">Raw Ingredients</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Vegetarian?</label>
                                    <select
                                        name="isVegetarian"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.isVegetarian}
                                        onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.value === 'true' })}
                                    >
                                        <option value={true}>Yes, Vegetarian</option>
                                        <option value={false}>No, Non-Veg</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Quantity Description</label>
                                    <input
                                        type="text"
                                        name="quantity"
                                        required
                                        placeholder="e.g. 5kg, 3 large containers"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Number of Servings (Approx)</label>
                                    <input
                                        type="number"
                                        name="servings"
                                        required
                                        placeholder="e.g. 20"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.servings}
                                        onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                                    />
                                </div>
                                {formData.foodType === 'cooked' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        <label className="text-sm font-medium text-gray-700">Preparation Time</label>
                                        <input
                                            type="datetime-local"
                                            name="preparationTime"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                            value={formData.preparationTime}
                                            onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" /> Best Before / Expiry
                                </label>
                                <input
                                    type="datetime-local"
                                    name="expiryTime"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                    value={formData.expiryTime}
                                    onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Pickup Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <MapPin className="w-5 h-5 text-accent-600" /> Pickup Details
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium text-gray-700">Pickup Address</label>
                                    <input
                                        type="text"
                                        name="pickupLocation"
                                        required
                                        placeholder="Full address for pickup"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.pickupLocation}
                                        onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleLocationClick}
                                        className="absolute right-2 top-8 p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors bg-white shadow-sm border border-gray-100"
                                        title="Use my current location"
                                    >
                                        <MapPin className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" /> Contact Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        required
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-400" /> Additional Message
                                </label>
                                <textarea
                                    name="message"
                                    rows="3"
                                    placeholder="Any generic instructions or details..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-gray-50/50 resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:-translate-y-1"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        List Donation <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default DonateFood;
