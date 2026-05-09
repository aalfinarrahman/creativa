import { Link } from 'react-router-dom';
import { useData } from '../context/dataContext';

const getProgramSummary = (raw) => {
  if (typeof raw !== 'string') return '';
  const text = raw.trim();
  if (!text) return '';
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed._type === 'programContent') {
      const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
      if (summary) return summary;
      if (Array.isArray(parsed.blocks)) {
        const firstText = parsed.blocks.find((b) => typeof b?.text === 'string' && b.text.trim())?.text;
        return typeof firstText === 'string' ? firstText.trim() : '';
      }
      return '';
    }
  } catch {
    // ignore
  }
  return text;
};

const JapanProgram = () => {
  const { programs, loading } = useData();
  const activePrograms = programs
    .filter((p) => (p.status ?? 'Aktif') === 'Aktif')
    .sort((a, b) => {
      const ao = a?.sort_order;
      const bo = b?.sort_order;
      const hasA = ao !== null && ao !== undefined && ao !== '';
      const hasB = bo !== null && bo !== undefined && bo !== '';
      if (hasA && hasB) return Number(ao) - Number(bo);
      if (hasA && !hasB) return -1;
      if (!hasA && hasB) return 1;

      const toKey = (p) => {
        const text = `${p.type ?? ''} ${p.title ?? ''}`.toLowerCase();
        if (text.includes('intensif')) return 1;
        if (text.includes('lanjutan')) return 2;
        if (text.includes('talangan')) return 3;
        return 99;
      };
      return toKey(a) - toKey(b);
    });

  if (loading) return <div className="py-20 text-center">Loading programs...</div>;

  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Program Jepang</h1>

        {activePrograms.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center text-gray-600">
            Program belum tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activePrograms.map((program, index) => (
              <div
                key={program.id || index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={
                      program.image ||
                      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                    }
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-3 text-blue-700">{program.title}</h2>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {program.type && (
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                        {program.type}
                      </span>
                    )}
                    {program.duration && (
                      <span className="inline-block bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full">
                        {program.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4 flex-grow whitespace-pre-line">{getProgramSummary(program.description)}</p>

                  <Link
                    to={`/program-jepang/${program.id}`}
                    className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-center"
                  >
                    Selengkapnya
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JapanProgram;
