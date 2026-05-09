import ProcessLayout from './ProcessLayout';
import { FileText, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Registration = ({ embedded = false }) => {
  return (
    <ProcessLayout title="Pendaftaran" embedded={embedded} sectionId="pendaftaran">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Pendaftaran Peserta" 
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            Langkah pertama untuk memulai karir Anda di Jepang adalah dengan melakukan pendaftaran di Creativa Bridging International. Proses ini mudah dan dapat dilakukan secara online maupun offline.
          </p>
          
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
              <FileText className="mr-2" /> Persyaratan Umum
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Pria/Wanita usia 18-28 tahun (Magang) atau hingga 35 tahun (Tokutei Ginou).</li>
              <li>Pendidikan minimal SMA/SMK sederajat.</li>
              <li>Tinggi badan minimal 160cm (Pria) / 150cm (Wanita).</li>
              <li>Sehat jasmani dan rohani, tidak buta warna, tidak bertato/bertindik.</li>
              <li>Memiliki izin orang tua/wali.</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link to="/daftar" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition duration-300">
              <UserCheck className="mr-2 w-5 h-5" />
              Daftar Online Sekarang
            </Link>
          </div>
        </div>
      </div>
    </ProcessLayout>
  );
};

export default Registration;
