import RegisterLayout from './RegisterLayout';
import { MousePointer, Edit2, Users, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterGuide = () => {
  const steps = [
    {
      title: "1. Isi Formulir Pendaftaran",
      icon: <MousePointer className="w-8 h-8 text-blue-600" />,
      desc: "Lengkapi data diri Anda pada formulir online yang tersedia di website ini. Pastikan data yang diinputkan benar dan sesuai dengan KTP/Dokumen resmi."
    },
    {
      title: "2. Verifikasi Data",
      icon: <FileCheck className="w-8 h-8 text-green-600" />,
      desc: "Tim admin kami akan memverifikasi data yang Anda kirimkan. Anda mungkin akan dihubungi melalui WhatsApp/Telepon untuk konfirmasi."
    },
    {
      title: "3. Tes Seleksi",
      icon: <Edit2 className="w-8 h-8 text-purple-600" />,
      desc: "Anda akan dijadwalkan untuk mengikuti tes seleksi (fisik, kesehatan, tulis, dan wawancara) di kantor LPK Creativa Bridging International."
    },
    {
      title: "4. Masuk Pelatihan",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      desc: "Jika dinyatakan lolos seleksi, Anda akan mulai mengikuti program pelatihan bahasa dan budaya Jepang di asrama kami."
    }
  ];

  return (
    <RegisterLayout title="Panduan Pendaftaran">
      <div className="max-w-4xl mx-auto space-y-12">
        <p className="text-center text-gray-700 text-lg leading-relaxed mb-8">
          Berikut adalah langkah-langkah mudah untuk mendaftar sebagai peserta pelatihan kerja ke Jepang bersama Creativa Bridging International.
        </p>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="text-sm font-bold">{index + 1}</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-200 shadow">
                <div className="flex items-center mb-1 space-x-2">
                   <div className="bg-gray-50 p-2 rounded-full hidden sm:block">
                     {step.icon}
                   </div>
                   <div className="font-bold text-slate-900">{step.title}</div>
                </div>
                <div className="text-slate-500">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
           <Link to="/daftar" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
             Daftar Sekarang
           </Link>
        </div>
      </div>
    </RegisterLayout>
  );
};

export default RegisterGuide;
