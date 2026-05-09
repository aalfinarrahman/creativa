
import { useEffect, useMemo, useState } from 'react';
import { Plus, Image, Trash2, X, Save } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminGallery = () => {
  const { gallery, actions, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kegiatan',
    date: new Date().toISOString().split('T')[0]
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

  const handleOpenModal = () => {
    setFormData({
      title: '',
      category: 'Kegiatan',
      date: new Date().toISOString().split('T')[0]
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!imageFile) return;
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title || '');
      payload.append('category', formData.category || 'Kegiatan');
      payload.append('date', formData.date || new Date().toISOString().split('T')[0]);
      payload.append('image', imageFile);
      await actions.addGalleryItem(payload);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
      await actions.deleteGalleryItem(id);
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Galeri</h1>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative" style={{ aspectRatio: '1 / 1' }}>
              <img src={img.image || img.imageUrl} alt={img.title} className="absolute inset-0 w-full h-full bg-gray-50 object-contain" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="bg-white p-2 rounded-full shadow-lg text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-gray-800 truncate flex-1">{img.title}</h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded ml-2">{img.category}</span>
              </div>
              <p className="text-xs text-gray-500">{img.date}</p>
            </div>
          </div>
        ))}
        
        {/* Add new placeholder */}
        <div 
          onClick={handleOpenModal}
          className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors cursor-pointer h-full min-h-[200px]"
        >
          <Image className="w-10 h-10 mb-2" />
          <span className="text-sm font-medium">Upload Foto Baru</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Tambah Foto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Foto</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Fasilitas">Fasilitas</option>
                  <option value="Acara">Acara</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full text-sm"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                {imagePreview && (
                  <div className="mt-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full bg-gray-50 object-contain" />
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Format: JPG/PNG/WebP.</p>
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

export default AdminGallery;
