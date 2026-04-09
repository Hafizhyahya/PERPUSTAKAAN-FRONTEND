'use client';

import Link from 'next/link';

export default function LandingPage() {
  // 📚 Data dummy untuk koleksi buku (nanti bisa diganti fetch API)
  const featuredBooks = [
    { id: 1, title: 'Pemrograman Web Modern', author: 'Aisyah Dwi', cover: '💻', stock: 12 },
    { id: 2, title: 'Algoritma & Struktur Data', author: 'Budi Santoso', cover: '🧠', stock: 8 },
    { id: 3, title: 'Database Design', author: 'Siti Nurhaliza', cover: '🗄️', stock: 15 },
    { id: 4, title: 'UI/UX Principles', author: 'Rina Wijaya', cover: '🎨', stock: 5 },
  ];

  // 📊 Data statistik peminjaman
  const borrowingStats = [
    { label: 'Buku Dipinjam Hari Ini', value: '24', icon: '📥' },
    { label: 'Peminjaman Aktif', value: '156', icon: '🔄' },
    { label: 'Buku Dikembalikan', value: '89', icon: '📤' },
    { label: 'Anggota Aktif', value: '342', icon: '👥' },
  ];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-gray-900 selection:bg-purple-200 selection:text-purple-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* ✅ LOGO BARU: Kombinasi Ikon Buku + Teks */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-purple-200 group-hover:scale-105 transition">
                📚
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">PerpusBook</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Digital Library</p>
            </div>
          </Link>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-purple-600 transition">Beranda</Link>
            <Link href="#koleksi" className="hover:text-purple-600 transition">Koleksi</Link>
            <Link href="#peminjaman" className="hover:text-purple-600 transition">Peminjaman</Link>
            <Link href="#tentang" className="hover:text-purple-600 transition">Tentang</Link>
          </div>
          <Link
            href="/login"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-md shadow-purple-200"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 pb-24 px-6 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Platform Perpustakaan Digital #1
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Jangan Salah Pinjam!<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Sistem Peminjaman Buku Modern
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Kelola peminjaman, lacak koleksi, dan akses perpustakaan sekolah secara online. Praktis, rapi, dan efisien untuk siswa maupun petugas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition shadow-lg shadow-purple-200"
            >
              Mulai Pinjam Buku
            </Link>
            <Link
              href="#koleksi"
              className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              Lihat Koleksi →
            </Link>
          </div>

          {/* Clean Hero Visual */}
          <div className="mt-16 relative max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {['📚 Koleksi', '🔍 Cari', '📅 Jadwal', '✅ Verifikasi'].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="text-2xl mb-2">{item.split(' ')[0]}</div>
                    <div className="text-sm font-medium text-gray-700">{item.split(' ')[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Soft decorative blurs */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* ✅ SECTION BARU: KOLEKSI BUKU */}
      <section id="koleksi" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">📚 Koleksi Terbaru</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Jelajahi ribuan buku dari berbagai kategori. Update rutin setiap minggu!</p>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div 
                key={book.id} 
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-purple-100 hover:border-purple-200 transition cursor-pointer"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition border border-purple-100">
                  {book.cover}
                </div>
                
                {/* Book Info */}
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                
                {/* Stock Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    book.stock > 10 ? 'bg-green-100 text-green-700' : 
                    book.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {book.stock > 0 ? `● Tersedia: ${book.stock}` : '● Stok Habis'}
                  </span>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-700 group-hover:underline">
                    Detail →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link 
              href="/books" 
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition"
            >
              Lihat Semua Koleksi 
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ SECTION BARU: PEMINJAMAN */}
      <section id="peminjaman" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🔄 Peminjaman Mudah</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Proses pinjam & kembali buku jadi lebih cepat dengan sistem digital kami.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {borrowingStats.map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 text-center hover:shadow-md transition">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* How to Borrow */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Cara Meminjam Buku</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', icon: '🔐', title: 'Login Akun', desc: 'Masuk sebagai siswa dengan email & password.' },
                { step: '2', icon: '🔍', title: 'Cari & Pilih', desc: 'Temukan buku, cek stok, klik "Pinjam".' },
                { step: '3', icon: '📋', title: 'Konfirmasi', desc: 'Tunjukkan bukti digital ke petugas perpustakaan.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center text-2xl mb-4">
                    {item.icon}
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-md"
              >
                🚀 Mulai Pinjam Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / TENTANG */}
      <section id="tentang" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk mengelola perpustakaan sekolah dalam satu platform yang sederhana.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔍', title: 'Pencarian Cepat', desc: 'Temukan buku dalam hitungan detik dengan filter cerdas.' },
            { icon: '💻', title: 'Peminjaman Online', desc: 'Ajukan dan kelola peminjaman langsung dari browser.' },
            { icon: '📊', title: 'Dashboard Petugas', desc: 'Pantau stok, riwayat, dan statistik secara real-time.' },
            { icon: '🔔', title: 'Notifikasi Otomatis', desc: 'Pengingat pengembalian dan status peminjaman.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 transition group">
              <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Mengelola Perpustakaan?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
              Bergabung sekarang dan rasakan kemudahan sistem perpustakaan digital yang modern.
            </p>
            <Link
              href="/login"
              className="bg-white text-purple-600 px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-lg inline-block"
            >
              Daftar Gratis Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
              📚
            </div>
            <span className="font-semibold text-white">PerpusBook</span>
          </div>
          <div className="flex gap-8 text-sm">
            {['Beranda', 'Koleksi', 'Panduan', 'Kontak'].map((link) => (
              <Link key={link} href="#" className="hover:text-white transition">
                {link}
              </Link>
            ))}
          </div>
          <div className="text-sm">
            © 2026 PerpusBook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}