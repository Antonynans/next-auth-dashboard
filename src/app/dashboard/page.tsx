import { getSession } from '@/lib/auth';
import { logout } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  // Check both custom session and NextAuth session
  const customSession = await getSession();
  const nextAuthSession = await getServerSession(authOptions);

  const session = customSession || (nextAuthSession?.user ? {
    userId: nextAuthSession.user.id,
    email: nextAuthSession.user.email || '',
    // expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  } : null);

  if (!session) {
    redirect('/login');
  }

  const isOAuthUser = !customSession && nextAuthSession;

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
            {isOAuthUser ? (
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-gray-600">Login Method</p>
                <p className="font-medium mt-1 flex items-center gap-2">
                  <span>OAuth ({nextAuthSession?.user?.name || 'Social Login'})</span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                    {nextAuthSession?.user?.email?.includes('google') ? 'Google' : 'GitHub'}
                  </span>
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-mono text-sm mt-1">{session.userId}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Session Expires</p>
                  {/* <p className="font-medium mt-1">
                    {new Date(session.expiresAt).toLocaleString()}
                  </p> */}
                </div>
              </>
            )}
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium mt-1">{session.email}</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Authentication Successful!
            </h3>
            <p className="text-green-700">
              {isOAuthUser 
                ? 'You are logged in via OAuth. Your session is managed by NextAuth and will persist across browser sessions.'
                : 'You are logged in with a secure HTTP-only cookie. This session is protected and will automatically refresh as you use the app.'
              }
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
