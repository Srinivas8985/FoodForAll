import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AddProofModal = ({ donation, onClose, onSuccess }) => {
    const { api } = useAuth();
    const [images, setImages] = useState(donation.usageProofImages?.join('\n') || '');
    const [description, setDescription] = useState(donation.usageProofDescription || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const imageArray = images.split('\n').map(url => url.trim()).filter(url => url);
            const endpoint = donation.type === 'money'
                ? `/money/${donation._id}/proof`
                : `/donations/${donation._id}/proof`;

            await api.put(endpoint, {
                images: imageArray,
                description
            });
            toast.success("Usage proof updated & Status marked as Distributed!");
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update proof");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Add Usage Proof</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm">
                        Uploading proof will automatically mark this donation as <strong>Distributed/Completed</strong>.
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PROOF DESCRIPTION</label>
                        <textarea
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                            rows="3"
                            placeholder="How was this donation used?"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IMAGE LINKS (One per line)</label>
                        <textarea
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 font-mono text-sm"
                            rows="4"
                            placeholder="https://imgur.com/example1.jpg&#10;https://drive.google.com/example2.jpg"
                            value={images}
                            onChange={e => setImages(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste direct links to images stored on Imgur, Drive, etc.</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save & Complete'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProofModal;
