import { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, User } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminStatus = () => {
  const { participants } = useData();
  const [activeTab, setActiveTab] = useState('Semua');
  
  // Calculate counts dynamically
  const pendingCount = participants.filter(p => p.status === 'Baru' || p.status === 'Pending').length;
  const selectionCount = participants.filter(p => p.status === 'Seleksi').length;
  const trainingCount = participants.filter(p => p.status === 'Pelatihan').length;
  const docCount = participants.filter(p => p.status === 'Dokumen').length;

  const statuses = [
    { id: 1, name: 'Pendaftaran', count: pendingCount, icon: <Clock className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-50 text-yellow-700' },
    { id: 2, name: 'Seleksi', count: selectionCount, icon: <AlertTriangle className="w-5 h-5 text-orange-500" />, color: 'bg-orange-50 text-orange-700' },
    { id: 3, name: 'Pelatihan', count: trainingCount, icon: <CheckCircle className="w-5 h-5 text-green-500" />, color: 'bg-green-50 text-green-700' },
    { id: 4, name: 'Dokumen', count: docCount, icon: <XCircle className="w-5 h-5 text-red-500" />, color: 'bg-red-50 text-red-700' },
  ];

  // Map recent participants to logs (Simulated activity)
  // In a real app, this would come from a dedicated audit log
  const statusLogs = participants
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5)
    .map((p, index) => ({
      id: p.id || index,
      user: p.name,
      action: `Status: ${p.status}`,
      date: p.date,
      type: p.status === 'Lulus' ? 'success' : p.status === 'Gagal' ? 'error' : 'info'
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tracking Status Peserta</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statuses.map((status) => (
          <div key={status.id} className={`p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer hover:shadow-md transition-shadow ${activeTab === status.name ? 'ring-2 ring-blue-500' : 'bg-white'}`} onClick={() => setActiveTab(status.name)}>
            <div>
              <p className="text-sm font-medium text-gray-500">{status.name}</p>
              <h3 className="text-2xl font-bold text-gray-800">{status.count}</h3>
            </div>
            <div className={`p-2 rounded-full ${status.color}`}>
              {status.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline / Logs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aktivitas Terbaru (Pendaftaran)</h3>
        {statusLogs.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas.</p>
        ) : (
          <div className="space-y-4">
            {statusLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                <div className={`mt-1 p-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-100 text-green-600' :
                  log.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{log.user} <span className="font-normal text-gray-500">- {log.action}</span></p>
                  <p className="text-xs text-gray-400">{log.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatus;
