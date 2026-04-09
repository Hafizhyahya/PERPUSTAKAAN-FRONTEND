'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    nis: '',
    class: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email salah';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password min. 6 karakter';
    if (!formData.nis.trim()) newErrors.nis = 'NIS wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // ✅ Debug: Cek token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('🔑 Token:', token ? 'ADA' : 'TIDAK ADA');
    console.log('📤 Mengirim data ke:', 'http://localhost:8000/api/members');
    console.log('📦 Data:', { ...formData, role: 'siswa' });

    try {
      const res = await fetch('http://localhost:8000/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          role: 'siswa',
        }),
      });

      console.log('📥 Response status:', res.status);
      console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log('📥 Response data:', data);

      if (res.ok) {
        alert('✅ Anggota berhasil ditambahkan!');
        router.push('/members');
      } else {
        // Tampilkan error validasi Laravel
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join('\n');
          alert(`❌ Validasi gagal:\n${messages}`);
          setErrors(data.errors);
        } else {
          alert(`❌ Gagal: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      console.error('❌ Error type:', err.type);
      console.error('❌ Error message:', err.message);
      
      // Cek apakah ini CORS error
      if (err.type === 'cors' || err.message === 'Failed to fetch') {
        alert('❌ CORS ERROR!\n\nPastikan:\n1. Laravel berjalan di port 8000\n2. Sudah jalankan: php artisan config:clear\n3. Restart server Laravel (Ctrl+C lalu php artisan serve)\n4. Cek config/cors.php sudah benar');
      } else {
        alert('❌ Error jaringan. Buka Console (F12) untuk detail.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/members" className="p-2 hover:bg-purple-100 rounded-lg transition text-gray-600">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Anggota Baru</h1>
            <p className="text-sm text-gray-500">Isi data siswa dengan lengkap</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Contoh: Aisyah Putri"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="siswa{new Date().getTime()}@sekolah.sch.id"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Min. 6 karakter"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* NIS & Kelas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIS <span className="text-red-500">*</span></label>
                <input
                  type="text" name="nis" value={formData.nis} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="12345678"
                />
                {errors.nis && <p className="text-red-500 text-xs mt-1">{errors.nis}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas <span className="text-red-500">*</span></label>
                <input
                  type="text" name="class" value={formData.class} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="XII RPL 1"
                />
              </div>
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp (Opsional)</label>
              <input
                type="text" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="0812..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit" disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md shadow-purple-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Anggota'}
              </button>
              <Link
                href="/members"
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}