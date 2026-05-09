import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, BadgeInfo } from 'lucide-react';
import { useData } from '../context/dataContext';

const ProgramDetail = () => {
  const { id } = useParams();
  const { programs, loading } = useData();

  const program = useMemo(() => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return null;
    return programs.find((p) => Number(p.id) === numericId) || null;
  }, [id, programs]);

  const content = useMemo(() => {
    const raw = program?.description;
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed._type === 'programContent') {
        const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
        const blocks = Array.isArray(parsed.blocks) ? parsed.blocks : [];
        return {
          summary,
          blocks: blocks
            .filter((b) => b && typeof b === 'object')
            .map((b) => ({
              title: typeof b?.title === 'string' ? b.title : '',
              text: typeof b?.text === 'string' ? b.text : '',
              imageUrl: typeof b?.imageUrl === 'string' ? b.imageUrl : '',
              fit: b?.fit === 'cover' || b?.fit === 'contain' ? b.fit : 'contain',
              posX: Number.isFinite(Number(b?.posX)) ? Math.max(0, Math.min(100, Number(b.posX))) : 50,
              posY: Number.isFinite(Number(b?.posY)) ? Math.max(0, Math.min(100, Number(b.posY))) : 50,
            }))
        };
      }
      return null;
    } catch {
      return null;
    }
  }, [program?.description]);

  if (loading) return <div className="py-20 text-center">Loading program...</div>;

  if (!program) {
    return (
      <div className="bg-slate-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          <div className="flex items-center justify-between">
            <Link to="/program-jepang" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 text-center text-gray-600">
            Program tidak ditemukan.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/program-jepang" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-80 md:h-[420px] bg-gray-200">
            <img
              src={
                program.image ||
                'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
              }
              alt={program.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
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
              <span className={`inline-block text-xs px-3 py-1 rounded-full ${
                (program.status ?? 'Aktif') === 'Aktif' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {program.status || 'Aktif'}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
                <div className="text-sm text-gray-600">Kategori</div>
                <div className="font-semibold text-gray-900">{program.type || '-'}</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
                <div className="text-sm text-gray-600">Durasi</div>
                <div className="font-semibold text-gray-900">{program.duration || '-'}</div>
              </div>
              <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-600">Info</div>
                  <div className="font-semibold text-gray-900">Konsultasi</div>
                </div>
                <div className="text-blue-600">
                  <BadgeInfo className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</div>
              {content ? (
                <div className="space-y-6">
                  {content.summary?.trim() && (
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {content.summary}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {program.description}
                </div>
              )}
            </div>

          </div>
        </div>

        {content?.blocks?.length > 0 && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white py-10 sm:py-14">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              {content.blocks
                .filter((b) => b.imageUrl?.trim())
                .map((block, index) => (
                  <section
                    key={`${index}-${block.imageUrl}`}
                    className="relative w-full h-[72svh] md:h-[78svh] bg-white rounded-3xl overflow-hidden border border-gray-100"
                  >
                    <img
                      src={block.imageUrl}
                      alt={block.title || `Program ${program.title} - Gambar ${index + 1}`}
                      className={`absolute inset-0 w-full h-full ${block.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      style={{ objectPosition: `${block.posX}% ${block.posY}%` }}
                      loading="lazy"
                    />
                    {(block.title?.trim() || block.text?.trim()) && (
                      <>
                        <div className="absolute inset-0 bg-black/30"></div>
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                          <div className="max-w-3xl text-center text-white space-y-3">
                            {block.title?.trim() && (
                              <div className="text-3xl md:text-5xl font-bold">{block.title}</div>
                            )}
                            {block.text?.trim() && (
                              <div className="text-base md:text-xl whitespace-pre-line">{block.text}</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </section>
                ))}

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/daftar"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold min-w-56"
                >
                  Daftar Sekarang
                </Link>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors font-semibold min-w-56"
                >
                  Konsultasi via WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
        {!(content?.blocks?.length > 0) && (
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/daftar"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold min-w-56"
            >
              Daftar Sekarang
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors font-semibold min-w-56"
            >
              Konsultasi via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramDetail;
