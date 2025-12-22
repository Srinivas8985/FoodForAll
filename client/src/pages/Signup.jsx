import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, MapPin, Heart, Hand, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'donor',
        phone: '',
        address: '', // Keeping generic address for donor
        organizationName: '',
        organizationId: '',
        fullAddress: '',
        city: '',
        pincode: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-transparent pt-20 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
            {/* Background */}
            <div className="absolute top-[-10%] right-[20%] w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-secondary-200/30 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/50">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">Join our community and make a difference</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'donor' })}
                                className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'donor' ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white'}`}
                            >
                                <Heart className={`w-6 h-6 ${formData.role === 'donor' ? 'fill-primary-500 text-primary-500' : ''}`} />
                                <span className="font-semibold">Donor</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'ngo' })}
                                className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${formData.role === 'ngo' ? 'bg-secondary-50 border-secondary-500 text-secondary-700 ring-1 ring-secondary-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-white'}`}
                            >
                                <Hand className={`w-6 h-6 ${formData.role === 'ngo' ? 'fill-secondary-500 text-secondary-500' : ''}`} />
                                <span className="font-semibold">NGO / Volunteer</span>
                            </button>
                        </div>

                        {formData.role === 'ngo' && (
                            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 text-sm rounded-r">
                                <p className="font-bold">Important for NGOs:</p>
                                <p>Your account will be pending verification. You cannot receive donations or post food availability until verified by an Admin.</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User className="h-5 w-5" /></div>
                                <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Phone className="h-5 w-5" /></div>
                                <input type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail className="h-5 w-5" /></div>
                            <input type="email" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock className="h-5 w-5" /></div>
                            <input type="password" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        </div>

                        {/* Address Fields */}
                        {formData.role === 'ngo' ? (
                            <>
                                <div className="space-y-4">
                                    <input type="text" required className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Organization Name" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} />
                                    <input type="text" required className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Registration ID (Gov/Trust)" value={formData.organizationId} onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })} />
                                    <textarea required className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Full Address" value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} rows="2" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" required className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                                        <input type="text" required maxLength="6" pattern="[0-9]{6}" className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><MapPin className="h-5 w-5" /></div>
                                <input type="text" required className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                        )}

                        <button type="submit" className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 transition-all transform hover:-translate-y-0.5">
                            Create Account <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Sign in</Link>
                    </p>
                </div>
            </motion.div >
        </div >
    );
};

export default Signup;
