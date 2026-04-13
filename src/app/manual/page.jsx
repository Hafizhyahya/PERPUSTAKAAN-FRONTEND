'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManualPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) setUserRole(JSON.parse(userData).role);
    }
  }, []);

  const adminSteps = [
    {
      step: '1',
      title: 'Login sebagai Admin',
      desc: 'Gunakan email admin@perpus.local dan password 123456 (atau sesuai akun yang dibuat).',
      icon: '🔐'
    },
    {
      step: '2',
      title: 'Kelola Data Buku',
      desc: 'Menu Data Buku → Tambah/Edit/Hapus buku. Upload cover buku untuk tampilan lebih menarik.',
      icon: '📚'
    },
    {
      step: '3',
      title: 'Kelola Anggota',
      desc: 'Menu Data Anggota → Tambah/Edit/Hapus data siswa. Pastikan role diatur dengan benar.',
      icon: '👥'
    },
    {
      step: '4',
      title: 'Proses Peminjaman',
      desc: 'Menu Transaksi → Lihat daftar peminjaman. Admin bisa mencatat peminjaman untuk anggota.',
      icon: '🔄'
    },
    {
      step: '5',
      title: 'Kembalikan Buku',
      desc: 'Klik tombol "Kembalikan" pada transaksi → stok buku otomatis bertambah.',
      icon: '✅'
    },
  ];

  const studentSteps = [
    {
      step: '1',
      title: 'Login sebagai Siswa',
      desc: 'Gunakan email yang sudah didaftarkan admin. Password default: 123456.',
      icon: '🔐'
    },
    {
      step: '2',
      title: 'Cari Buku',
      desc: 'Menu Cari Buku → Gunakan search untuk menemukan buku berdasarkan judul/penulis.',
      icon: '🔍'
    },
    {
      step: '3',
      title: 'Pinjam Buku',
      desc: 'Klik tombol "Pinjam" pada buku yang tersedia → konfirmasi → buku tercatat dipinjam.',
      icon: '📥'
    },
    {
      step: '4',
      title: 'Lihat Peminjaman Saya',
      desc: 'Menu Peminjaman Saya → lihat buku yang sedang dipinjam dan tanggal pengembalian.',
      icon: '📖'
    },
    {
      step: '5',
      title: 'Kembalikan Buku',
      desc: 'Klik "Kembalikan Buku" → status berubah menjadi selesai.',
      icon: '📤'
    },
  ];

  const steps = userRole === 'admin' ? adminSteps : studentSteps;
  const title = userRole === 'admin' ? '📘 Panduan Admin' : '📗 Panduan Siswa';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-purple-100 rounded-lg transition text-gray-600"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Panduan penggunaan sistem perpustakaan digital</p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-start gap-4">
                {/* Step Number */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition">
                  {item.step}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{item.icon}</span>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Tips Tambahan</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Gunakan password yang kuat dan jangan bagikan ke orang lain.</li>
            <li>• Pastikan tanggal pengembalian tidak melebihi batas yang ditentukan.</li>
            <li>• Jika lupa password, hubungi admin untuk reset.</li>
            <li>• Cover buku yang diupload maksimal 2MB dengan format JPG/PNG.</li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>PerpusBook • Sistem Perpustakaan Digital Sekolah • © 2026</p>
        </div>

      </div>
    </div>
  );
}