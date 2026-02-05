import React, { useState, useMemo } from 'react';
import LoginScreen from './components/Auth/LoginScreen';
import Navbar from './components/Navigation/Navbar';
import DiscoverTab from './components/Discover/DiscoverTab';
import EventsTab from './components/Events/EventsTab';
import AppointmentsTab from './components/Appointments/AppointmentsTab';
import ProfileTab from './components/Profile/ProfileTab';
import CheckoutModal from './components/Checkout/CheckoutModal';
import PremiumModal from './components/Modals/PremiumModal';
import { SERVICES, EVENTS, PET_OPTIONS } from './constants/mockData';

const App = () => {
    // Auth State
    const [user, setUser] = useState(null);

    // App State
    const [activeTab, setActiveTab] = useState('discover');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPet, setSelectedPet] = useState('All');
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);

    // Payment/Checkout State
    const [checkoutService, setCheckoutService] = useState(null);

    // Filtered services based on search and pet type
    const filteredServices = useMemo(() => {
        return SERVICES.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPet = selectedPet === 'All' || service.petTypes.includes(selectedPet);
            return matchesSearch && matchesPet;
        });
    }, [searchQuery, selectedPet]);

    // Handle booking action
    const handleBooking = (service) => {
        if (!user?.isPremium) {
            setShowPremiumModal(true);
        } else {
            setCheckoutService(service);
        }
    };

    // Handle login
    const handleLogin = (userData) => {
        setUser(userData);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setActiveTab('discover');
    };

    // Handle premium upgrade
    const handlePremiumUpgrade = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/upgrade-premium', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setUser({ ...user, isPremium: true });
                setShowPremiumModal(false);
            }
        } catch (error) {
            console.error('Premium upgrade failed:', error);
        }
    };

    // Handle pet filter change
    const handlePetChange = (pet) => {
        setSelectedPet(pet);
        setIsPetDropdownOpen(false);
    };

    // Show Login Screen if not authenticated
    if (!user) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    // Main App Screen
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
            {/* Navigation */}
            <Navbar
                user={user}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onLogout={handleLogout}
                onMobileMenuOpen={() => setMobileMenuOpen(true)}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 md:px-8">
                {activeTab === 'discover' && (
                    <DiscoverTab
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        isPremiumUser={user.isPremium}
                        onPremiumModalOpen={() => setShowPremiumModal(true)}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedPet={selectedPet}
                        onPetChange={handlePetChange}
                        petOptions={PET_OPTIONS}
                        isDropdownOpen={isPetDropdownOpen}
                        onDropdownToggle={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
                        onDropdownClose={() => setIsPetDropdownOpen(false)}
                        filteredServices={filteredServices}
                        onBooking={handleBooking}
                    />
                )}

                {activeTab === 'events' && (
                    <EventsTab events={EVENTS} />
                )}

                {activeTab === 'appointments' && (
                    <AppointmentsTab 
                        onNavigateToDiscover={() => setActiveTab('discover')} 
                        user={user}
                    />
                )}

                {activeTab === 'profile' && (
                    <ProfileTab user={user} onLogout={handleLogout} />
                )}
            </main>

            {/* Checkout Modal */}
            {checkoutService && (
                <CheckoutModal
                    service={checkoutService}
                    user={user}
                    onClose={() => setCheckoutService(null)}
                />
            )}

            {/* Premium Upgrade Modal */}
            {showPremiumModal && (
                <PremiumModal
                    onClose={() => setShowPremiumModal(false)}
                    onUpgrade={handlePremiumUpgrade}
                />
            )}
        </div>
    );
};

export default App;
