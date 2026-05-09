import ProcessLayout from './ProcessLayout';
import { Plane, Briefcase, Heart, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Departure = ({ embedded = false }) => {
  return (
    <ProcessLayout title="Keberangkatan" embedded={embedded} sectionId="keberangkatan">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <Plane className="w-16 h-16 text-blue-600 mx-auto mb-6 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Siap Menuju Jepang!</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Selamat! Ini adalah tahap akhir dari proses persiapan. Peserta yang telah mendapatkan Visa dan tiket pesawat siap diberangkatkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500 hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Briefcase className="mr-3 text-green-500" />
              Pembekalan Akhir
            </h3>
            <ul className="space-y-3 text-gray-600 list-disc list-inside">
              <li>Penjelasan kontrak kerja final.</li>
              <li>Aturan hidup & hukum di Jepang.</li>
              <li>Simulasi keberangkatan di bandara.</li>
              <li>Pemberian seragam & dokumen perjalanan.</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-500 hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-3 text-red-500" />
              Pelepasan (Soubetsukai)
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Acara seremoni pelepasan bersama orang tua/wali dan manajemen Creativa Bridging International. Momen haru sekaligus bangga melepas putra-putri terbaik bangsa.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-8 rounded-xl text-center relative overflow-hidden">
          <div className="relative z-10">
            <Flag className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Selamat Berjuang di Jepang!</h3>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Jaga nama baik diri sendiri, keluarga, lembaga, dan bangsa Indonesia. Sukses selalu untuk karirmu di Negeri Sakura.
            </p>
            <Link to="/alumni" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Lihat Testimoni Alumni
            </Link>
          </div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80')] opacity-20 bg-cover bg-center"></div>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Departure;
