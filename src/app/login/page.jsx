'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' atau 'siswa'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Format email tidak valid';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Pilih endpoint berdasarkan role
      const endpoint = selectedRole === 'admin' 
        ? 'http://localhost:8000/api/login-admin'
        : 'http://localhost:8000/api/login-siswa';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Simpan token & user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(`✅ Login ${selectedRole} berhasil!`);
        router.push('/dashboard');
      } else {
        alert(`❌ ${data.message || 'Login gagal'}`);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Gagal menghubungi server. Pastikan Laravel berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3 shadow-lg shadow-purple-200">
            📚
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PerpusBook</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Perpustakaan Digital</p>
        </div>

        {/* Pilihan Role */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
              selectedRole === 'admin'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👨‍💼 Login Admin
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('siswa')}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
              selectedRole === 'siswa'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🎓 Login Siswa
          </button>
        </div>

        {/* Info Role */}
        {selectedRole === 'siswa' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
            💡 <strong>Info:</strong> Siswa harus terdaftar sebagai anggota terlebih dahulu. Hubungi admin untuk pendaftaran.
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder={selectedRole === 'admin' ? 'admin@perpus.local' : 'siswa@sekolah.sch.id'}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-md shadow-purple-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : `Login sebagai ${selectedRole === 'admin' ? 'Admin' : 'Siswa'}`}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2026 PerpusBook • Sistem Perpustakaan Digital</p>
        </div>
      </div>
    </div>
  );
}