import { ArrowRight, Star, MapPin } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: 'Andi Saputra',
      location: 'Tokyo, Jepang',
      role: 'Manager Konstruksi',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80',
      story: 'Andi memulai karirnya sebagai peserta magang biasa. Dengan ketekunan belajar bahasa Jepang dan etos kerja yang tinggi, ia kini dipercaya menjadi Manager Konstruksi di perusahaan besar di Tokyo. Kisah inspiratifnya membuktikan bahwa kerja keras tidak akan mengkhianati hasil.',
      year: 'Angkatan 2019'
    },
    {
      id: 2,
      name: 'Rina Wijaya',
      location: 'Osaka, Jepang',
      role: 'Kepala Perawat',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80',
      story: 'Bermimpi menjadi tenaga medis internasional, Rina bergabung dengan program Tokutei Ginou Caregiver. Sekarang ia memimpin tim perawat di salah satu rumah sakit lansia terkemuka di Osaka dan aktif dalam komunitas Indonesia di sana.',
      year: 'Angkatan 2020'
    },
    {
      id: 3,
      name: 'Dedi Kurniawan',
      location: 'Fukuoka, Jepang',
      role: 'Pengusaha Kuliner',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80',
      story: 'Setelah menyelesaikan program magang 3 tahun, Dedi menggunakan tabungannya untuk membuka restoran Indonesia di Fukuoka. Usahanya kini menjadi tempat berkumpul favorit bagi para WNI dan warga lokal yang menyukai masakan Indonesia.',
      year: 'Angkatan 2018'
    }
  ];

  return (
    <div className="space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Kisah Sukses Alumni</h2>
        <p className="text-lg text-gray-600">
          Inspirasi nyata dari mereka yang telah mengubah hidup melalui program kami.
        </p>
      </div>

      <div className="space-y-12">
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white rounded-3xl shadow-xl overflow-hidden ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
              <img 
                src={story.image} 
                alt={story.name} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider">
                <Star className="w-4 h-4 fill-current" />
                {story.year}
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                {story.name}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <MapPin className="w-5 h-5 text-red-500" />
                {story.location} • {story.role}
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                {story.story}
              </p>
              
              <button className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Baca Selengkapnya
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
