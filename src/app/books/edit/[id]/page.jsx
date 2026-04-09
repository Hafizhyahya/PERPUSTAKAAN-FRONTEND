'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
    stock: '',
    cover_image: null,
  });
  const [preview, setPreview] = useState(null);
  const [existingCover, setExistingCover] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data buku
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/api/books/${bookId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const result = await res.json();
        const data = result.data || result;
        
        setFormData({
          title: data.title || '',
          author: data.author || '',
          publisher: data.publisher || '',
          year: data.year || '',
          stock: data.stock || '',
          cover_image: null,
        });
        
        // Set existing cover untuk preview
        if (data.cover_image) {
          const coverUrl = data.cover_image.startsWith('http') 
            ? data.cover_image 
            : `http://localhost:8000/storage/${data.cover_image}`;
          setExistingCover(coverUrl);
          setPreview(coverUrl);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('Gagal memuat data buku');
        router.push('/books');
      } finally {
        setLoading(false);
      }
    };
    if (bookId) fetchBook();
  }, [bookId, router]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'cover_image' && files?.[0]) {
      const file = files[0];
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cover_image: 'Ukuran gambar maksimal 2MB' }));
        return;
      }
      // Validasi tipe file
      if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
        setErrors(prev => ({ ...prev, cover_image: 'Format gambar harus JPG, PNG, GIF, atau WebP' }));
        return;
      }
      setFormData(prev => ({ ...prev, cover_image: file }));
      // Preview gambar baru
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, cover_image: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.author.trim()) newErrors.author = 'Penulis wajib diisi';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stok harus ≥ 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // ✅ Gunakan FormData untuk upload file
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('publisher', formData.publisher || '');
      formDataToSend.append('year', formData.year ? parseInt(formData.year) : '');
      formDataToSend.append('stock', parseInt(formData.stock));
      
      // ✅ Handle gambar:
      // - Jika ada file baru: kirim file
      // - Jika user klik ✕ hapus: kirim empty string
      // - Jika tidak ada perubahan: tidak kirim cover_image sama sekali
      if (formData.cover_image instanceof File) {
        formDataToSend.append('cover_image', formData.cover_image);
      } else if (formData.cover_image === null && existingCover) {
        // User ingin menghapus cover lama
        formDataToSend.append('cover_image', '');
      }

      const res = await fetch(`http://localhost:8000/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          // ✅ PENTING: JANGAN set Content-Type untuk FormData!
          // Browser akan otomatis set "multipart/form-data" dengan boundary yang benar
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Accept': 'application/json',
        },
        body: formDataToSend,
      });

      const data = await res.json();
      console.log('📥 Response:', data); // Debug

      if (res.ok) {
        alert('✅ ' + data.message);
        router.push('/books');
      } else {
        // Tampilkan error validasi jika ada
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join('\n');
          alert(`❌ Validasi gagal:\n${messages}`);
        } else {
          alert('❌ ' + (data.message || 'Gagal update buku'));
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ Kesalahan jaringan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCover = () => {
    setPreview(null);
    setExistingCover(null);
    setFormData(prev => ({ ...prev, cover_image: null }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-gray-500">Memuat data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/books" className="p-2 hover:bg-purple-100 rounded-lg transition">←</Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Buku</h1>
            <p className="text-sm text-gray-500">Perbarui informasi buku</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-5">
          
          {/* ✅ Preview Gambar */}
          {preview && (
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview cover" 
                  className="w-32 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                  title="Hapus cover"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Buku <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="file"
              name="cover_image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.cover_image && <p className="text-red-500 text-xs mt-1">{errors.cover_image}</p>}
            <p className="text-xs text-gray-400 mt-1">Maksimal 2MB • Format: JPG, PNG, GIF, WebP</p>
            {existingCover && !formData.cover_image && (
              <p className="text-xs text-gray-500 mt-1">
                ✅ Cover saat ini akan dipertahankan. Upload gambar baru untuk mengganti, atau klik ✕ untuk menghapus.
              </p>
            )}
          </div>

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Contoh: Pemrograman Web Modern"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Penulis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penulis <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Contoh: Aisyah Dwi Cahyani"
            />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
          </div>

          {/* Penerbit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penerbit</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Contoh: Penerbit UKK"
            />
          </div>

          {/* Tahun & Stok */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="10"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Update Buku'}
            </button>
            <Link
              href="/books"
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}