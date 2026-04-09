'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) setUserRole(JSON.parse(userData).role);
    }
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiFetch('/members');
        const result = await res.json();
        setMembers(result.data || result);
      } catch {
        alert('Gagal memuat data anggota');
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Yakin hapus anggota "${name}"?`)) return;
    try {
      const res = await apiFetch(`/members/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert('✅ ' + data.message);
        setMembers(prev => prev.filter(m => m.id !== id));
      } else alert('❌ ' + (data.message || 'Gagal'));
    } catch { alert('❌ Error jaringan'); }
  };

  const handleEdit = (id) => router.push(`/members/edit/${id}`);

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.nis?.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 hover:underline mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">👥 Data Anggota</h1>
            <p className="text-sm text-gray-500">Kelola data siswa & admin perpustakaan</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text" placeholder="Cari nama / NIS..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {userRole === 'admin' && (
              <Link href="/members/create" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-md whitespace-nowrap">
                ➕ Tambah
              </Link>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              {search ? '🔍 Data tidak ditemukan' : '📭 Belum ada anggota.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">NIS</th>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Role</th>
                    {userRole === 'admin' && <th className="px-6 py-4 text-center">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-purple-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{m.name}</td>
                      <td className="px-6 py-4 font-mono text-xs">{m.nis || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                          {m.class || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 truncate max-w-[150px]">{m.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          m.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {m.role === 'admin' ? '👑 Admin' : '🎓 Siswa'}
                        </span>
                      </td>
                      {userRole === 'admin' && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleEdit(m.id)} className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition" title="Edit">✏️</button>
                            <button onClick={() => handleDelete(m.id, m.name)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus">🗑️</button>
                          </div>
                        </td>
                      )}
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