import { Users, Activity, FileCheck, Plane } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminDashboard = () => {
  const { participants } = useData();

  // Calculate Stats
  const totalPeserta = participants.length;
  const inProcess = participants.filter(p => ['Pending', 'Wawancara', 'Dokumen', 'Pelatihan'].includes(p.status)).length;
  const passed = participants.filter(p => p.status === 'Lulus Seleksi').length;
  const departed = participants.filter(p => p.status === 'Terbang').length;

  const stats = [
    { label: 'Total Peserta', value: totalPeserta, icon: <Users className="w-8 h-8 text-blue-600" />, color: 'bg-blue-100' },
    { label: 'Dalam Proses', value: inProcess, icon: <Activity className="w-8 h-8 text-orange-600" />, color: 'bg-orange-100' },
    { label: 'Lulus Seleksi', value: passed, icon: <FileCheck className="w-8 h-8 text-green-600" />, color: 'bg-green-100' },
    { label: 'Sudah Berangkat', value: departed, icon: <Plane className="w-8 h-8 text-purple-600" />, color: 'bg-purple-100' },
  ];

  // Recent Activity
  const recentParticipants = [...participants]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  // Monthly Stats Calculation
  const getMonthlyStats = () => {
    const last6Months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      last6Months.push(d);
    }

    return last6Months.map(date => {
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const count = participants.filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === year;
      }).length;
      return { month: monthName, count };
    });
  };

  const monthlyData = getMonthlyStats();
  const maxCount = Math.max(...monthlyData.map(d => d.count), 1); // Avoid division by zero

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center">
            <div className={`p-4 rounded-full ${stat.color} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Pendaftaran Terbaru</h3>
          <div className="space-y-4">
            {recentParticipants.length > 0 ? (
              recentParticipants.map((p, index) => (
                <div key={p.id || index} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold mr-3">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.program}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{p.date}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada pendaftaran.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Pendaftaran (6 Bulan Terakhir)</h3>
          <div className="h-64 flex items-end justify-between px-2 gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center w-full group">
                <div className="relative w-full flex justify-center">
                  <div 
                    className="w-full max-w-[40px] bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-600"
                    style={{ height: `${(data.count / maxCount) * 200}px`, minHeight: '4px' }}
                  ></div>
                   {/* Tooltip */}
                   <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {data.count} Peserta
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
