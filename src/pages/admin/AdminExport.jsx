import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminExport = () => {
  const { participants } = useData();

  const convertToCSV = (objArray) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    
    // Header
    if (array.length > 0) {
        str += Object.keys(array[0]).join(',') + '\r\n';
    }

    // Body
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ',';
            // Wrap in quotes to handle commas in data
            line += `"${String(array[i][index] || '').replace(/"/g, '""')}"`;
        }
        str += line + '\r\n';
    }
    return str;
  };

  const downloadCSV = (data, filename) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportParticipants = () => {
    if (participants.length === 0) {
        alert("Tidak ada data peserta untuk diexport.");
        return;
    }
    // Filter relevant fields for export
    const exportData = participants.map(p => ({
        ID: p.id,
        Nama: p.name,
        Program: p.program,
        Status: p.status,
        Tanggal_Daftar: p.date,
        Email: p.email || '-',
        No_HP: p.phone || '-'
    }));
    
    downloadCSV(exportData, `data_peserta_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportNotAvailable = (type) => {
    alert(`Maaf, fitur export ${type} belum tersedia karena belum ada data transaksi/absensi real.`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Export Data & Laporan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Export Peserta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 text-green-600">
              <FileSpreadsheet className="w-8 h-8" />
              <h3 className="text-lg font-bold text-gray-800">Data Peserta</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Export data lengkap seluruh peserta dalam format CSV.</p>
          </div>
          <button 
            onClick={handleExportParticipants}
            className="w-full border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Data
          </button>
        </div>

        {/* Export Pembayaran */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <FileSpreadsheet className="w-8 h-8" />
              <h3 className="text-lg font-bold text-gray-800">Laporan Keuangan</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Rekapitulasi pembayaran dan tagihan peserta.</p>
          </div>
          <button 
            onClick={() => handleExportNotAvailable('Keuangan')}
            className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
        </div>

        {/* Export Absensi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4 text-orange-600">
              <Calendar className="w-8 h-8" />
              <h3 className="text-lg font-bold text-gray-800">Laporan Absensi</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">Rekap kehadiran peserta pelatihan bulan ini.</p>
          </div>
          <button 
            onClick={() => handleExportNotAvailable('Absensi')}
            className="w-full border border-orange-600 text-orange-600 hover:bg-orange-50 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminExport;
