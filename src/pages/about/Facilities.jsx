import AboutLayout from './AboutLayout';
import { Wifi, Book, Home, Monitor } from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      title: "Ruang Kelas Modern",
      description: "Dilengkapi dengan AC, proyektor, dan audio system untuk pembelajaran bahasa yang efektif.",
      icon: <Monitor className="w-10 h-10 text-blue-600" />,
      image: "https://images.unsplash.com/photo-1510531704581-5b2870972060?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Asrama Nyaman",
      description: "Tempat tinggal bersih dan teratur untuk membentuk kebiasaan disiplin dan kemandirian.",
      icon: <Home className="w-10 h-10 text-green-600" />,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Perpustakaan & Ruang Belajar",
      description: "Koleksi buku bahasa Jepang, referensi JLPT, dan ruang tenang untuk belajar mandiri.",
      icon: <Book className="w-10 h-10 text-purple-600" />,
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Akses Internet & Lab Komputer",
      description: "Fasilitas internet cepat dan komputer untuk mendukung proses pembelajaran digital.",
      icon: <Wifi className="w-10 h-10 text-orange-600" />,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <AboutLayout title="Fasilitas Kami">
      <div className="space-y-16">
        {facilities.map((facility, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-xl group">
                <img 
                  src={facility.image} 
                  alt={facility.title} 
                  className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-gray-50 rounded-full shadow-sm">
                  {facility.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{facility.title}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed pl-16">
                {facility.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AboutLayout>
  );
};

export default Facilities;
