import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, FileText, Calendar, MapPin, Building, Phone, Mail, Clock } from 'lucide-react';

const VerificationDashboard = () => {
    const { api } = useAuth(); // Access configured API instance
    const [pendingNGOs, setPendingNGOs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNGO, setSelectedNGO] = useState(null);
    const [actionData, setActionData] = useState({ id: null, type: '', notes: '' });

    useEffect(() => {
        fetchPendingNGOs();
    }, []);

    const fetchPendingNGOs = async () => {
        try {
            const res = await api.get('/verification/pending-ngos'); // Use relative path
            setPendingNGOs(res.data.data);
        } catch (error) {
            toast.error('Failed to fetch pending NGOs');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (method) => {
        if (!actionData.notes) return toast.error('Please add notes for audit trail');

        try {
            await api.put(`/verification/verify-ngo/${selectedNGO._id}`, {
                action: actionData.type,
                method,
                notes: actionData.notes
            });

            toast.success(`NGO ${actionData.type === 'verified' ? 'Verified' : 'Rejected'} successfully`);
            setActionData({ id: null, type: '', notes: '' });
            setSelectedNGO(null); // Close modal if open
            fetchPendingNGOs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8 flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary-600" />
                NGO Verification Dashboard
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : pendingNGOs.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md p-12 rounded-2xl shadow-sm text-center border border-white/50">
                    <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500 mt-1">No pending verification requests.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingNGOs.map(ngo => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={ngo._id}
                            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-white/50 flex flex-col"
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-secondary-50 result-icon-bg rounded-xl">
                                        <Building className="h-6 w-6 text-secondary-600" />
                                    </div>
                                    <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs font-semibold">
                                        Pending
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{ngo.organizationName || ngo.name || 'Unnamed Organization'}</h3>
                                <p className="text-sm text-gray-600 mb-1">Rep: {ngo.name}</p>
                                <p className="text-sm text-gray-500 mb-4">{ngo.city || 'Location N/A'}</p>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="truncate">ID: {ngo.organizationId || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{ngo.fullAddress || ngo.address || ngo.city || 'Address N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Applied: {new Date(ngo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedNGO(ngo)}
                                className="mt-6 w-full py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <FileText size={16} /> Review Application
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detailed Review Modal */}
            <AnimatePresence>
                {selectedNGO && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedNGO(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{selectedNGO.organizationName || selectedNGO.name}</h2>
                                        <p className="text-gray-500">Applicant ID: {selectedNGO._id}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedNGO(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <XCircle size={24} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 border-b pb-2">Organization Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <Building className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Registration ID</p>
                                                    <p className="font-medium">{selectedNGO.organizationId || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Address</p>
                                                    <p className="font-medium text-sm">{selectedNGO.fullAddress || selectedNGO.address || 'Address not provided'}</p>
                                                    <p className="text-sm text-gray-600">{selectedNGO.city} {selectedNGO.pincode ? `- ${selectedNGO.pincode}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Application Date</p>
                                                    <p className="font-medium">{new Date(selectedNGO.createdAt).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                    {selectedNGO.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Representative Name</p>
                                                    <p className="font-medium">{selectedNGO.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Email</p>
                                                    <p className="font-medium truncate">{selectedNGO.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase">Phone</p>
                                                    <p className="font-medium">{selectedNGO.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Verification Actions</h3>

                                    {actionData.id === selectedNGO._id ? (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <div className={`p-4 rounded-lg mb-4 ${actionData.type === 'verified' ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                                                <p className={`font-bold mb-2 ${actionData.type === 'verified' ? 'text-green-800' : 'text-red-800'}`}>
                                                    {actionData.type === 'verified' ? 'Approve Application' : 'Reject Application'}
                                                </p>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Audit Notes (Required)</label>
                                                <textarea
                                                    autoFocus
                                                    className="w-full border border-gray-300 p-3 rounded-xl mb-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                    placeholder={actionData.type === 'verified' ? "e.g. Verified via phone call with Director..." : "e.g. Invalid registration document..."}
                                                    value={actionData.notes}
                                                    onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                                                    rows={3}
                                                />
                                                <div className="flex gap-3 justify-end">
                                                    <button
                                                        onClick={() => setActionData({ id: null, type: '', notes: '' })}
                                                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                    {actionData.type === 'verified' ? (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAction('phone')}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg shadow-green-600/20"
                                                            >
                                                                Verify (Phone)
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction('visit')}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20"
                                                            >
                                                                Verify (Visit)
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleAction('document_check')}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-lg shadow-red-600/20"
                                                        >
                                                            Confirm Rejection
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setActionData({ id: selectedNGO._id, type: 'verified', notes: '' })}
                                                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" /> Approve NGO
                                            </button>
                                            <button
                                                onClick={() => setActionData({ id: selectedNGO._id, type: 'rejected', notes: '' })}
                                                className="flex-1 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VerificationDashboard;
