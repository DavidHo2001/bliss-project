'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserService } from '@/services/user.service';
import { authStorage } from '@/lib/auth';
import { User } from '@/types/user';

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHkid, setShowHkid] = useState(false);

  const currentUser = authStorage.getUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const maskHkid = (hkid: string): string => {
    if (hkid.length <= 4) return '****';
    return `${hkid[0]}${'*'.repeat(hkid.length - 4)}${hkid.slice(-5)}`;
  };

  const fetchUser = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) return router.push('/login');

    try {
      const data = await UserService.getById(Number(id));
      setUser(data);
    } catch {
      router.push('/user');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // automatically refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(fetchUser, 60000);
    return () => clearInterval(interval);
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push('/user')}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">User Detail</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          {/* Info Rows */}
          {[
            { label: 'ID', value: user.id },
            { label: 'Name', value: user.name },
            { label: 'Age', value: user.age },
            { label: 'Email', value: user.email },
            { label: 'Role', value: user.role },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between border-b pb-3">
              <span className="text-gray-500 font-medium">{label}</span>
              <span className="text-gray-800">{String(value)}</span>
            </div>
          ))}

          {/* HKID Row e.g. A1234567 → A****56(7) */}
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-500 font-medium">HKID</span>
            <div className="flex items-center gap-3">
              <span className="text-gray-800 font-mono">
                {isAdmin && showHkid ? user.hkid : maskHkid(user.hkid)}
              </span>
              {isAdmin && (
                <button
                  onClick={() => setShowHkid((prev) => !prev)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition"
                >
                  {showHkid ? 'Hide' : 'Reveal'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
