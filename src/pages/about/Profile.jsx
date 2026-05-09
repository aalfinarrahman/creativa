import AboutLayout from './AboutLayout';

const Profile = () => {
  return (
    <AboutLayout title="Profil Creativa Bridging International">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Gedung Creativa Bridging International" 
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4 text-gray-700 leading-relaxed">
          <p>
            <span className="font-bold text-blue-600">Creativa Bridging International</span> adalah lembaga pelatihan kerja (LPK) yang berdedikasi untuk mempersiapkan sumber daya manusia Indonesia yang berkualitas dan siap bersaing di kancah internasional, khususnya Jepang.
          </p>
          <p>
            Berdiri dengan komitmen kuat untuk menjembatani talenta muda Indonesia dengan peluang karir global, kami menyediakan program pelatihan bahasa Jepang yang intensif, pelatihan budaya, serta keterampilan teknis yang dibutuhkan oleh industri di Jepang.
          </p>
          <p>
            Kami percaya bahwa setiap individu memiliki potensi untuk berkembang. Melalui metode pembelajaran yang terstruktur dan didukung oleh tenaga pengajar profesional, Creativa Bridging International berupaya mencetak lulusan yang tidak hanya mahir berbahasa, tetapi juga memiliki etos kerja, disiplin, dan mentalitas yang kuat sesuai standar Jepang.
          </p>
        </div>
      </div>
    </AboutLayout>
  );
};

export default Profile;
