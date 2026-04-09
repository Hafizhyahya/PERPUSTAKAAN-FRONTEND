'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function MyBorrowsPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Ambil user ID dari localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      if (u) setUserId(JSON.parse(u).id);
    }
  }, []);

  // Load data peminjaman milik user ini
  useEffect(() => {
    if (!userId) return;

    const fetchMyBorrows = async () => {
      try {
        console.log('📡 Memuat peminjaman user ID:', userId);
        const res = await apiFetch('/borrowings');
        const json = await res.json();
        const all = json.data || json;

        // Filter: hanya milik user ini DAN status masih 'borrowed'
        const mine = all.filter(b =>
          b.user_id === parseInt(userId) && b.status === 'borrowed'
        );

        console.log('📦 Peminjaman aktif:', mine);
        setBorrowings(mine);
      } catch (err) {
        console.error('❌ Gagal load data:', err);
        alert('Gagal memuat data peminjaman');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBorrows();
  }, [userId]);

  // Fungsi kembalikan buku
  const handleReturn = async (id, bookTitle) => {
    if (!confirm(`Kembalikan buku "${bookTitle}"?`)) return;
    try {
      const res = await apiFetch(`/borrowings/${id}/return`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        // Hapus dari list setelah dikembalikan
        setBorrowings(prev => prev.filter(b => b.id !== id));
      } else {
        alert('❌ ' + (data.message || 'Gagal mengembalikan'));
      }
    } catch (err) {
      console.error('Return error:', err);
      alert('❌ Error jaringan: ' + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Memuat data...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 hover:underline mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📖 Pengembalian Buku</h1>
            <p className="text-sm text-gray-500">Daftar buku yang sedang Anda pinjam</p>
          </div>
          <Link href="/books" className="text-purple-600 font-medium hover:underline text-sm">
            ← Pinjam Buku Lagi
          </Link>
        </div>

        {borrowings.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-semibold text-gray-900">Tidak ada peminjaman aktif</h3>
            <p className="text-gray-500 text-sm mt-1">
              Semua buku sudah dikembalikan atau belum ada peminjaman.
            </p>
            <Link href="/books" className="inline-block mt-4 text-purple-600 font-medium hover:underline">
              Cari Buku untuk Dipinjam →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {borrowings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    📚
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {b.book?.title || 'Buku #' + b.book_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Dipinjam: {new Date(b.borrow_date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-xs text-orange-500 font-medium mt-1">
                      📅 Batas kembali: {b.return_date ? new Date(b.return_date).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleReturn(b.id, b.book?.title)}
                  className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-md whitespace-nowrap"
                >
                  ✅ Kembalikan Buku
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}