import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AppointmentsTab = ({ onNavigateToDiscover }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setBookings(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <Calendar size={40} className="text-slate-400" />
                </div>

                <h3 className="text-2xl font-bold mb-2">No Upcoming Appointments</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                    You haven't booked any services yet. Explore the discover tab to find the perfect care for your pet.
                </p>

                <button
                    onClick={onNavigateToDiscover}
                    className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-700 transition-all"
                >
                    Browse Services
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
            
            <div className="space-y-4">
                {bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <img
                                src={booking.service?.image || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=200'}
                                alt={booking.service?.name || 'Service'}
                                className="w-20 h-20 rounded-2xl object-cover"
                            />
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{booking.service?.name || 'Service'}</h3>
                                        <p className="text-sm text-slate-500">
                                            {booking.service?.type} • {booking.service?.location}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {booking.status === 'confirmed' && <CheckCircle size={12} className="inline mr-1" />}
                                        {booking.status === 'cancelled' && <XCircle size={12} className="inline mr-1" />}
                                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} className="text-orange-500" />
                                        <span>{new Date(booking.booking_date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} className="text-orange-500" />
                                        <span>{booking.booking_time}</span>
                                    </div>
                                    
                                    {booking.service?.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin size={16} className="text-orange-500" />
                                            <span>{booking.service.location}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {booking.pet_details && (
                                    <div className="mt-3 text-sm">
                                        <span className="text-slate-500">Pet:</span>
                                        <span className="ml-2 font-medium">
                                            {booking.pet_details.name} ({booking.pet_details.type})
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentsTab;
