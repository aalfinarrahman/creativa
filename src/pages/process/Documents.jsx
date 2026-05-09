import ProcessLayout from './ProcessLayout';
import { FileText, CheckCircle } from 'lucide-react';

const Documents = ({ embedded = false }) => {
  return (
    <ProcessLayout title="Pengurusan Dokumen" embedded={embedded} sectionId="dokumen">
      <div className="max-w-4xl mx-auto space-y-12">
        <p className="text-center text-gray-700 text-lg leading-relaxed mb-8">
          Setelah lulus wawancara, proses pengurusan dokumen (Certificate of Eligibility / CoE dan Visa) akan dimulai. Creativa Bridging International akan membantu seluruh proses administrasi ini.
        </p>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" />
              Dokumen yang Diperlukan
            </h3>
          </div>
          <div className="p-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Paspor asli (masa berlaku minimal 1 tahun).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Medical Check-Up (MCU) lengkap terbaru.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Foto ukuran khusus visa Jepang (latar putih).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Sertifikat kelulusan JLPT/NAT-Test (jika ada).</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">Formulir aplikasi Visa yang telah diisi.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
            <h4 className="text-lg font-bold text-blue-800 mb-2">Estimasi Waktu CoE</h4>
            <p className="text-gray-700">
              Proses penerbitan CoE oleh Imigrasi Jepang memakan waktu sekitar <span className="font-semibold">2 - 4 bulan</span> setelah dokumen dikirim ke Jepang.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-600">
            <h4 className="text-lg font-bold text-purple-800 mb-2">Proses Visa</h4>
            <p className="text-gray-700">
              Setelah CoE turun, proses pengajuan Visa di Kedutaan Besar Jepang di Indonesia memakan waktu sekitar <span className="font-semibold">5 - 10 hari kerja</span>.
            </p>
          </div>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Documents;
