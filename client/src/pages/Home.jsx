import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Truck, ArrowRight, ShieldCheck, Users, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-image.jpg';
import axios from 'axios';

const Home = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalDonations: 0,
        mealsServed: 0,
        ngoCount: 0,
        cities: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use a direct axios call if auth context api instance requires token, 
                // or use the base URL from env. Assuming public endpoint doesn't need auth header,
                // but standard api instance might attach it if available.
                // Safest is to use the generic axios with the base URL.
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${baseURL}/analytics/public-stats`);
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch public stats", error);
                // Fallback to some default/minimal stats if fetch fails to avoid empty 0s if desired, 
                // or just leave as 0.
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-transparent pt-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center">
                {/* Premium Background Mesh */}
                <div className="absolute inset-0 bg-mesh opacity-60 -z-10 animate-pulse-slow"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-300/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-200/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-left"
                        >
                            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 backdrop-blur-sm border border-primary-200/50 text-primary-700 text-sm font-semibold tracking-wide mb-6 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                #ZeroHunger Mission
                            </span>

                            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
                                Turning Surplus into <br />
                                <span className="text-transparent bg-clip-text bg-premium-gradient">
                                    Smiles & Hope
                                </span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                                Join India's fastest growing network connecting food donors with verified NGOs.
                                <span className="block mt-2 font-medium text-primary-700">One tap to donate. One meal to save a life.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to={user ? "/dashboard" : "/signup"} className="group px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-lg shadow-xl shadow-primary-500/30 hover:shadow-primary-600/50 hover:-translate-y-1 transition-all flex items-center justify-center">
                                    {user ? "Go to Dashboard" : "Start Donating"}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/listings" className="px-8 py-4 bg-white/80 hover:bg-white text-gray-800 font-bold rounded-2xl text-lg shadow-sm hover:shadow-lg border border-white/50 backdrop-blur-sm transition-all flex items-center justify-center">
                                    Find Food
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-2xl skew-y-1">
                                <img
                                    src={heroImage}
                                    alt="Volunteers Distributing Food"
                                    className="rounded-2xl shadow-lg w-full h-[500px] object-cover"
                                />
                                <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Live Status</p>
                                        <p className="font-bold text-gray-900">Active Distribution</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="bg-white/50 backdrop-blur-sm border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-200/50">
                        <div className="text-center">
                            <p className="text-4xl font-heading font-bold text-primary-600 mb-1">{stats.totalDonations}</p>
                            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Donations</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-heading font-bold text-secondary-600 mb-1">{stats.mealsServed}</p>
                            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Meals Served</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-heading font-bold text-gray-800 mb-1">{stats.ngoCount}</p>
                            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Active NGOs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-heading font-bold text-green-600 mb-1">{stats.cities}</p>
                            <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Cities</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-gray-900 font-heading font-bold text-4xl mb-4">Why Choose FoodForAll?</h2>
                        <p className="text-lg text-gray-600">Our platform is designed to make the process of food donation seamless, transparent, and impactful using cutting-edge technology.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div whileHover={{ y: -10 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50 hover:border-primary-200 transition-colors">
                            <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Matching</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Our smart algorithm instantly notifies the nearest verified NGOs when food is available, minimizing wastage time.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div whileHover={{ y: -10 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50 hover:border-secondary-200 transition-colors">
                            <div className="w-14 h-14 bg-secondary-50 rounded-2xl flex items-center justify-center mb-6 text-secondary-600">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">100% Verified</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">Trust is paramount. Every NGO on our platform undergoes a strict 3-step verification process (Docs, Phone, Visit).</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div whileHover={{ y: -10 }} className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-white/50 hover:border-accent-200 transition-colors">
                            <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6 text-accent-600">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">Real-Time Impact</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">See exactly where your donation goes. Track pickup, distribution, and get photo proof of the smiles you created.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
