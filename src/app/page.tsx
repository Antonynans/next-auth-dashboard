import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Solid background */}
      <div className="absolute inset-0 bg-indigo-700 -z-20" />

      {/* Animated background shapes */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10" />
      <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10" />
      <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 -z-10" />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header with icon effect */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-75" />
              <div className="relative bg-white px-4 py-2 rounded-full">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3 text-indigo-700 text-center">
            Welcome to Auth App
          </h1>

          <p className="text-gray-600 mb-8 text-center text-sm">
            Secure authentication system with email verification
          </p>

          {session ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-700">✓ Logged in as</p>
                <p className="text-lg font-semibold text-green-900">
                  {session.email}
                </p>
              </div>
              <Link
                href="/dashboard"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/api/auth/logout"
                className="block w-full bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-all"
              >
                Sign Out
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="block w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Footer info */}
          <p className="text-xs text-gray-500 text-center mt-6 border-t border-gray-200 pt-4">
            Built with Next.js • Secure by default
          </p>
        </div>
      </div>

      {/* CSS for blob animation */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
