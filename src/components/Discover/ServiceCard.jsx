import React from 'react';
import { Star, MapPin, ChevronRight, Lock } from 'lucide-react';

const ServiceCard = ({ service, isPremiumUser, onBooking }) => {
    return (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    {service.rating}
                </div>
            </div>

            {/* Service Info */}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                    <MapPin size={14} /> {service.location}
                </p>

                {/* Booking Button */}
                <button
                    onClick={() => onBooking(service)}
                    className={`w-full py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${isPremiumUser
                            ? 'bg-slate-900 text-white hover:bg-orange-600 shadow-lg shadow-slate-200'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    {isPremiumUser ? 'Book & Pay' : 'Premium Only'}
                    {!isPremiumUser && <Lock size={14} />}
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
