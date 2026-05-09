const Register = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Pendaftaran Peserta Baru</h1>
      
      <form className="bg-white shadow-xl rounded-2xl px-8 pt-10 pb-12 space-y-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-6 text-gray-800">Data Diri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nama">Nama Lengkap</label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="nama" type="text" placeholder="Nama Lengkap" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nik">NIK KTP</label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="nik" type="text" placeholder="16 Digit NIK" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ttl">Tempat Tanggal Lahir</label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="ttl" type="text" placeholder="Kota, DD-MM-YYYY" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">Jenis Kelamin</label>
              <select className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="gender">
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="alamat">Alamat Lengkap</label>
            <textarea className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="alamat" rows="3" placeholder="Alamat sesuai KTP"></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold border-b pb-2 mb-6 text-gray-800">Kontak & Program</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="email" type="email" placeholder="email@example.com" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wa">No. WhatsApp</label>
              <input className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="wa" type="tel" placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="program">Program Diminati</label>
            <select className="shadow-sm border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" id="program">
              <option>Magang (Kenshusei)</option>
              <option>Tokutei Ginou (SSW)</option>
              <option>Sekolah Bahasa (Ryugakusei)</option>
              <option>Kursus Bahasa Jepang Intensif</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-lg transform hover:-translate-y-0.5" type="button">
            Daftar Sekarang
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
