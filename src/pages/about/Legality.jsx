import AboutLayout from './AboutLayout';
import { FileText, CheckCircle } from 'lucide-react';

const Legality = () => {
  return (
    <AboutLayout title="Legalitas & Sertifikasi">
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <FileText className="mr-3 text-blue-600" />
              Izin Resmi Lembaga
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Creativa Bridging International adalah lembaga resmi yang telah terdaftar dan mendapatkan izin operasional dari Kementerian Ketenagakerjaan Republik Indonesia serta dinas terkait. Kami beroperasi dengan transparansi penuh dan mematuhi semua regulasi yang berlaku.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Nomor Induk Berusaha (NIB): <span className="font-semibold text-gray-900">XXXXXXXXXXXXX</span></span>
              </li>
              <li className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Izin LPK (Dinas Tenaga Kerja): <span className="font-semibold text-gray-900">No. XX/Disnaker/XXXX</span></span>
              </li>
              <li className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Akta Notaris Pendirian: <span className="font-semibold text-gray-900">No. XX Tanggal XX-XX-XXXX</span></span>
              </li>
              <li className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span>Izin SO (Sending Organization): <span className="font-semibold text-gray-900">No. XXX/Kep/SO/XXXX</span></span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center min-h-[300px] border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Preview Dokumen Legalitas</p>
              <span className="text-sm">(Sertifikat akan ditampilkan di sini)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Mitra & Kerjasama</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            Kami telah menjalin kerjasama dengan berbagai Sending Organization (SO) dan Kumiai di Jepang untuk memastikan penempatan peserta yang aman dan terjamin.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos for Partners */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md h-24">
                <span className="font-bold text-gray-400">PARTNER {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AboutLayout>
  );
};

export default Legality;
