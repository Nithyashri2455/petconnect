import React, { useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const FilterBar = ({
    searchQuery,
    onSearchChange,
    selectedPet,
    onPetChange,
    petOptions,
    isDropdownOpen,
    onDropdownToggle,
    onDropdownClose
}) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onDropdownClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onDropdownClose]);

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Pet Type Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={onDropdownToggle}
                    className="flex items-center justify-between gap-3 w-full md:w-48 px-6 py-3 rounded-2xl bg-white border border-slate-200 font-bold"
                >
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-orange-600" />
                        {selectedPet}
                    </div>
                    <ChevronDown size={14} />
                </button>

                {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border rounded-2xl shadow-xl overflow-hidden py-2">
                        {petOptions.map(pet => (
                            <button
                                key={pet}
                                onClick={() => onPetChange(pet)}
                                className={`w-full text-left px-6 py-2 hover:bg-slate-50 ${selectedPet === pet ? 'text-orange-600 bg-orange-50' : ''
                                    }`}
                            >
                                {pet}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
