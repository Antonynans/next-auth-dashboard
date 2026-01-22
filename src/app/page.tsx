import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Welcome to Auth App
        </h1>
        <p className="text-gray-600 mb-8">
          A simple Next.js authentication system with cookies
        </p>

        {session ? (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">
              You are logged in as {session.email}
            </p>
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
