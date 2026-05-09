import { useState } from 'react';
import { Send, Users, Filter, Clock } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminBroadcast = () => {
  const { broadcasts, actions } = useData();
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('all');

  const handleSend = async () => {
    if (!message || !title) {
      alert('Harap isi judul dan pesan!');
      return;
    }
    
    const newBroadcast = {
      title,
      message,
      recipient,
      date: new Date().toISOString(),
      count: Math.floor(Math.random() * 100) + 20 // Mock count
    };

    await actions.addBroadcast(newBroadcast);
    setTitle('');
    setMessage('');
    alert('Pesan berhasil dikirim!');
  };

  const sortedBroadcasts = [...(broadcasts || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Broadcast Pesan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Kirim Pesan Baru
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Penerima</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="all">Semua Peserta</option>
                <option value="pending">Status Pending</option>
                <option value="selection">Status Seleksi</option>
                <option value="training">Status Pelatihan</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pesan</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Pengumuman Seleksi Tahap 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                placeholder="Tulis pesan Anda di sini..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button 
              onClick={handleSend}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Kirim Broadcast
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Riwayat Broadcast
          </h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {sortedBroadcasts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Belum ada riwayat broadcast.</p>
            ) : (
              sortedBroadcasts.map((item, index) => (
                <div key={item.id || index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.message}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded capitalize">{item.recipient === 'all' ? 'Semua Peserta' : item.recipient}</span>
                    <span>• Terkirim: {item.count}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBroadcast;
