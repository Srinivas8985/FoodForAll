import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Target, Award } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-heading font-bold text-gray-900 mb-4"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">FoodForAll</span>
                    </motion.h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Bridging the gap between surplus food and hunger through technology and reliability.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                            <Target className="w-6 h-6 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To eliminate hunger and food waste by creating a seamless, technology-driven platform that connects food donors with verified NGOs. We aim to serve 1 million meals by 2026 and create a sustainable ecosystem for food redistribution.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                    >
                        <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-6">
                            <Heart className="w-6 h-6 text-accent-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            A world where no one goes to bed hungry. We envision a society where food surplus is automatically redirected to those in need, fostering a community of care, trust, and shared responsibility.
                        </p>
                    </motion.div>
                </div>

                {/* Stats / Impact (Sample Data) */}
                <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-white mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-primary-100 font-medium">Active Donors</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">12k+</div>
                            <div className="text-primary-100 font-medium">Meals Served</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50+</div>
                            <div className="text-primary-100 font-medium">Verified NGOs</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">15</div>
                            <div className="text-primary-100 font-medium">Cities Covered</div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet The Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Adepu Lakshmi Srinivas', role: 'Founder & CEO', color: 'bg-blue-100 text-blue-600' },
                            { name: 'Harshit Kumar Ramadevu', role: 'Head of Operations', color: 'bg-green-100 text-green-600' },
                            { name: 'Gonthina Dinesh', role: 'Tech Lead', color: 'bg-purple-100 text-purple-600' }
                        ].map((member, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center"
                            >
                                <div className={`w-24 h-24 mx-auto rounded-full ${member.color} flex items-center justify-center mb-4 text-2xl font-bold`}>
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-gray-500">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Values */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Transparency</h3>
                            <p className="text-gray-600">Every donation is tracked and verified.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Community</h3>
                            <p className="text-gray-600">Building a network of care and support.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LeafIcon className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                            <p className="text-gray-600">Reducing waste for a greener planet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon component
const LeafIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
);

export default About;
