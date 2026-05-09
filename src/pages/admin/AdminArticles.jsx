
import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, FileText, X, Save } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminArticles = () => {
  const { articles, actions, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Berita',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Admin',
  });

  const imagePreview = useMemo(() => {
    if (!imageFile) return '';
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleOpenModal = (article = null) => {
    if (article) {
      setEditingId(article.id);
      setFormData({
        title: article.title,
        category: article.category || 'Berita',
        summary: article.summary || '',
        content: article.content || '',
        date: article.date,
        author: article.author || 'Admin',
      });
      setExistingImage(article.image || '');
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        category: 'Berita',
        summary: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
      });
      setExistingImage('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title || '');
      payload.append('category', formData.category || 'Berita');
      payload.append('summary', formData.summary || '');
      payload.append('content', formData.content || '');
      payload.append('date', formData.date || new Date().toISOString().split('T')[0]);
      payload.append('author', formData.author || 'Admin');
      if (imageFile) payload.append('image', imageFile);

      if (editingId) {
        await actions.updateArticle(editingId, payload);
      } else {
        await actions.addArticle(payload);
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lowker ini?')) {
      await actions.deleteArticle(id);
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Lowker</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Lowker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="bg-gray-200 relative" style={{ aspectRatio: '1 / 1' }}>
              {article.image ? (
                <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full bg-gray-50 object-contain" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <FileText className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold mb-2">
                <span className="bg-blue-50 px-2 py-1 rounded-md">{article.category}</span>
                <span className="text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {article.date}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-grow">{article.summary}</p>
              
              <div className="flex justify-between border-t border-gray-100 pt-4 mt-auto">
                <button 
                  onClick={() => handleOpenModal(article)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(article.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Lowker' : 'Tambah Lowker'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Lowker</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Berita">Berita</option>
                    <option value="Tips & Trik">Tips & Trik</option>
                    <option value="Budaya">Budaya</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Cover</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {(imagePreview || existingImage) && (
                  <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                      <img src={imagePreview || existingImage} alt="Preview" className="absolute inset-0 w-full h-full bg-gray-50 object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan (Summary)</label>
                <textarea
                  required
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.summary}
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Lengkap</label>
                <textarea
                  required
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Anda bisa menggunakan format teks biasa.</p>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-blue-600 disabled:bg-blue-300 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
