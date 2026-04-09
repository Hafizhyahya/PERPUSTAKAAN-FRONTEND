'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function BorrowingHistoryPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'borrowed', 'returned'

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      try {
        const res = await apiFetch('/borrowings');
        const json = await res.json();
        let all = json.data || json;
        
        // Jika siswa, filter hanya milik sendiri
        if (user.role === 'siswa') {
          all = all.filter(b => b.user_id === parseInt(user.id));
        }
        
        // Apply filter status
        if (filter !== 'all') {
          all = all.filter(b => b.status === filter);
        }
        
        setBorrowings(all.sort((a, b) => new Date(b.borrow_date) - new Date(a.borrow_date)));
      } catch {
        alert('Gagal memuat riwayat');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user, filter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            
            <h1 className="text-2xl font-bold text-gray-900">📜 Riwayat Peminjaman</h1>
            <p className="text-sm text-gray-500">
              {user?.role === 'admin' ? 'Semua transaksi peminjaman' : 'Riwayat peminjamanmu'}
            </p>
          </div>
          <Link href="/dashboard" className="text-purple-600 font-medium hover:underline text-sm">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'Semua' },
            { value: 'borrowed', label: 'Sedang Dipinjam' },
            { value: 'returned', label: 'Sudah Dikembalikan' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">Memuat riwayat...</div>
          ) : borrowings.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Tidak ada data peminjaman.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Buku</th>
                    {user?.role === 'admin' && <th className="px-6 py-4">Peminjam</th>}
                    <th className="px-6 py-4">Tgl Pinjam</th>
                    <th className="px-6 py-4">Tgl Kembali</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {borrowings.map((b) => (
                    <tr key={b.id} className="hover:bg-purple-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {b.book?.title || `ID: ${b.book_id}`}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4">{b.user?.name || `ID: ${b.user_id}`}</td>
                      )}
                      <td className="px-6 py-4">{new Date(b.borrow_date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">{b.return_date ? new Date(b.return_date).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'returned' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {b.status === 'returned' ? '✅ Selesai' : '🟡 Dipinjam'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}