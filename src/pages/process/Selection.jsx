import ProcessLayout from './ProcessLayout';
import { Ruler, Activity, Edit2, Users } from 'lucide-react';

const Selection = ({ embedded = false }) => {
  const steps = [
    {
      title: "Tes Fisik",
      icon: <Ruler className="w-8 h-8 text-blue-600" />,
      desc: "Pemeriksaan tinggi badan, berat badan, tes lari, push-up, sit-up, dan cek kondisi fisik umum."
    },
    {
      title: "Tes Kesehatan (MCU)",
      icon: <Activity className="w-8 h-8 text-green-600" />,
      desc: "Pemeriksaan kesehatan menyeluruh di klinik/rumah sakit rekanan untuk memastikan peserta fit to work."
    },
    {
      title: "Tes Tulis",
      icon: <Edit2 className="w-8 h-8 text-purple-600" />,
      desc: "Ujian matematika dasar, psikotes sederhana, dan tes kemampuan dasar lainnya."
    },
    {
      title: "Wawancara",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      desc: "Wawancara dengan manajemen Creativa Bridging International untuk menilai motivasi, mental, dan keseriusan peserta."
    }
  ];

  return (
    <ProcessLayout title="Tahap Seleksi" embedded={embedded} sectionId="seleksi">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-700 mb-12 text-lg">
          Setelah mendaftar, calon peserta akan mengikuti serangkaian tes seleksi untuk memastikan kualifikasi dan kesiapan fisik serta mental sebelum mengikuti pelatihan intensif.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-gray-50 p-3 rounded-full mr-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500 text-yellow-800">
          <p className="font-semibold">
            Catatan: Hasil seleksi akan diumumkan maksimal 3 hari kerja setelah tes dilaksanakan. Peserta yang lolos seleksi wajib melakukan daftar ulang untuk masuk asrama.
          </p>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Selection;
