import React from 'react';
import { LayoutGrid, MapIcon, Lock } from 'lucide-react';
import ServiceCard from './ServiceCard';
import MapView from './MapView';
import FilterBar from './FilterBar';

const DiscoverTab = ({
    viewMode,
    onViewModeChange,
    isPremiumUser,
    onPremiumModalOpen,
    searchQuery,
    onSearchChange,
    selectedPet,
    onPetChange,
    petOptions,
    isDropdownOpen,
    onDropdownToggle,
    onDropdownClose,
    filteredServices,
    onBooking
}) => {
    return (
        <>
            {/* Header with View Toggle */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold mb-2">Find the best services.</h2>
                    <p className="text-slate-500">Verified professionals in your neighborhood.</p>
                </div>

                {/* Grid/Map Toggle */}
                <div className="bg-slate-200/50 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => isPremiumUser ? onViewModeChange('map') : onPremiumModalOpen()}
                        className={`p-2 rounded-lg transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <MapIcon size={20} />
                        {!isPremiumUser && <Lock size={12} />}
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                selectedPet={selectedPet}
                onPetChange={onPetChange}
                petOptions={petOptions}
                isDropdownOpen={isDropdownOpen}
                onDropdownToggle={onDropdownToggle}
                onDropdownClose={onDropdownClose}
            />

            {/* Content: Grid or Map View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            isPremiumUser={isPremiumUser}
                            onBooking={onBooking}
                        />
                    ))}
                </div>
            ) : (
                <MapView
                    services={filteredServices}
                    onServiceClick={onBooking}
                />
            )}
        </>
    );
};

export default DiscoverTab;
