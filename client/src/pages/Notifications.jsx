import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Notifications = () => {
    const { api, fetchUnreadCount } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
            setLoading(false);
            fetchUnreadCount(); // Sync global badge
        } catch (error) {
            console.error('Failed to fetch notifications');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 10 seconds
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [api]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            fetchUnreadCount(); // Update badge
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/readall');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            fetchUnreadCount(); // Update badge
            toast.success('All marked as read');
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <Check className="w-5 h-5 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="min-h-screen pt-28 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-600 mt-1">Stay updated with your activities</p>
                    </div>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={markAllRead}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <motion.div
                                key={notif._id}
                                variants={item}
                                className={`relative p-5 rounded-2xl border transition-all hover:shadow-md ${notif.isRead ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100 shadow-sm'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${notif.isRead ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold text-gray-900 ${!notif.isRead && 'text-primary-900'}`}>{notif.title}</h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">{notif.message}</p>

                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className="mt-3 text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                                            >
                                                Mark as read <Check className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {!notif.isRead && (
                                    <div className="absolute top-5 right-5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                <Bell className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No notifications</h3>
                            <p className="text-gray-500 mt-2">You're all caught up!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Notifications;
