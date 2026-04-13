'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link'; // ✅ FIX WAJIB

export default function BorrowPage() {
  const [borrowings, setBorrowings] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  const [formData, setFormData] = useState({
    user_id: '', 
    book_id: '', 
    borrow_date: new Date().toISOString().split('T')[0],
    return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Cek role user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      if (u) setUserRole(JSON.parse(u).role);
    }
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('📡 Memuat data transaksi...');
        const [bRes, bkRes, mRes] = await Promise.all([
          apiFetch('/borrowings'), 
          apiFetch('/books'), 
          apiFetch('/members')
        ]);
        
        console.log('📥 Response borrowings:', bRes.status);
        
        const [bData, bkData, mData] = await Promise.all([
          bRes.json(), bkRes.json(), mRes.json()
        ]);
        
        console.log('📦 Data borrowings:', bData);
        
        setBorrowings(bData.data || bData);
        setBooks(bkData.data || bkData);
        setMembers(mData.data || mData);
      } catch (err) {
        console.error('❌ Gagal load data:', err);
        alert('Gagal memuat data: ' + (err.message || 'Cek console untuk detail'));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Kembalikan buku
  const handleReturn = async (id) => {
    if (!confirm('Tandai buku ini sebagai DIKEMBALIKAN?')) return;
    try {
      const res = await apiFetch(`/borrowings/${id}/return`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        const fresh = await apiFetch('/borrowings');
        const json = await fresh.json();
        setBorrowings(json.data || json);
      } else {
        alert('❌ ' + (data.message || 'Gagal'));
      }
    } catch (err) {
      console.error('Return error:', err);
      alert('❌ Error jaringan: ' + err.message);
    }
  };

  // Submit peminjaman baru (Admin)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📤 Mengirim data:', formData);
      const res = await apiFetch('/borrowings', {
        method: 'POST',
        body: JSON.stringify({
          user_id: parseInt(formData.user_id),
          book_id: parseInt(formData.book_id),
          borrow_date: formData.borrow_date,
          return_date: formData.return_date
        })
      });
      const data = await res.json();
      console.log('📥 Response:', data);
      
      if (res.ok) {
        alert('✅ ' + data.message);
        setShowModal(false);
        const fresh = await apiFetch('/borrowings');
        setBorrowings((await fresh.json()).data || []);
      } else {
        alert('❌ ' + (data.message || 'Gagal'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ Error jaringan: ' + err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Memuat transaksi...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🔄 Transaksi Peminjaman</h1>
            <p className="text-sm text-gray-500">Kelola catatan pinjam & kembali buku</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 hover:underline mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
          
          {userRole === 'admin' && (
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-md"
            >
              ➕ Peminjaman Baru
            </button>
            
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Peminjam</th>
                <th className="px-6 py-4">Buku</th>
                <th className="px-6 py-4">Tgl Pinjam</th>
                <th className="px-6 py-4">Tgl Kembali</th>
                <th className="px-6 py-4 text-center">Status</th>
                {userRole === 'admin' && <th className="px-6 py-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {borrowings.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'admin' ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi peminjaman.
                  </td>
                </tr>
              ) : (
                borrowings.map((b) => (
                  <tr key={b.id} className="hover:bg-purple-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {b.user?.name || `ID: ${b.user_id}`}
                    </td>
                    <td className="px-6 py-4">{b.book?.title || `ID: ${b.book_id}`}</td>
                    <td className="px-6 py-4">{new Date(b.borrow_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">{b.return_date ? new Date(b.return_date).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {b.status === 'returned' ? '✅ Selesai' : '🟡 Dipinjam'}
                      </span>
                    </td>
                    {userRole === 'admin' && (
                      <td className="px-6 py-4 text-center">
                        {b.status !== 'returned' && (
                          <button 
                            onClick={() => handleReturn(b.id)} 
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition"
                          >
                            Kembalikan
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Tambah Peminjaman (Admin Only) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Catat Peminjaman Baru</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anggota</label>
                  <select 
                    value={formData.user_id} 
                    onChange={(e) => setFormData({...formData, user_id: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
                    required
                  >
                    <option value="">Pilih anggota</option>
                    {members.filter(m => m.role === 'siswa').map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.nis})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buku</label>
                  <select 
                    value={formData.book_id} 
                    onChange={(e) => setFormData({...formData, book_id: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" 
                    required
                  >
                    <option value="">Pilih buku</option>
                    {books.filter(b => b.stock > 0).map(b => (
                      <option key={b.id} value={b.id}>{b.title} (Stok: {b.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Pinjam</label>
                    <input 
                      type="date" 
                      value={formData.borrow_date} 
                      onChange={(e) => setFormData({...formData, borrow_date: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Kembali</label>
                    <input 
                      type="date" 
                      value={formData.return_date} 
                      onChange={(e) => setFormData({...formData, return_date: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" 
                      required 
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold">
                    Simpan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}