import React, { useState } from 'react';
import { Dog, Mail, Lock, AlertCircle } from 'lucide-react';
import RegisterScreen from './RegisterScreen';

const LoginScreen = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showTestAccounts, setShowTestAccounts] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            // Store token in localStorage
            localStorage.setItem('token', data.data.token);
            
            // Call onLogin with user data
            onLogin(data.data.user);
        } catch (err) {
            setError('Unable to connect to server. Please make sure the backend is running.');
            setIsLoading(false);
        }
    };

    const handleTestLogin = (testEmail, testPassword) => {
        setEmail(testEmail);
        setPassword(testPassword);
        setShowTestAccounts(false);
    };

    // Show registration screen if user wants to register
    if (showRegister) {
        return (
            <RegisterScreen
                onRegisterSuccess={onLogin}
                onSwitchToLogin={() => setShowRegister(false)}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                        <Dog className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">PawConnect</h1>
                    <p className="text-slate-500 mt-2">Connecting hearts and paws.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                    <h2 className="text-xl font-bold mb-6 text-center">Sign In</h2>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <button
                            onClick={() => setShowTestAccounts(!showTestAccounts)}
                            className="w-full text-sm text-slate-500 hover:text-orange-600 transition-all"
                        >
                            {showTestAccounts ? 'Hide test accounts' : 'Use test account'}
                        </button>

                        {showTestAccounts && (
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={() => handleTestLogin('alex@pawpremium.com', 'premium123')}
                                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all"
                                >
                                    <p className="text-sm font-bold">Premium User</p>
                                    <p className="text-xs text-slate-500">alex@pawpremium.com</p>
                                </button>
                                <button
                                    onClick={() => handleTestLogin('sam@petlover.com', 'free123')}
                                    className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-orange-500 hover:bg-orange-50 transition-all"
                                >
                                    <p className="text-sm font-bold">Free User</p>
                                    <p className="text-xs text-slate-500">sam@petlover.com</p>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setShowRegister(true)}
                                className="text-orange-600 font-bold hover:text-orange-700 transition-all"
                            >
                                Create Account
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
