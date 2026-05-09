import ProcessLayout from './ProcessLayout';
import { Video, Briefcase, CheckCircle, XCircle } from 'lucide-react';

const Interview = ({ embedded = false }) => {
  return (
    <ProcessLayout title="Interview Perusahaan" embedded={embedded} sectionId="interview">
      <div className="max-w-4xl mx-auto space-y-12">
        <p className="text-center text-gray-700 text-lg leading-relaxed mb-8">
          Setelah mencapai kemampuan bahasa tertentu, peserta akan dipertemukan dengan perwakilan perusahaan penerima (Kumiai/Kaisha) dari Jepang melalui sesi wawancara.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Video className="mr-3 text-blue-600" />
              Metode Wawancara
            </h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2 mt-0.5">Online</span>
                Menggunakan Zoom/Skype (umum saat ini).
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-2 mt-0.5">Offline</span>
                Pihak perusahaan datang langsung ke Creativa Bridging International (jika kondisi memungkinkan).
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-orange-600">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Briefcase className="mr-3 text-orange-600" />
              Materi Wawancara
            </h3>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>Perkenalan diri (Jikoshoukai) dalam bahasa Jepang.</li>
              <li>Motivasi kerja ke Jepang.</li>
              <li>Pengalaman kerja & keahlian.</li>
              <li>Tanya jawab umum.</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Hasil Wawancara</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-lg font-bold text-green-700 mb-2">Lulus (Goukaku)</h4>
              <p className="text-center text-gray-600 text-sm">
                Peserta akan menandatangani kontrak kerja & lanjut ke tahap pengurusan dokumen.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <h4 className="text-lg font-bold text-red-700 mb-2">Belum Lulus</h4>
              <p className="text-center text-gray-600 text-sm">
                Peserta tetap melanjutkan pelatihan dan akan diikutkan pada kesempatan interview berikutnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Interview;
