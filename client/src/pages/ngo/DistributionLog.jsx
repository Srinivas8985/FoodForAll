import React from 'react';
import { useNavigate } from 'react-router-dom';
import DistributionForm from '../../components/DistributionForm';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DistributionLog = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-1" /> Back
                </button>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Log Public Distribution
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Log your food drive details to make it visible on the public "Find Food" page.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <DistributionForm onSuccess={() => {
                        toast.success('Distribution Logged Successfully');
                        navigate('/dashboard');
                    }} />
                </div>
            </div>
        </div>
    );
};

export default DistributionLog;
