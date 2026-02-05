import React from 'react';
import { User, Crown, LogOut } from 'lucide-react';

const ProfileTab = ({ user, onLogout }) => {
    return (
        <div className="max-w-xl mx-auto py-10">
            <div className={`p-10 rounded-[3rem] text-center shadow-2xl ${user.isPremium
                    ? 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white'
                    : 'bg-white border'
                }`}>
                <div className="w-24 h-24 rounded-full bg-white/30 mx-auto mb-4 border-4 border-white/50 flex items-center justify-center">
                    <User size={40} />
                </div>

                <h2 className="text-3xl font-black">{user.name}</h2>
                <p className="opacity-80 mb-6">{user.email}</p>

                {user.isPremium && (
                    <div className="bg-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2 font-bold">
                        <Crown size={18} /> Premium Active
                    </div>
                )}
            </div>

            <button
                onClick={onLogout}
                className="w-full mt-8 p-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
                <LogOut /> Log Out
            </button>
        </div>
    );
};

export default ProfileTab;
