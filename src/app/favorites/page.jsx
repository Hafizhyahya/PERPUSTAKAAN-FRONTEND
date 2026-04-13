'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Cek auth & role
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setUserId(user.id);
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  // Load data
  useEffect(() => {
    if (!userId) return;
    
    const loadData = async () => {
      try {
        // Load semua buku
        const booksRes = await apiFetch('/books');
        const booksData = await booksRes.json();
        setBooks(booksData.data || booksData);
        
        // Load favorites dari localStorage
        const favKey = `favorites_user_${userId}`;
        const savedFavs = localStorage.getItem(favKey);
        const favIds = savedFavs ? JSON.parse(savedFavs) : [];
        
        // Filter buku yang ada di favorites
        const allBooks = booksData.data || booksData;
        const favBooks = allBooks.filter(book => favIds.includes(book.id));
        setFavorites(favBooks);
      } catch (err) {
        console.error('Gagal load ', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  // ✅ Toggle favorite
  const toggleFavorite = (bookId) => {
    const favKey = `favorites_user_${userId}`;
    const savedFavs = localStorage.getItem(favKey);
    let favIds = savedFavs ? JSON.parse(savedFavs) : [];
    
    if (favIds.includes(bookId)) {
      // Hapus dari favorit
      favIds = favIds.filter(id => id !== bookId);
    } else {
      // Tambah ke favorit
      favIds.push(bookId);
    }
    
    localStorage.setItem(favKey, JSON.stringify(favIds));
    
    // Update state
    const allBooks = books;
    const favBooks = allBooks.filter(book => favIds.includes(book.id));
    setFavorites(favBooks);
  };

  // ✅ Helper: Cek apakah buku ada di favorit
  const isFavorite = (bookId) => {
    const favKey = `favorites_user_${userId}`;
    const savedFavs = localStorage.getItem(favKey);
    const favIds = savedFavs ? JSON.parse(savedFavs) : [];
    return favIds.includes(bookId);
  };

  // ✅ Helper: Get cover URL
  const getCoverUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('http')) return coverImage;
    return `http://localhost:8000/storage/${coverImage}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat favorit...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-purple-100 rounded-lg transition text-gray-600"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">❤️ Buku Favorit</h1>
            <p className="text-sm text-gray-500">Koleksi buku yang kamu tandai sebagai favorit</p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">💔</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada buku favorit</h3>
            <p className="text-gray-500 text-sm mb-6">
              Tandai buku yang kamu suka dengan klik ikon ❤️ di halaman katalog.
            </p>
            <Link 
              href="/books" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition shadow"
            >
              🔍 Cari Buku
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map((book) => {
              const coverUrl = getCoverUrl(book.cover_image);
              const fav = isFavorite(book.id);
              
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group relative"
                >
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(book.id)}
                    className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition ${
                      fav 
                        ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  >
                    {fav ? '❤️' : '🤍'}
                  </button>
                  
                  {/* Cover Image */}
                  <div className="w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 mb-4 flex items-center justify-center">
                    {coverUrl ? (
                      <img 
                        src={coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl text-gray-400">📖</div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                        📖
                      </div>
                    )}
                  </div>
                  
                  {/* Book Info */}
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" title={book.title}>
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{book.author}</p>
                  
                  {/* Stock & Action */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      book.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {book.stock > 0 ? `● ${book.stock}` : 'Habis'}
                    </span>
                    {userRole === 'siswa' && book.stock > 0 && (
                      <button
                        onClick={() => {
                          alert('Fitur pinjam akan segera tersedia!');
                        }}
                        className="text-xs font-medium text-purple-600 hover:text-purple-700"
                      >
                        Pinjam →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Favorit disimpan di browser kamu • Tidak sinkron antar device</p>
        </div>

      </div>
    </div>
  );
}