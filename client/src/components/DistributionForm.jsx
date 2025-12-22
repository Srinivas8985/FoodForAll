import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const DistributionForm = ({ onSuccess }) => {
    const { api, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        foodType: 'cooked',
        quantity: '',
        description: '',
        address: '',
        area: '',
        pincode: '',
        distributionDate: '',
        contactNumber: user?.phone || ''
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                foodDetails: {
                    type: formData.foodType,
                    quantity: formData.quantity,
                    description: formData.description
                },
                location: {
                    address: formData.address,
                    area: formData.area,
                    pincode: formData.pincode
                },
                distributionDate: formData.distributionDate || new Date(),
                contactNumber: formData.contactNumber,
                status: 'upcoming' // Default to upcoming
            };

            await api.post('/distribution/log', payload);
            toast.success('Distribution Logged Successfully!');

            // Reset form
            setFormData({
                foodType: 'cooked',
                quantity: '',
                description: '',
                address: '',
                area: '',
                pincode: '',
                distributionDate: '',
                contactNumber: user?.phone || ''
            });

            if (onSuccess) onSuccess();

        } catch (error) {
            console.error(error);
            // Error handling via interceptor mostly, but fallbacks:
            toast.error(error.response?.data?.message || 'Failed to log distribution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Food Type</label>
                    <select name="foodType" value={formData.foodType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border">
                        <option value="cooked">Cooked Meals</option>
                        <option value="raw">Raw Materials</option>
                        <option value="packed">Packed Food</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="text" name="quantity" required placeholder="e.g. 50 Packets" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" rows="2"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Full Address</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area</label>
                    <input type="text" name="area" required placeholder="Locality" value={formData.area} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input type="text" name="pincode" required pattern="[0-9]{6}" title="6 digit pincode" value={formData.pincode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date/Time</label>
                    <input type="datetime-local" name="distributionDate" value={formData.distributionDate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500 p-2 border" />
            </div>

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50">
                {loading ? 'Logging...' : 'Log Distribution'}
            </button>
        </form>
    );
};

export default DistributionForm;
