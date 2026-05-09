import ProcessLayout from './ProcessLayout';
import { BookOpen, Users, Clock, Smile } from 'lucide-react';

const Training = ({ embedded = false }) => {
  return (
    <ProcessLayout title="Pelatihan Bahasa" embedded={embedded} sectionId="pelatihan">
      <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2 space-y-8">
          <p className="text-gray-700 leading-relaxed text-lg">
            Peserta yang lolos seleksi akan masuk asrama untuk mengikuti pelatihan intensif bahasa dan budaya Jepang. Kami menggunakan kurikulum yang dirancang khusus untuk mempercepat pemahaman bahasa (N5-N4) dan membentuk karakter disiplin.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600 flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Kurikulum Terstruktur</h3>
                <p className="text-gray-600">
                  Pembelajaran Hiragana, Katakana, Kanji, Tata Bahasa, dan Percakapan sehari-hari yang sesuai dengan standar JLPT/NAT-Test.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600 flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pendidikan Karakter (Fisik & Mental)</h3>
                <p className="text-gray-600">
                  Selain bahasa, peserta dilatih kedisiplinan, etika kerja (Hou-Ren-So), dan kebiasaan hidup bersih ala Jepang melalui kegiatan asrama.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-3 rounded-full mr-4 text-purple-600 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Durasi Pelatihan</h3>
                <p className="text-gray-600">
                  Rata-rata 3-6 bulan tergantung kemampuan peserta dan jadwal interview perusahaan penerima.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Suasana Kelas Bahasa Jepang" 
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-lg font-semibold flex items-center">
                <Smile className="mr-2 text-yellow-400" />
                Belajar dengan Gembira & Serius
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Training;
