import React from 'react';
import { MapPin } from 'lucide-react';

const MapView = ({ services, onServiceClick }) => {
    return (
        <div className="relative h-[600px] bg-slate-200 rounded-[3rem] overflow-hidden border border-slate-300 shadow-inner group">
            {/* Mock Map Background Tiles */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30 pointer-events-none">
                {[...Array(100)].map((_, i) => (
                    <div key={i} className="border border-slate-400"></div>
                ))}
            </div>

            {/* Map Pins */}
            {services.map((service, idx) => (
                <div
                    key={service.id}
                    className="absolute cursor-pointer transition-transform hover:scale-110 group/pin"
                    style={{
                        top: `${20 + idx * 25}%`,
                        left: `${30 + idx * 20}%`
                    }}
                    onClick={() => onServiceClick(service)}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Hover Card */}
                        <div className="bg-white px-3 py-1 rounded-lg shadow-lg mb-2 border border-slate-200 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                            <p className="font-bold text-xs">{service.name}</p>
                            <p className="text-[10px] text-slate-500">${service.basePrice}</p>
                        </div>

                        {/* Pin Icon */}
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white text-white">
                            <MapPin size={16} />
                        </div>
                    </div>
                </div>
            ))}

            {/* Map UI Elements - Provider Count */}
            <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4">
                <div className="flex -space-x-3">
                    {services.map((s, i) => (
                        <img
                            key={i}
                            src={s.image}
                            alt=""
                            className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                    ))}
                </div>
                <p className="text-sm font-bold">{services.length} providers in view</p>
            </div>
        </div>
    );
};

export default MapView;
