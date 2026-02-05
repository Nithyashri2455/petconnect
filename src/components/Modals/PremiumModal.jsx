import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const PremiumModal = ({ onClose, onUpgrade }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
                <div className="bg-orange-600 p-8 text-white text-center">
                    <h2 className="text-2xl font-bold">Go Premium</h2>
                    <p className="text-orange-100 text-sm mt-2">
                        Unlock Maps, Instant Payments & Booking.
                    </p>
                </div>

                <div className="p-8 space-y-4">
                    {[
                        "Interactive Map View",
                        "Direct Booking & Payments",
                        "Priority Customer Support",
                        "VIP Event Access"
                    ].map(f => (
                        <div key={f} className="flex items-center gap-3 font-medium text-slate-700">
                            <CheckCircle2 className="text-orange-500" size={18} /> {f}
                        </div>
                    ))}

                    <button
                        onClick={onUpgrade}
                        className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all"
                    >
                        Upgrade Now for $9.99/mo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;
