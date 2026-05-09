import { Link } from 'react-router-dom';
import { useData } from '../context/dataContext';

const Articles = () => {
  const { articles, loading } = useData();

  if (loading) return <div className="py-20 text-center">Loading lowker...</div>;
  const filteredArticles = articles;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lowongan Pekerjaan Terbaru di Jepang</h1>
          <p className="text-xl text-gray-600">Update lowongan kerja Jepang untuk berbagai bidang. Langsung daftar dari sini.</p>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada lowongan kerja yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <article key={article.id || index} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                <div className="overflow-hidden relative group" style={{ aspectRatio: '1 / 1' }}>
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full bg-gray-50 object-contain" 
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>

                  <Link
                    to="/daftar"
                    className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
