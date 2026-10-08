'use client';

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { userService } from '@/services/userService';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError('');

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Create or update user profile in Firestore
      await userService.createOrUpdate(result.user.uid, {
        email: result.user.email || '',
        name: result.user.displayName || '',
        profileImage: result.user.photoURL || '',
        nationality: '',
        phone: '',
      });

      // Redirect to dashboard after registration
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please login instead.');
      } else {
        setError('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Register Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✈️</div>
              <h1 className="text-3xl font-bold text-dark-900 mb-3">
                Create Account
              </h1>
              <p className="text-dark-700 text-lg">
                Start your travel journey with us
              </p>
            </div>

            {/* Google Register Button */}
            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-dark-900 font-semibold text-lg group-hover:text-primary transition-colors">
                {loading ? 'Creating account...' : 'Sign up with Google'}
              </span>
            </button>

            {/* Security Message */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure registration with Google</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-dark-700">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-semibold hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
