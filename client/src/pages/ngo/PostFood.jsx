import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';

const PostFood = () => {
    const { api } = useAuth();
    const [formData, setFormData] = useState({
        address: '',
        pincode: '',
        foodType: 'cooked',
        quantity: '',
        date: '',
        timeWindowFrom: '',
        timeWindowTo: '',
        contactPhone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                timeWindow: {
                    from: formData.timeWindowFrom,
                    to: formData.timeWindowTo
                }
            };

            await api.post('/ngo/post-food', payload);
            toast.success('Food Availability Posted Successfully!');
            setFormData({
                address: '',
                pincode: '',
                foodType: 'cooked',
                quantity: '',
                date: '',
                timeWindowFrom: '',
                timeWindowTo: '',
                contactPhone: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Post Food Availability</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Distribution Address</label>
                        <textarea
                            name="address"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            required
                            pattern="[0-9]{6}"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            value={formData.pincode}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Food Type</label>
                            <select
                                name="foodType"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                value={formData.foodType}
                                onChange={handleChange}
                            >
                                <option value="cooked">Cooked Meal</option>
                                <option value="packaged">Packaged</option>
                                <option value="raw">Raw Materials</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity (e.g. 50 meals)</label>
                            <input
                                type="text"
                                name="quantity"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">From Time</label>
                            <input
                                type="time"
                                name="timeWindowFrom"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                value={formData.timeWindowFrom}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">To Time</label>
                            <input
                                type="time"
                                name="timeWindowTo"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                                value={formData.timeWindowTo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                        <input
                            type="text"
                            name="contactPhone"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                            value={formData.contactPhone}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Post Availability
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostFood;
