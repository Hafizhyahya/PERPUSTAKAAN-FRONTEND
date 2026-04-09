'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    year: '',
    stock: '',
    cover_image: null, // ✅ Tambah state untuk file gambar
  });
  const [preview, setPreview] = useState(null); // ✅ Preview gambar
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file input
    if (name === 'cover_image' && files?.[0]) {
      const file = files[0];
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cover_image: 'Ukuran gambar maksimal 2MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, cover_image: file }));
      // Buat preview
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
    if (!formData.title.trim()) newErrors.title = 'Judul buku wajib diisi';
    if (!formData.author.trim()) newErrors.author = 'Penulis wajib diisi';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stok harus angka ≥ 0';
    if (formData.year && (isNaN(formData.year) || formData.year < 1000 || formData.year > new Date().getFullYear())) {
      newErrors.year = 'Tahun tidak valid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      // ✅ Gunakan FormData untuk upload file
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('publisher', formData.publisher || '');
      formDataToSend.append('year', formData.year ? parseInt(formData.year) : '');
      formDataToSend.append('stock', parseInt(formData.stock));
      if (formData.cover_image) {
        formDataToSend.append('cover_image', formData.cover_image);
      }

      const res = await fetch('http://localhost:8000/api/books', {
        method: 'POST',
        headers: {
          // ❌ JANGAN set Content-Type untuk FormData, browser akan set otomatis dengan boundary
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Buku berhasil ditambahkan!');
        router.push('/books');
      } else {
        alert(`❌ ${data.message || 'Gagal menambahkan buku'}`);
        console.error(data);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Terjadi kesalahan jaringan. Pastikan backend berjalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
              aria-label="Kembali"
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tambah Buku</h1>
              <p className="text-xs text-gray-500">Input data buku baru ke sistem</p>
            </div>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-200">
            ➕
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          
          {/* ✅ Preview Gambar */}
          {preview && (
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Preview cover" 
                  className="w-32 h-40 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setFormData(prev => ({ ...prev, cover_image: null })); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Cover Image Upload */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cover Buku <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                name="cover_image"
                accept="image/*"
                onChange={handleChange}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {errors.cover_image && <p className="text-red-500 text-xs mt-1.5">{errors.cover_image}</p>}
            <p className="text-xs text-gray-400 mt-1">Maksimal 2MB • Format: JPG, PNG, GIF, WebP</p>
          </div>

          {/* Judul */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Judul Buku <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Contoh: Pemrograman Web Modern"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>

          {/* Penulis */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Penulis <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Contoh: Aisyah Dwi Cahyani"
            />
            {errors.author && <p className="text-red-500 text-xs mt-1.5">{errors.author}</p>}
          </div>

          {/* Penerbit */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Penerbit <span className="text-gray-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Contoh: Penerbit UKK"
            />
          </div>

          {/* Grid: Tahun & Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tahun Terbit <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Contoh: 2026"
              />
              {errors.year && <p className="text-red-500 text-xs mt-1.5">{errors.year}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Contoh: 10"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1.5">{errors.stock}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-purple-200 flex items-center justify-center gap-2 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Menyimpan...
                </>
              ) : (
                'Simpan Buku'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
          </div>

        </form>

        {/* Helper Info */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Field dengan <span className="text-red-500">*</span> wajib diisi</p>
        </div>
      </main>
    </div>
  );
}