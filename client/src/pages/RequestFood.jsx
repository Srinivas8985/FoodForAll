import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Hand, MapPin, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const RequestFood = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        itemsNeeded: '',
        quantityNeeded: '',
        location: '',
        urgency: 'medium',
        message: ''
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/requests', formData);
            toast.success('Request submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary-200/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-50 text-secondary-700 text-sm font-medium mb-4 border border-secondary-100">
                        <Hand className="w-4 h-4" /> Community Support
                    </span>
                    <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Request Food Support</h1>
                    <p className="text-lg text-gray-600">Tell us what you need, and we'll connect you with donors.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/50 relative">
                    <form onSubmit={onSubmit} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <ShoppingBag className="w-5 h-5 text-secondary-600" /> Requirements
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Items Needed</label>
                                    <input
                                        type="text"
                                        name="itemsNeeded"
                                        required
                                        placeholder="e.g. Rice, Bread, Canned goods"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.itemsNeeded}
                                        onChange={onChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Quantity Needed</label>
                                    <input
                                        type="text"
                                        name="quantityNeeded"
                                        required
                                        placeholder="e.g. 50 meals"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.quantityNeeded}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <AlertCircle className="w-5 h-5 text-red-500" /> Urgency & Location
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Urgency Level</label>
                                    <select
                                        name="urgency"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.urgency}
                                        onChange={onChange}
                                    >
                                        <option value="low">Low - Needed this week</option>
                                        <option value="medium">Medium - Needed in 2-3 days</option>
                                        <option value="high">High - Needed tomorrow</option>
                                        <option value="critical">Critical - Needed today</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" /> Delivery Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        placeholder="Full address"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all bg-gray-50/50"
                                        value={formData.location}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mt-6">
                                <label className="text-sm font-medium text-gray-700">Additional Message</label>
                                <textarea
                                    name="message"
                                    rows="3"
                                    placeholder="Explain the situation or add specific instructions..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all bg-gray-50/50 resize-none"
                                    value={formData.message}
                                    onChange={onChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-secondary-500/30 text-lg font-bold text-white bg-gradient-to-r from-secondary-500 to-secondary-700 hover:from-secondary-600 hover:to-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all transform hover:-translate-y-1"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        Submit Request <ArrowRight className="w-5 h-5" />
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

export default RequestFood;
