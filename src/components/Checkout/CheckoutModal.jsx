import React, { useState } from 'react';
import { X, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const CheckoutModal = ({ service, user, onClose }) => {
    const [paymentStep, setPaymentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const processPayment = async () => {
        setIsProcessing(true);
        
        try {
            const token = localStorage.getItem('token');
            
            // Create booking
            const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    serviceId: service.id,
                    bookingDate: selectedDate,
                    bookingTime: selectedTime,
                    petDetails: { name: 'My Pet', type: service.petTypes[0] },
                    notes: ''
                })
            });
            
            if (!bookingResponse.ok) {
                throw new Error('Booking failed');
            }
            
            const bookingData = await bookingResponse.json();
            
            // Process payment
            const paymentResponse = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookingId: bookingData.data.id,
                    amount: service.basePrice + 2.5,
                    paymentMethod: 'card',
                    cardLast4: '4242'
                })
            });
            
            if (!paymentResponse.ok) {
                throw new Error('Payment failed');
            }
            
            setTimeout(() => {
                setIsProcessing(false);
                setPaymentStep(3);
            }, 1500);
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        {paymentStep === 1 ? (
                            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
                                <X size={20} />
                            </button>
                        ) : paymentStep === 2 ? (
                            <button onClick={() => setPaymentStep(1)} className="p-2 hover:bg-slate-200 rounded-full">
                                <ArrowLeft size={20} />
                            </button>
                        ) : null}
                        <h2 className="font-bold text-lg">
                            {paymentStep === 3 ? 'Booking Confirmed' : 'Checkout'}
                        </h2>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                className={`w-2 h-2 rounded-full ${paymentStep >= s ? 'bg-orange-500' : 'bg-slate-200'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {/* Step 1: Booking Info */}
                    {paymentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <img src={service.image} className="w-20 h-20 rounded-xl object-cover" alt={service.name} />
                                <div>
                                    <h3 className="font-bold text-lg">{service.name}</h3>
                                    <p className="text-sm text-slate-500">{service.type} • {service.location}</p>
                                    <p className="text-orange-600 font-bold mt-1">${service.basePrice}.00</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold">Select Date & Time</h4>
                                <div>
                                    <label className="text-sm text-slate-500 mb-2 block">Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border rounded-xl font-medium focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-500 mb-2 block">Time</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setSelectedTime(t)}
                                                className={`p-3 border rounded-xl text-sm font-medium transition-all ${
                                                    selectedTime === t
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'hover:border-orange-500 hover:text-orange-600'
                                                }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setPaymentStep(2)}
                                disabled={!selectedTime || !selectedDate}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm & Proceed to Payment <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {paymentStep === 2 && (
                        <div className="space-y-6">
                            <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
                                <div className="relative z-10">
                                    <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Card Holder</p>
                                    <p className="font-bold text-lg mb-6">{user.name}</p>
                                    <div className="flex justify-between items-end">
                                        <p className="font-mono text-xl tracking-wider">**** **** **** 4242</p>
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 bg-red-500/80 rounded-full"></div>
                                            <div className="w-8 h-8 bg-yellow-500/80 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Service Fee</span>
                                    <span className="font-medium">${service.basePrice}.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Processing Fee</span>
                                    <span className="font-medium">$2.50</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>Total Amount</span>
                                    <span className="text-orange-600">${service.basePrice + 2.5}.00</span>
                                </div>
                            </div>

                            <button
                                disabled={isProcessing}
                                onClick={processPayment}
                                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-200"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing Securely...
                                    </>
                                ) : (
                                    <>Pay ${service.basePrice + 2.5}.00 Now</>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {paymentStep === 3 && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Success!</h3>
                            <p className="text-slate-500 mb-8">
                                Your appointment with {service.name} has been booked. A confirmation email has been sent to {user.email}.
                            </p>
                            <button
                                onClick={onClose}
                                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold"
                            >
                                Back to Explore
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
