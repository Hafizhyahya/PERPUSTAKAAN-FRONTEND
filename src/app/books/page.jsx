'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [userRole, setUserRole] = useState(null);

  // Cek role user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserRole(user.role);
        } catch (e) {
          console.error('Gagal parse user data');
        }
      }
    }
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await apiFetch('/books');
        const data = await res.json();
        setBooks(data.data || data);
      } catch (err) {
        console.error(err);
        alert('Gagal memuat buku');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ✅ Fungsi Hapus Buku
  const handleDeleteBook = async (id, title) => {
    if (!confirm(`Yakin ingin menghapus "${title}"?`)) return;
    
    try {
      const res = await apiFetch(`/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (res.ok) {
        alert('✅ ' + data.message);
        setBooks(prev => prev.filter(book => book.id !== id));
      } else {
        alert('❌ ' + (data.message || 'Gagal menghapus buku'));
      }
    } catch {
      alert('❌ Terjadi kesalahan jaringan');
    }
  };

  // ✅ Fungsi Edit Buku
  const handleEditBook = (id) => {
    router.push(`/books/edit/${id}`);
  };

  // ✅ Helper: Get cover image URL
  const getCoverUrl = (coverImage) => {
    if (!coverImage) return null;
    // Jika sudah full URL, return langsung
    if (coverImage.startsWith('http')) return coverImage;
    // Jika hanya path relatif, prepend storage URL
    return `http://localhost:8000/storage/${coverImage}`;
  };

  // Filter pencarian
  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(search.toLowerCase()) ||
    book.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 hover:underline mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📚 Koleksi Buku</h1>
            <p className="text-sm text-gray-500">Temukan dan pinjam buku favoritmu</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari judul atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {userRole === 'admin' && (
              <Link
                href="/books/create"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition shadow-md whitespace-nowrap"
              >
                ➕ Tambah
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-9 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {search ? 'Buku tidak ditemukan' : 'Belum ada buku'}
            </h3>
            <p className="text-gray-500 text-sm">
              {search ? 'Coba kata kunci lain' : 'Petugas akan menambah koleksi buku segera'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book) => {
              const coverUrl = getCoverUrl(book.cover_image);
              
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* ✅ Cover Image dengan Fallback */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {coverUrl ? (
                        <img 
                          src={coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback ke emoji jika gambar error
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl text-gray-400">📖</div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
                          📖
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {book.stock > 0 ? `● Tersedia: ${book.stock}` : '● Stok Habis'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {book.stock > 0 && userRole === 'siswa' && (
                      <button
                        onClick={() => borrowBook(book.id, book.title)}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:opacity-90 transition"
                      >
                        Pinjam
                      </button>
                    )}
                    
                    {userRole === 'admin' && (
                      <>
                        <button
                          onClick={() => handleEditBook(book.id)}
                          className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredBooks.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-xs">
        © 2026 PerpusBook • Sistem Perpustakaan Digital Sekolah
      </footer>
    </div>
  );
}

// Fungsi pinjam buku (sama seperti sebelumnya)
async function borrowBook(id, title) {
  if (!confirm(`Pinjam "${title}"?`)) return;
  try {
    const res = await apiFetch('/borrowings', {
      method: 'POST',
      body: JSON.stringify({ 
        book_id: id, 
        borrow_date: new Date().toISOString().split('T')[0], 
        return_date: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0] 
      }),
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Buku berhasil dipinjam!');
      window.location.reload();
    } else {
      alert('❌ ' + (data.message || 'Gagal meminjam'));
    }
  } catch {
    alert('❌ Gagal meminjam');
  }
}