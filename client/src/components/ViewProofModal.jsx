import { motion } from 'framer-motion';

const ViewProofModal = ({ donation, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">Donation Usage Proof</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">How it was used</h4>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100 text-lg leading-relaxed">
                            {donation.usageProofDescription || "No description provided."}
                        </p>
                    </div>

                    {donation.usageProofImages?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Photo Evidence</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {donation.usageProofImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-100 group">
                                        <img
                                            src={img}
                                            alt={`Proof ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=Image+Load+Error'; }}
                                        />
                                        <a
                                            href={img}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">View Full</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Close</button>
                </div>
            </motion.div>
        </div>
    );
};

export default ViewProofModal;
