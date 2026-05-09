import { useData } from '../context/dataContext';

const Gallery = () => {
  const { gallery, loading } = useData();

  if (loading) return <div className="py-20 text-center">Loading gallery...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Galeri Kegiatan</h1>
      
      {gallery.length === 0 ? (
        <div className="text-center text-gray-500">Belum ada foto di galeri.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((photo, index) => (
            <div key={photo.id || index} className="group relative overflow-hidden rounded-lg shadow-lg aspect-w-16 aspect-h-9">
              <img 
                src={photo.image || photo.imageUrl || photo.src || photo.url || 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={photo.title} 
                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold px-4 text-center">{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
