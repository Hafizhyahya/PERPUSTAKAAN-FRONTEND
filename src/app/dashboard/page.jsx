'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

// 🎨 Menu Card Component (Enhanced)
function MenuCard({ title, desc, href, icon, gradient = 'from-purple-500 to-pink-500' }) {
  return (
    <Link
      href={href}
      className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start gap-4">
        {/* Icon with gradient background */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-0.5 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{desc}</p>
        </div>
        {/* Arrow indicator */}
        <div className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all">
          →
        </div>
      </div>
    </Link>
  );
}

// 🧭 Sidebar Component (Enhanced)
function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname();

  // Di dalam komponen Sidebar, update adminLinks & studentLinks:

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/books', label: 'Data Buku', icon: '📚' },
    { href: '/members', label: 'Data Anggota', icon: '👥' },
    { href: '/borrow', label: 'Transaksi', icon: '🔄' },
    { href: '/borrowing-history', label: 'Riwayat', icon: '🗂️' },
    { href: '/favorites', label: ' Favorit', icon: '❤️' }, // ✅ TAMBAHKAN INI
    { href: '/manual', label: ' Panduan', icon: '📖' },
  ];

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/books', label: 'Cari Buku', icon: '🔍' },
    { href: '/my-borrows', label: 'Peminjaman Saya', icon: '📖' },
    { href: '/borrowing-history', label: 'Riwayat', icon: '🗂️' },
    { href: '/favorites', label: '❤️ Favorit', icon: '❤️' }, // ✅ TAMBAHKAN INI
    { href: '/manual', label: '📖 Panduan', icon: '❓' },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        <div className="flex flex-col h-full">

          {/* Logo Section */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-purple-200">
                  📚
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">PerpusBook</h1>
                <p className="text-xs text-gray-400">Digital Library</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-purple-200'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:pl-5'
                    }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="flex-1">{link.label}</span>
                  {isActive && <span className="text-xs opacity-80">●</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${user?.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`} />
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingBorrows, setLoadingBorrows] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Auth check
  useEffect(() => {
    const data = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!data) {
      router.push('/login');
    } else {
      try {
        setUser(JSON.parse(data));
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  // ✅ Fetch real-time stats dari API
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const res = await apiFetch('/dashboard/stats');
        const json = await res.json();
        setDashboardStats(json.data);
      } catch (err) {
        console.error('Gagal load stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch active borrowings
  useEffect(() => {
    if (!user) return;

    const fetchActiveBorrows = async () => {
      try {
        const res = await apiFetch('/borrowings');
        const json = await res.json();
        const all = json.data || json;

        if (user.role === 'admin') {
          const active = all.filter(b => b.status === 'borrowed').slice(0, 5);
          setActiveBorrows(active);
        } else {
          const mine = all.filter(b =>
            b.user_id === parseInt(user.id) && b.status === 'borrowed'
          ).slice(0, 3);
          setActiveBorrows(mine);
        }
      } catch (err) {
        console.error('Gagal load peminjaman:', err);
      } finally {
        setLoadingBorrows(false);
      }
    };

    fetchActiveBorrows();
  }, [user]);

  // ✅ Fungsi Logout
  const handleLogout = async () => {
    if (!confirm('Yakin ingin logout?')) return;

    try {
      const token = localStorage.getItem('token');
      await apiFetch('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect ke login
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Tetap logout walau API error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  // ✅ Helper: Get cover image URL untuk borrowing items
  const getBorrowingCoverUrl = (book) => {
    if (!book?.cover_image) return null;
    if (book.cover_image.startsWith('http')) return book.cover_image;
    return `http://localhost:8000/storage/${book.cover_image}`;
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-bounce">
          📚
        </div>
        <p className="text-gray-500">Memuat dashboard...</p>
      </div>
    </div>
  );

  // Dynamic stats dengan fallback ke data real-time
  const adminStats = [
    {
      label: 'Total Buku',
      value: loadingStats ? '...' : (dashboardStats?.total_books ?? 0),
      icon: '📚',
      color: 'from-pink-500 to-rose-500',
      trend: '+12%'
    },
    {
      label: 'Anggota',
      value: loadingStats ? '...' : (dashboardStats?.total_members ?? 0),
      icon: '👥',
      color: 'from-purple-500 to-indigo-500',
      trend: '+5%'
    },
    {
      label: 'Peminjaman Aktif',
      value: loadingStats ? '...' : (dashboardStats?.active_borrowings ?? activeBorrows.length),
      icon: '🔄',
      color: 'from-blue-500 to-cyan-500',
      trend: 'Live'
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 flex">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 transition"
              aria-label="Buka menu"
            >
              <span className="text-xl">☰</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 capitalize">{user.role}</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs shadow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Welcome Header + Logout Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Halo, {user.name} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  {user.role === 'admin'
                    ? 'Kelola perpustakaan dengan mudah dari dashboard ini.'
                    : 'Lihat status peminjaman dan temukan buku favoritmu.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Sistem Online
                </div>
                {/* ✅ Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition border border-red-200"
                  title="Logout"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Admin Stats Cards - Real-time */}
            {user.role === 'admin' && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  📊 Statistik Perpustakaan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {adminStats.map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition`}>
                          {stat.icon}
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'Live'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {loadingStats ? (
                          <span className="inline-block w-12 h-6 bg-gray-200 rounded animate-pulse" />
                        ) : (
                          stat.value
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Student Stats - Real-time (Opsional) */}
            {user.role === 'siswa' && dashboardStats && !loadingStats && (
              <section className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Sedang Dipinjam', value: dashboardStats.my_active_borrowings, icon: '📖', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Total Pernah Pinjam', value: dashboardStats.my_total_borrowed, icon: '🗂️', color: 'from-purple-500 to-indigo-500' },
                    { label: 'Terlambat', value: dashboardStats.my_overdue, icon: '⚠️', color: dashboardStats.my_overdue > 0 ? 'from-red-500 to-rose-500' : 'from-gray-400 to-gray-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
                        {stat.icon}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active Borrowings Section - ✅ Dengan Cover Image */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {user.role === 'admin' ? '📚 Peminjaman Aktif' : '📖 Buku Kamu'}
                </h2>
                <Link
                  href="/borrowing-history"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lihat Semua <span>→</span>
                </Link>
              </div>

              {loadingBorrows ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeBorrows.length === 0 ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {user.role === 'admin' ? 'Semua Buku Telah Dikembalikan' : 'Kamu Tidak Sedang Meminjam'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {user.role === 'admin'
                      ? 'Tidak ada peminjaman aktif saat ini.'
                      : 'Silakan jelajahi katalog untuk meminjam buku.'}
                  </p>
                  {user.role === 'siswa' && (
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition shadow"
                    >
                      🔍 Cari Buku
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeBorrows.map((b) => {
                    // ✅ Get cover URL untuk borrowing ini
                    const coverUrl = getBorrowingCoverUrl(b.book);

                    return (
                      <div
                        key={b.id}
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition group"
                      >
                        <div className="flex items-center gap-4">
                          {/* ✅ Cover Image dengan Fallback */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={b.book?.title || 'Buku'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-lg text-gray-400">📖</div>';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg text-gray-400">
                                📖
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {b.book?.title || 'Buku #' + b.book_id}
                            </h4>
                            {user.role === 'admin' && b.user && (
                              <p className="text-sm text-gray-500">
                                Oleh: <span className="font-medium text-gray-700">{b.user.name}</span>
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span>📅 {new Date(b.borrow_date).toLocaleDateString('id-ID')}</span>
                              {b.return_date && (
                                <span className="text-orange-500">
                                  ⏰ Kembali: {new Date(b.return_date).toLocaleDateString('id-ID')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                              Aktif
                            </span>
                            {user.role === 'siswa' && (
                              <Link
                                href="/my-borrows"
                                className="block mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                              >
                                Kelola →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Quick Actions Menu */}
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                {user.role === 'admin' ? '⚡ Menu Admin' : '🚀 Menu Siswa'}
              </h2>
              {user.role === 'admin' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MenuCard title="Data Buku" desc="Kelola katalog & stok buku" href="/books" icon="📚" gradient="from-purple-500 to-indigo-500" />
                  <MenuCard title="Data Anggota" desc="Kelola anggota perpustakaan" href="/members" icon="👥" gradient="from-pink-500 to-rose-500" />
                  <MenuCard title="Transaksi" desc="Catat pinjam & kembali" href="/borrow" icon="🔄" gradient="from-blue-500 to-cyan-500" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MenuCard title="Cari Buku" desc="Telusuri katalog lengkap" href="/books" icon="🔍" gradient="from-purple-500 to-indigo-500" />
                  <MenuCard title="Peminjaman Saya" desc="Lihat & kelola pinjaman" href="/my-borrows" icon="📖" gradient="from-pink-500 to-rose-500" />
                  <MenuCard title="Riwayat" desc="Lihat history peminjaman" href="/borrowing-history" icon="🗂️" gradient="from-blue-500 to-cyan-500" />
                </div>
              )}
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-gray-400 text-xs border-t border-gray-100 bg-white/50">
          © 2026 PerpusBook • Sistem Perpustakaan Digital Sekolah
        </footer>
      </div>
    </div>
  );
}