import { useState } from 'react';
import { Plus, Edit2, Trash2, Users, X, ArrowUp, ArrowDown } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminTeam = () => {
  const { teams, actions, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: ''
  });

  const leaders = teams.slice(0, 2);
  const members = teams.slice(2);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMove = async (index, direction) => {
    const newTeams = [...teams];
    if (direction === 'up' && index > 0) {
      [newTeams[index], newTeams[index - 1]] = [newTeams[index - 1], newTeams[index]];
    } else if (direction === 'down' && index < newTeams.length - 1) {
      [newTeams[index], newTeams[index + 1]] = [newTeams[index + 1], newTeams[index]];
    }
    await actions.reorderTeamMembers(newTeams);
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name,
        role: member.role,
        image: member.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        role: '',
        image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await actions.updateTeamMember(editingId, formData);
    } else {
      await actions.addTeamMember(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus anggota tim ini?')) {
      await actions.deleteTeamMember(id);
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  const TeamCard = ({ member, index }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={member.image || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={member.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay with Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5">
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleOpenModal(member)}
              className="p-1.5 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button 
              onClick={() => handleDelete(member.id)}
              className="p-1.5 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors"
              title="Hapus"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-1.5 mt-1">
              <button 
              onClick={() => handleMove(index, 'up')}
              disabled={index === 0}
              className="p-1 bg-white/80 rounded-full text-gray-700 hover:bg-white disabled:opacity-50"
              title="Geser ke Kiri/Atas"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button 
              onClick={() => handleMove(index, 'down')}
              disabled={index === teams.length - 1}
              className="p-1 bg-white/80 rounded-full text-gray-700 hover:bg-white disabled:opacity-50"
              title="Geser ke Kanan/Bawah"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-2 text-center flex-1 flex flex-col justify-center">
        <h3 className="text-xs font-bold text-gray-900 leading-tight mb-0.5 truncate px-0.5">{member.name}</h3>
        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider truncate px-0.5">{member.role}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Tim Kami</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Anggota
        </button>
      </div>

      <div className="space-y-8">
        {teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Belum ada anggota tim</h3>
            <p className="text-gray-500 mt-1">Mulai dengan menambahkan anggota tim baru.</p>
          </div>
        ) : (
          <>
            {/* Leaders Section (Top 2) */}
            {leaders.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4">
                {leaders.map((member, i) => (
                  <div key={member.id} className="w-32 md:w-40">
                    <TeamCard member={member} index={i} />
                  </div>
                ))}
              </div>
            )}

            {/* Members Section (Rest) */}
            {members.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 justify-items-center">
                {members.map((member, i) => (
                  <TeamCard key={member.id} member={member} index={i + 2} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Anggota</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload foto dari komputer (Max 2MB disarankan).</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;
