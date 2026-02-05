import React from 'react';
import { Dog, Menu, User, Crown, LogOut } from 'lucide-react';

const Navbar = ({ user, activeTab, onTabChange, onLogout, onMobileMenuOpen }) => {
    return (
        <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 md:px-8">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onTabChange('discover')}
                >
                    <div className="bg-orange-500 p-2 rounded-xl">
                        <Dog className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-orange-600">PawConnect</h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
                    {['Discover', 'Events', 'Appointments'].map((item) => (
                        <button
                            key={item}
                            onClick={() => onTabChange(item.toLowerCase())}
                            className={activeTab === item.toLowerCase() ? 'text-orange-600' : 'text-slate-500'}
                        >
                            {item}
                        </button>
                    ))}

                    {/* User Profile Section */}
                    <div className="flex items-center gap-4 border-l pl-4 border-slate-200">
                        <button
                            onClick={() => onTabChange('profile')}
                            className={`flex items-center gap-2 ${user.isPremium ? 'text-yellow-700' : 'text-slate-700'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.isPremium ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                                {user.isPremium ? <Crown size={14} /> : <User size={14} />}
                            </div>
                            {user.name}
                        </button>
                        <button
                            onClick={onLogout}
                            className="text-slate-400 hover:text-red-500"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={onMobileMenuOpen}
                >
                    <Menu />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
