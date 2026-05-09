const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Creativa Bridging International</h3>
            <p className="text-gray-400">
              Mewujudkan impian bekerja dan belajar di Jepang dengan program pelatihan terbaik.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <p className="text-gray-400">Email: info@creativabridging.com</p>
            <p className="text-gray-400">Telp: +62 877 2020 7725</p>
            <p className="text-gray-400">Alamat: Kp Jl. Panembong Girang No.23, RT.03/RW.04, Mekarsari, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Creativa Bridging International. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
