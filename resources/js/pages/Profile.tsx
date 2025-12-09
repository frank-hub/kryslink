import React from 'react';

interface ProfileProps {
    onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white dark:bg-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Pharmacy Profile</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Business Details</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Business Name</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">City Square Pharmacy</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">KRA PIN</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">P051234567Z</p>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Compliance Status</h3>
                            <div className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg mb-4">
                                <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-emerald-600 dark:text-emerald-300 text-lg">✓</span>
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-800 dark:text-emerald-400">PPB Verified</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500">License valid until Dec 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={onLogout} className="px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-sm font-medium transition-colors">Sign Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};