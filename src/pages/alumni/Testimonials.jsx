import { Quote } from 'lucide-react';
import { useMemo } from 'react';
import { useData } from '../../context/dataContext';

const parseDetails = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const Testimonials = () => {
  const { participants } = useData();

  const testimonials = useMemo(() => {
    const dynamic = (Array.isArray(participants) ? participants : [])
      .map((p) => {
        const details = parseDetails(p?.details) || {};
        const quote = typeof details.testimoni === 'string' ? details.testimoni.trim() : '';
        if (!quote) return null;
        const name = String(details.namaLengkap || p?.name || '').trim() || 'Alumni';
        const program = String(p?.program || details.programMinat || '').trim();
        const company = String(details.namaPerusahaan || '').trim();
        const roleParts = [program, company].filter(Boolean);
        const role = roleParts.join(' - ') || 'Alumni';
        const image = typeof p?.fotoUrl === 'string' && p.fotoUrl.trim() ? p.fotoUrl.trim() : '';

        return {
          id: `p-${p?.id ?? name}`,
          name,
          role,
          image,
          quote,
        };
      })
      .filter(Boolean)
      .sort((a, b) => String(b.id).localeCompare(String(a.id)));

    return dynamic;
  }, [participants]);

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Apa Kata Alumni?</h2>
        <p className="text-lg text-gray-600">
          Dengarkan langsung pengalaman mereka yang telah berhasil mewujudkan impian bekerja di Jepang bersama kami.
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-600">
          Belum ada testimoni dari siswa.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-8 relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100 fill-current" />
              
              <div className="flex items-center gap-4 mb-6">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-100" />
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-blue-600 font-medium">{item.role}</p>
                </div>
              </div>
              
              <p className="text-gray-600 italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimonials;
