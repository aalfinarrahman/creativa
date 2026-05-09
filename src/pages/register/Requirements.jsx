import RegisterLayout from './RegisterLayout';
import { FileText, CheckCircle, Info } from 'lucide-react';

const Requirements = () => {
  return (
    <RegisterLayout title="Persyaratan Peserta">
      <div className="max-w-4xl mx-auto space-y-12">
        <p className="text-center text-gray-700 text-lg leading-relaxed">
          Berikut adalah persyaratan umum dan khusus yang harus dipenuhi oleh calon peserta pelatihan di Creativa Bridging International.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
              <FileText className="mr-2" /> Persyaratan Umum
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Pria/Wanita.</li>
              <li>Usia 18 - 28 tahun (untuk Program Magang).</li>
              <li>Usia 18 - 35 tahun (untuk Program Tokutei Ginou/SSW).</li>
              <li>Pendidikan minimal SMA/SMK/Sederajat.</li>
              <li>Tinggi badan minimal 160cm (Pria) dan 150cm (Wanita).</li>
              <li>Berat badan proporsional.</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-600">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <CheckCircle className="mr-2" /> Kondisi Kesehatan
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Sehat jasmani dan rohani.</li>
              <li>Tidak buta warna (total maupun parsial).</li>
              <li>Mata maksimal minus/plus/silinder (tergantung kebijakan perusahaan penerima, umumnya diperbolehkan jika tidak terlalu tinggi).</li>
              <li>Tidak bertato dan tidak bertindik (untuk Pria).</li>
              <li>Tidak memiliki riwayat penyakit berat (TBC, Hepatitis, Asma akut, Patah Tulang serius, dll).</li>
              <li>Tidak memiliki cacat fisik yang mengganggu aktivitas kerja.</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
            <Info className="mr-2" /> Dokumen Administrasi
          </h3>
          <p className="text-gray-700 mb-4">
            Calon peserta wajib melengkapi dokumen berikut sebelum keberangkatan (bisa disusulkan saat proses pelatihan):
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 list-disc list-inside">
            <li>KTP & Kartu Keluarga</li>
            <li>Akte Kelahiran</li>
            <li>Ijazah SD - Terakhir</li>
            <li>Paspor (masa berlaku min. 1 tahun)</li>
            <li>SKCK (Surat Keterangan Catatan Kepolisian)</li>
            <li>Surat Izin Orang Tua/Wali (bermaterai)</li>
            <li>Foto ukuran khusus Visa Jepang</li>
            <li>Sertifikat MCU (Medical Check Up)</li>
          </ul>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default Requirements;
