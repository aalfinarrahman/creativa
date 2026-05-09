import AboutLayout from './AboutLayout';
import { Target, Lightbulb } from 'lucide-react';

const VisionMission = () => {
  return (
    <AboutLayout title="Visi & Misi">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Visi */}
        <div className="bg-blue-50 p-8 rounded-xl shadow-md border-t-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-4">Visi</h2>
          <p className="text-gray-700 text-center italic text-lg leading-relaxed">
            "Menjadi lembaga pelatihan kerja terdepan yang menjembatani talenta Indonesia dengan peluang global, menciptakan sumber daya manusia yang kompeten, berkarakter, dan siap bersaing di dunia industri Jepang."
          </p>
        </div>

        {/* Misi */}
        <div className="bg-green-50 p-8 rounded-xl shadow-md border-t-4 border-green-600 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-green-800 mb-4">Misi</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Menyelenggarakan pelatihan bahasa dan budaya Jepang yang berkualitas tinggi dan komprehensif.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Membentuk karakter disiplin, tanggung jawab, dan etos kerja profesional sesuai standar industri Jepang.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Membangun kerjasama strategis dengan lembaga penerima dan perusahaan di Jepang untuk memperluas peluang kerja.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Memberikan pendampingan dan dukungan berkelanjutan bagi peserta didik mulai dari pelatihan hingga penempatan kerja.
            </li>
          </ul>
        </div>
      </div>
    </AboutLayout>
  );
};

export default VisionMission;
