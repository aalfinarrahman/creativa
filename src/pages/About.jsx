const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Tentang Kami</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Team Meeting" 
            className="rounded-lg shadow-xl"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Visi & Misi</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Creativa Bridging International didirikan dengan tujuan utama untuk menjembatani talenta muda Indonesia dengan peluang karir di Jepang. Kami berkomitmen untuk memberikan pelatihan bahasa dan budaya yang komprehensif.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Mencetak tenaga kerja profesional yang siap bersaing di Jepang.</li>
            <li>Membangun karakter disiplin dan etos kerja yang tinggi.</li>
            <li>Menjadi mitra terpercaya bagi perusahaan Jepang dan masyarakat Indonesia.</li>
          </ul>
        </div>
      </div>

      <div className="text-center bg-gray-50 p-12 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Sejarah Kami</h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Berdiri sejak tahun 2015, Creativa Bridging International telah memberangkatkan lebih dari 500 peserta magang dan tenaga kerja spesifik ke berbagai prefektur di Jepang. Kami memulai perjalanan ini dengan semangat untuk meningkatkan kualitas sumber daya manusia Indonesia.
        </p>
      </div>
    </div>
  );
};

export default About;
