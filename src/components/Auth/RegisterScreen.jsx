import { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const RegisterScreen = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Call success callback
        if (onRegisterSuccess) {
          onRegisterSuccess(response.data.user);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');

    try {
      // Decode the JWT credential to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      
      // Send to backend
      const response = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Call success callback
        if (onRegisterSuccess) {
          onRegisterSuccess(response.data.data.user);
        }
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was cancelled or failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-300">
            <span className="text-4xl">🐾</span>
          </div>
          <h1 className="text-3xl font-black text-orange-600">PawConnect</h1>
          <p className="text-orange-500 mt-2 font-medium">Join our community today</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 border-orange-200">
          <h2 className="text-xl font-bold mb-6 text-center text-orange-600">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Create a password (min. 6 characters)"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-600 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-3">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-orange-200">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-orange-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="signup_with"
              width="100%"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-orange-700">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-all"
            >
              Sign In
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
