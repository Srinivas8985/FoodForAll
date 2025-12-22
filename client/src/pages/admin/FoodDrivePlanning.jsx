import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const FoodDrivePlanning = () => {
    const [hungerAreas, setHungerAreas] = useState([]);
    const [formData, setFormData] = useState({
        areaName: '',
        lat: '',
        lon: '',
        plannedMeals: '',
        driveDate: ''
    });

    useEffect(() => {
        // Fetch high hunger score areas to suggest
        const fetchAreas = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/analytics/hunger-areas', { withCredentials: true });
                setHungerAreas(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAreas();
    }, []);

    const handleSelectArea = (area) => {
        setFormData({
            ...formData,
            areaName: area.areaName,
            lat: area.location.coordinates[1],
            lon: area.location.coordinates[0],
            plannedMeals: area.totalUnmetDemand // Suggest demand as plan
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(formData.lon), parseFloat(formData.lat)]
                }
            };
            await axios.post('http://localhost:5000/api/admin/food-drive', payload, { withCredentials: true });
            toast.success('Food Drive Planned Successfully!');
        } catch (error) {
            toast.error('Failed to plan drive');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Plan Food Drive</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Suggestions List */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">Critical Hunger Spots</h2>
                    <p className="text-sm text-gray-500 mb-4">Select an area to auto-fill details.</p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {hungerAreas.map(area => (
                            <div
                                key={area._id}
                                onClick={() => handleSelectArea(area)}
                                className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-900">{area.areaName}</h3>
                                    <p className="text-xs text-gray-500">Unmet Demand: {area.totalUnmetDemand}</p>
                                </div>
                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                                    Score: {area.hungerScore.toFixed(0)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Planning Form */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Drive Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                value={formData.areaName}
                                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Lat</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                                    value={formData.lat}
                                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Lon</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                                    value={formData.lon}
                                    onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (navigator.geolocation) {
                                    toast.loading('Fetching location...', { id: 'geoLoc' });
                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                lat: position.coords.latitude,
                                                lon: position.coords.longitude
                                            }));
                                            toast.success('Location fetched!', { id: 'geoLoc' });
                                        },
                                        (error) => {
                                            console.error(error);
                                            toast.error('Unable to retrieve location', { id: 'geoLoc' });
                                        }
                                    );
                                } else {
                                    toast.error('Geolocation not supported');
                                }
                            }}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            Fetch Current Location
                        </button>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Planned Meals</label>
                            <input
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                value={formData.plannedMeals}
                                onChange={(e) => setFormData({ ...formData, plannedMeals: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                value={formData.driveDate}
                                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
                        >
                            Create Plan
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FoodDrivePlanning;
