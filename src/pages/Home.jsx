import { ArrowRight, Globe, Users, BookOpen, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/dataContext';
import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

const HOME_HERO_BG_CACHE_KEY = 'settings.homeHeroBgUrl';

const Home = () => {
  const { articles } = useData();
  const latestArticles = articles.slice(0, 3);
  const [homeHeroBgUrl, setHomeHeroBgUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    const fetchSettings = async () => {
      try {
        const rows = await dataService.getAllStrict(dataService.KEYS.SETTINGS);
        if (!alive) return;
        const nextUrl =
          Array.isArray(rows)
            ? (rows.find((row) => typeof row?.homeHeroBgUrl === 'string' && row.homeHeroBgUrl.trim())?.homeHeroBgUrl || '').trim()
            : '';
        localStorage.setItem(HOME_HERO_BG_CACHE_KEY, nextUrl);
        setHomeHeroBgUrl(nextUrl || null);
      } catch {
        if (!alive) return;
        const cached = localStorage.getItem(HOME_HERO_BG_CACHE_KEY) || '';
        setHomeHeroBgUrl(cached.trim() ? cached.trim() : null);
      }
    };
    fetchSettings();
    return () => { alive = false; };
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-white overflow-hidden"
        style={
          homeHeroBgUrl
            ? { backgroundImage: `url(${homeHeroBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined
        }
      >
        <div className={`absolute inset-0 ${homeHeroBgUrl ? 'bg-black/50' : 'bg-blue-600'} z-0`}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Wujudkan Mimpimu ke Jepang
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            Creativa Bridging International siap membantumu meraih karir impian di Negeri Sakura dengan pelatihan bahasa dan keterampilan terbaik.
          </p>
          <div className="flex gap-4">
            <Link to="/daftar" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition duration-300">
              Daftar Sekarang
            </Link>
            <Link to="/program-jepang" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-blue-600 transition duration-300">
              Lihat Program
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Kenapa Memilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Jaringan Luas</h3>
              <p className="text-gray-600">Kerjasama dengan berbagai perusahaan dan institusi di Jepang.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Pengajar Profesional</h3>
              <p className="text-gray-600">Instruktur berpengalaman dan bersertifikat N2/N1.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-purple-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Kurikulum Terpadu</h3>
              <p className="text-gray-600">Materi pembelajaran yang disesuaikan dengan standar JLPT dan kebutuhan industri.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      {latestArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Berita Terbaru</h2>
                <p className="text-gray-600">Update informasi seputar Jepang dan kegiatan kami</p>
              </div>
              <Link to="/lowker" className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                Lihat Semua Lowker <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestArticles.map((article, index) => (
                <div key={article.id || index} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-xl mb-4 relative" style={{ aspectRatio: '1 / 1' }}>
                    <img 
                      src={article.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                      alt={article.title} 
                      className="absolute inset-0 w-full h-full bg-gray-50 object-contain" 
                    />
                  </div>
                  <div className="flex items-center text-xs text-blue-600 font-semibold mb-2 space-x-2">
                    <span className="bg-blue-50 px-2 py-1 rounded-md">{article.category}</span>
                    <span className="text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> {article.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 text-sm">
                    {article.summary}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link to="/lowker" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                Lihat Semua Lowker <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="bg-gray-800 text-white py-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Siap Memulai Perjalananmu?</h2>
          <p className="text-xl mb-8">Bergabunglah dengan ratusan alumni kami yang telah sukses di Jepang.</p>
          <Link to="/daftar" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition duration-300">
            Daftar Sekarang <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
