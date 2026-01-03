import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Leaf, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout, unreadNotifications } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-primary-600 to-accent-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                            <Leaf className="h-6 w-6" />
                        </div>
                        <span className="font-heading font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-accent-600">
                            FoodForAll
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link to="/" className="text-gray-600 font-medium hover:text-primary-600 transition-colors relative group whitespace-nowrap">
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/find-food" className="text-gray-600 font-medium hover:text-primary-600 transition-colors relative group whitespace-nowrap">
                            Find Food
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                        </Link>
                        <Link to="/about" className="text-gray-600 font-medium hover:text-primary-600 transition-colors relative group whitespace-nowrap">
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
                        </Link>

                        <Link to="/listings" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Available Food</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'donor' && (
                                    <>
                                        <Link to="/donate" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Donate Food</Link>
                                        <Link to="/donate-money" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Donate Money</Link>
                                    </>
                                )}
                                {(user.role === 'ngo') && (
                                    <>
                                        <Link to="/request" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Request</Link>
                                        <Link to="/ngo/log-distribution" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Log Dist.</Link>
                                    </>
                                )}
                                {(user.role === 'admin') && (
                                    <>
                                        <Link to="/admin/hunger-dashboard" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Dashboard</Link>
                                        <Link to="/admin/verification" className="text-gray-600 font-medium hover:text-primary-600 transition-colors whitespace-nowrap">Verify</Link>
                                    </>
                                )}

                                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                                    <Link to="/notifications" className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-gray-50 transition-colors relative">
                                        <span className="text-xl">🔔</span>
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white">
                                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                            </span>
                                        )}
                                    </Link>

                                    <Link to="/chat" className="text-gray-500 hover:text-primary-600 p-2 rounded-full hover:bg-gray-50 transition-colors relative">
                                        <span className="text-xl">💬</span>
                                    </Link>
                                </div>

                                <div className="relative group flex items-center">
                                    <button className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all border border-primary-100">
                                        <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-sm hidden lg:block">{user.name.split(' ')[0]}</span>
                                    </button>
                                    {/* Invisible bridge to prevent closing */}
                                    <div className="absolute top-full w-full h-4 bg-transparent"></div>

                                    <div className="hidden group-hover:block absolute right-0 top-[calc(100%+0.5rem)] w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">My Dashboard</Link>
                                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <LogOut className="h-4 w-4 mr-2" /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 font-medium hover:text-primary-600 transition-colors">Login</Link>
                                <Link to="/signup" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-600 hover:text-primary-600 focus:outline-none">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Home</Link>
                            <Link to="/about" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">About</Link>

                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Dashboard</Link>
                                    <Link to="/listings" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50">Available Food</Link>
                                    <button onClick={() => { handleLogout(); toggleMenu(); }} className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-3">
                                    <Link to="/login" onClick={toggleMenu} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">Login</Link>
                                    <Link to="/signup" onClick={toggleMenu} className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-primary-600 to-accent-600 shadow-md">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
