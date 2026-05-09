import { useState } from 'react';
import { File, Download, Search, Trash2, Plus, Upload } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminDocuments = () => {
  const { documents, actions, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    file: '',
    type: 'PDF',
    size: '1.0 MB' // Mock size
  });

  const handleOpenModal = () => {
    setFormData({
      user: '',
      file: '',
      type: 'PDF',
      size: '1.0 MB'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDoc = {
      ...formData,
      date: new Date().toISOString().split('T')[0]
    };
    await actions.addDocument(newDoc);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      await actions.deleteDocument(id);
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dokumen Peserta</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama atau file..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Dokumen
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada dokumen yang diunggah.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Nama File</th>
                <th className="px-6 py-4">Peserta</th>
                <th className="px-6 py-4">Ukuran</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Tanggal Upload</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                    <File className="w-5 h-5 text-gray-400" />
                    {doc.file}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{doc.user}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{doc.size}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{doc.type}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{doc.date}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-1">
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Upload Dokumen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peserta</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.user}
                  onChange={(e) => setFormData({...formData, user: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama File (Simulasi)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: CV_Nama.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.file}
                  onChange={(e) => setFormData({...formData, file: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe File</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="PDF">PDF</option>
                  <option value="Image">Image (JPG/PNG)</option>
                  <option value="Doc">Word Document</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;
