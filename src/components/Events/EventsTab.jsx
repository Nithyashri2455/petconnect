import React from 'react';
import { MapPin, Crown } from 'lucide-react';

const EventsTab = ({ events }) => {
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold mb-2">Upcoming Events</h2>
                <p className="text-slate-500">Join the community at these local gatherings.</p>
            </div>

            {events.map(event => (
                <div
                    key={event.id}
                    className="bg-white rounded-[2rem] p-4 flex flex-col md:flex-row gap-6 border border-slate-100 hover:shadow-lg transition-all"
                >
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full md:w-48 h-48 md:h-auto object-cover rounded-[1.5rem]"
                    />

                    <div className="flex-1 py-2 pr-4">
                        <div className="flex justify-between items-start">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                                {event.date}
                            </span>
                            {event.premiumOnly && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Crown size={12} /> Premium
                                </span>
                            )}
                        </div>

                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-slate-500 flex items-center gap-2 mb-6">
                            <MapPin size={16} /> {event.location}
                        </p>

                        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                            RSVP Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EventsTab;
