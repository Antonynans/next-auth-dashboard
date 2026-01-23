'use client';

import { requestPasswordReset } from '@/app/actions/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit(formData: FormData) {
    setError('');
    setSuccess('');
    
    const result = await requestPasswordReset(formData);
    if (result.success) {
      setSuccess(result.message || 'Password reset email sent!');
    } else {
      setError(result.message || 'Failed to send reset email');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h1>

        <p className="text-gray-600 mb-6 text-center">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
            <p className="mt-2 text-sm">
              Check your email for the reset link.
            </p>
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-medium"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link href="/login" className="text-orange-600 hover:underline font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
