import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, Package, Calendar, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';

const DonationDetailsModal = ({ donation, onClose, onAction, actionLoading }) => {
    if (!donation) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'distributed': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 flex justify-between items-start text-white">
                        <div>
                            <h2 className="text-2xl font-bold">{donation.foodName}</h2>
                            <div className="flex gap-3 mt-2">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Package size={14} /> {donation.quantity}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 uppercase bg-white/90 text-primary-800`}>
                                    {donation.donationStatus}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Donor & Location */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Donor Information</h3>
                                <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><User size={18} /></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{donation.donor?.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">Donor</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Phone size={18} /></div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{donation.contactPhone || donation.donor?.phone || 'N/A'}</p>
                                            <p className="text-xs text-gray-500">Contact Number</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Pickup Location</h3>
                                <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg mt-1"><MapPin size={18} /></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{donation.pickupLocation}</p>
                                        {donation.donor?.fullAddress && (
                                            <p className="text-sm text-gray-500 mt-1">{donation.donor.fullAddress}</p>
                                        )}
                                        {donation.donor?.city && (
                                            <p className="text-xs text-gray-400 mt-1">{donation.donor.city} - {donation.donor.pincode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Food Details & Actions */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Food Details</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                                        <span className="text-gray-500 text-sm">Type</span>
                                        <span className="font-medium capitalize text-gray-900">{donation.foodType}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                                        <span className="text-gray-500 text-sm">Servings</span>
                                        <span className="font-medium text-gray-900">{donation.servings} People</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                                        <span className="text-gray-500 text-sm">Expiry</span>
                                        <span className="font-medium text-red-600 flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(donation.expiryTime).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {donation.message && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                                            "{donation.message}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {donation.donationStatus === 'pending' && (
                                <div className="pt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => onAction(donation._id, 'rejected')}
                                            disabled={actionLoading}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <XCircle size={18} /> Reject
                                        </button>
                                        <button
                                            onClick={() => onAction(donation._id, 'accepted')}
                                            disabled={actionLoading}
                                            className="px-4 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/30"
                                        >
                                            <CheckCircle size={18} /> Accept
                                        </button>
                                    </div>
                                </div>
                            )}

                            {donation.donationStatus === 'accepted' && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center">
                                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <h4 className="font-bold text-green-800">Donation Accepted</h4>
                                    <p className="text-sm text-green-600">You have accepted this donation. Please proceed with pickup.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DonationDetailsModal;
