import { getSession } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <form action={logout}>
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Welcome, {session.email}!
          </h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-mono text-sm mt-1">{session.userId}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium mt-1">{session.email}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Session Expires</p>
              <p className="font-medium mt-1">
                {new Date(session.expiresAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Authentication Successful!
            </h3>
            <p className="text-green-700">
              You are now logged in with a secure HTTP-only cookie. This session is protected
              and will automatically refresh as you use the app.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}