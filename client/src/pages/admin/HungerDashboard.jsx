import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Heatmap from '../../components/Map/Heatmap';

const HungerDashboard = () => {
    const [heatmapData, setHeatmapData] = useState([]);
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const heatRes = await axios.get('http://localhost:5000/api/analytics/heatmap-data', { withCredentials: true });
                setHeatmapData(heatRes.data.data);

                const statsRes = await axios.get('http://localhost:5000/api/admin/analytics', { withCredentials: true });
                setStats(statsRes.data.data); // Using existing analytics structure + new items if added

                const alertsRes = await axios.get('http://localhost:5000/api/admin/alerts', { withCredentials: true });
                setAlerts(alertsRes.data.data.filter(a => !a.isResolved));
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Hunger Analytics Dashboard</h1>

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {/* Icon */}
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Critical Alerts</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc pl-5 space-y-1">
                                    {alerts.map(alert => (
                                        <li key={alert._id}>{alert.message} ({alert.areaName})</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Hunger Heatmap</h2>
                <div className="relative z-0">
                    <Heatmap data={heatmapData} />
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Impact Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-teal-50 p-4 rounded text-center">
                            <p className="text-3xl font-bold text-teal-600">{stats?.mealsServed || 0}</p>
                            <p className="text-gray-600">Total Meals Served</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded text-center">
                            <p className="text-3xl font-bold text-orange-600">{stats?.foodCount || 0}</p>
                            <p className="text-gray-600">Donations Logged</p>
                        </div>
                    </div>
                </div>

                {/* Placeholder for more detailed charts if needed */}
                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
                    <p className="text-gray-500">More analytics coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default HungerDashboard;
