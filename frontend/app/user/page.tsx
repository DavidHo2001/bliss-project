'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/services/user.service';
import { authStorage } from '@/lib/auth';
import { User } from '@/types/user';

const LIMIT = 10;

export default function UserListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Replace is true when it is refresh / first load
  // Replace is false when it is infinite scroll
  const fetchUsers = useCallback(async (pageNum: number, replace = false) => {
    const token = authStorage.getToken();
    if (!token) return router.push('/login');

    setLoading(true);
    try {
      const data = await UserService.getAll(pageNum, LIMIT);
      setTotalPages(data.totalPages);
      setUsers((prev) => replace ? data.data : [...prev, ...data.data]);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUsers(1, true);
  }, [fetchUsers]);

  // automatically refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setPage(1);
      fetchUsers(1, true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && page < totalPages) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchUsers(nextPage);
      }
    });

    if (bottomRef.current) observerRef.current.observe(bottomRef.current);
  }, [loading, page, totalPages, fetchUsers]);

  const handleLogout = () => {
    authStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition"
        >
          Logout
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Age</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-500">{user.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.age}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/user/${user.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Loading indicator */}
          {loading && (
            <div className="text-center py-4 text-gray-400 text-sm">Loading...</div>
          )}

          {/* Infinite scroll trigger */}
          <div ref={bottomRef} className="h-1" />
        </div>
      </main>
    </div>
  );
}
