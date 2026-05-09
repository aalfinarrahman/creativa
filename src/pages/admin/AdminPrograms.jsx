
import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, FolderPlus, X, Save, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../context/dataContext';

const AdminPrograms = () => {
  const { programs, actions, loading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [orderedPrograms, setOrderedPrograms] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [contentSummary, setContentSummary] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    type: 'Kelas Intensif',
    status: 'Aktif'
  });

  const imagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const editingProgram = useMemo(() => {
    if (!editingId) return null;
    return (programs || []).find((p) => String(p.id) === String(editingId)) || null;
  }, [editingId, programs]);

  const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID();
    return String(Date.now() + Math.random());
  };

  const parseProgramContent = (raw) => {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed._type === 'programContent' && Array.isArray(parsed.blocks)) {
        return {
          summary: typeof parsed.summary === 'string' ? parsed.summary : '',
          blocks: parsed.blocks.map((b) => ({
            id: generateId(),
            title: typeof b?.title === 'string' ? b.title : '',
            text: typeof b?.text === 'string' ? b.text : '',
            imageUrl: typeof b?.imageUrl === 'string' ? b.imageUrl : '',
            fit: b?.fit === 'cover' || b?.fit === 'contain' ? b.fit : 'contain',
            posX: Number.isFinite(Number(b?.posX)) ? Math.max(0, Math.min(100, Number(b.posX))) : 50,
            posY: Number.isFinite(Number(b?.posY)) ? Math.max(0, Math.min(100, Number(b.posY))) : 50,
            imageFile: null,
            imagePreviewUrl: '',
          })),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const getProgramSummary = (raw) => {
    const parsed = parseProgramContent(raw);
    if (parsed) return parsed.summary || '';
    return typeof raw === 'string' ? raw : '';
  };

  const newBlock = () => ({
    id: generateId(),
    title: '',
    text: '',
    imageUrl: '',
    fit: 'cover',
    posX: 50,
    posY: 50,
    imageFile: null,
    imagePreviewUrl: '',
  });

  const revokeBlockPreviewUrl = (block) => {
    const url = block?.imagePreviewUrl;
    if (typeof url === 'string' && url) URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isModalOpen) return;
    setImageFile(null);
    setContentSummary('');
    setContentBlocks((prev) => {
      for (const block of prev || []) revokeBlockPreviewUrl(block);
      return [];
    });
  }, [isModalOpen]);

  const sortedPrograms = useMemo(() => {
    const copy = [...(programs || [])];
    const toOrder = (p) => {
      const v = p?.sort_order;
      if (v === null || v === undefined || v === '') return Number.POSITIVE_INFINITY;
      const n = Number(v);
      return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
    };
    copy.sort((a, b) => {
      const diff = toOrder(a) - toOrder(b);
      if (diff !== 0) return diff;
      const at = new Date(a?.created_at || 0).getTime();
      const bt = new Date(b?.created_at || 0).getTime();
      return bt - at;
    });
    return copy;
  }, [programs]);

  useEffect(() => {
    setOrderedPrograms(sortedPrograms);
  }, [sortedPrograms]);

  const handleOpenModal = (program = null) => {
    if (program) {
      const parsed = parseProgramContent(program.description);
      setEditingId(program.id);
      setFormData({
        title: program.title,
        description: program.description,
        duration: program.duration || '',
        type: program.type || 'Kelas Intensif',
        status: program.status || 'Aktif'
      });
      setImageFile(null);
      setContentSummary(parsed?.summary || '');
      setContentBlocks(parsed?.blocks?.length ? parsed.blocks : [newBlock()]);
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        type: 'Kelas Intensif',
        status: 'Aktif'
      });
      setImageFile(null);
      setContentSummary('');
      setContentBlocks([newBlock()]);
    }
    setIsModalOpen(true);
  };

  const moveItem = (list, fromIndex, toIndex) => {
    const next = [...list];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    return next;
  };

  const applyReorder = async (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const fromIndex = orderedPrograms.findIndex((p) => String(p.id) === String(fromId));
    const toIndex = orderedPrograms.findIndex((p) => String(p.id) === String(toId));
    if (fromIndex < 0 || toIndex < 0) return;

    const next = moveItem(orderedPrograms, fromIndex, toIndex);
    setOrderedPrograms(next);
    await actions.reorderPrograms(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.title || '');
      payload.append('duration', formData.duration || '');
      payload.append('type', formData.type || 'Kelas Intensif');
      payload.append('status', formData.status || 'Aktif');

      const blocksForApi = (contentBlocks || []).map((b) => {
        const imageKey = b?.imageFile ? `blockImage_${b.id}` : '';
        return {
          title: b?.title || '',
          text: b?.text || '',
          imageUrl: b?.imageUrl || '',
          fit: b?.fit === 'cover' || b?.fit === 'contain' ? b.fit : 'cover',
          posX: Number.isFinite(Number(b?.posX)) ? Number(b.posX) : 50,
          posY: Number.isFinite(Number(b?.posY)) ? Number(b.posY) : 50,
          imageKey: imageKey || undefined,
        };
      });

      payload.append('contentBlocks', JSON.stringify({ summary: contentSummary || '', blocks: blocksForApi }));

      if (imageFile) payload.append('programImage', imageFile);
      for (const block of contentBlocks || []) {
        if (block?.imageFile) {
          payload.append(`blockImage_${block.id}`, block.imageFile);
        }
      }

      if (editingId) {
        await actions.updateProgram(editingId, payload);
      } else {
        await actions.addProgram(payload);
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
      await actions.deleteProgram(id);
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Program</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {orderedPrograms.map((program) => (
          <div
            key={program.id}
            draggable
            onDragStart={(e) => {
              setDraggingId(program.id);
              try {
                e.dataTransfer.setData('text/plain', String(program.id));
              } catch {
                // ignore
              }
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverId(program.id);
              e.dataTransfer.dropEffect = 'move';
            }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={async (e) => {
              e.preventDefault();
              const raw = e.dataTransfer.getData('text/plain');
              const fromId = raw || draggingId;
              const toId = program.id;
              setDraggingId(null);
              setDragOverId(null);
              await applyReorder(fromId, toId);
            }}
            onDragEnd={() => {
              setDraggingId(null);
              setDragOverId(null);
            }}
            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${
              dragOverId === program.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <FolderPlus className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    program.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {program.status || 'Aktif'}
                  </span>
                  <div className="text-gray-300 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{program.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{getProgramSummary(program.description)}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{program.duration}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{program.type}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 border-t pt-4 mt-auto">
              <button 
                onClick={() => handleOpenModal(program)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(program.id)}
                className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors ml-4"
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Program' : 'Tambah Program'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ringkasan</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={contentSummary}
                  onChange={(e) => setContentSummary(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Gambar Program (Cover)</label>
                <div className="flex items-start gap-4">
                  <div className="h-24 w-32 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                    {(imagePreview || (!imageFile && editingProgram?.image)) ? (
                      <img
                        src={imagePreview || editingProgram?.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full text-sm"
                    />
                    {imageFile && (
                      <div className="text-xs text-gray-600 mt-1">File dipilih: <span className="font-medium">{imageFile.name}</span></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-800">Konten Program</div>
                  <button
                    type="button"
                    onClick={() => setContentBlocks((prev) => [...(prev || []), newBlock()])}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Section
                  </button>
                </div>

                <div className="space-y-4">
                  {(contentBlocks || []).map((block, idx) => {
                    return (
                      <div key={block.id} className="rounded-xl border border-gray-200 bg-slate-50 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-gray-800">Section {idx + 1}</div>
                          <button
                            type="button"
                            onClick={() => {
                              setContentBlocks((prev) => {
                                const current = prev || [];
                                const target = current.find((b) => b.id === block.id);
                                if (target) revokeBlockPreviewUrl(target);
                                return current.filter((b) => b.id !== block.id);
                              });
                            }}
                            className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Hapus
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Judul</label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              value={block.title}
                              onChange={(e) =>
                                setContentBlocks((prev) =>
                                  (prev || []).map((b) => (b.id === block.id ? { ...b, title: e.target.value } : b))
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Teks</label>
                            <textarea
                              rows="4"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              value={block.text}
                              onChange={(e) =>
                                setContentBlocks((prev) =>
                                  (prev || []).map((b) => (b.id === block.id ? { ...b, text: e.target.value } : b))
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Gambar (opsional)</label>
                            <div className="flex items-start gap-4">
                              <div className="h-24 w-32 rounded-lg border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                                {(block.imagePreviewUrl || block.imageUrl) ? (
                                  <img
                                    src={block.imagePreviewUrl || block.imageUrl}
                                    alt="Preview"
                                    className={`w-full h-full ${block.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                    style={{ objectPosition: `${block.posX}% ${block.posY}%` }}
                                  />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    setContentBlocks((prev) => {
                                      const next = (prev || []).map((b) => {
                                        if (b.id !== block.id) return b;
                                        revokeBlockPreviewUrl(b);
                                        const previewUrl = file ? URL.createObjectURL(file) : '';
                                        return { ...b, imageFile: file, imagePreviewUrl: previewUrl };
                                      });
                                      return next;
                                    });
                                  }}
                                  className="w-full text-sm"
                                />
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setContentBlocks((prev) => {
                                        const next = (prev || []).map((b) => {
                                          if (b.id !== block.id) return b;
                                          revokeBlockPreviewUrl(b);
                                          return { ...b, imageFile: null, imagePreviewUrl: '' };
                                        });
                                        return next;
                                      });
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
                                  >
                                    Reset File
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setContentBlocks((prev) => {
                                        const next = (prev || []).map((b) => {
                                          if (b.id !== block.id) return b;
                                          revokeBlockPreviewUrl(b);
                                          return { ...b, imageUrl: '', imageFile: null, imagePreviewUrl: '' };
                                        });
                                        return next;
                                      });
                                    }}
                                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
                                  >
                                    Hapus Gambar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Mode</label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              value={block.fit}
                              onChange={(e) =>
                                setContentBlocks((prev) =>
                                  (prev || []).map((b) => (b.id === block.id ? { ...b, fit: e.target.value } : b))
                                )
                              }
                            >
                              <option value="cover">Penuh (crop)</option>
                              <option value="contain">Utuh (tanpa crop)</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Posisi Horizontal</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={block.posX}
                                onChange={(e) =>
                                  setContentBlocks((prev) =>
                                    (prev || []).map((b) =>
                                      b.id === block.id ? { ...b, posX: Number(e.target.value) } : b
                                    )
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Posisi Vertikal</label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={block.posY}
                                onChange={(e) =>
                                  setContentBlocks((prev) =>
                                    (prev || []).map((b) =>
                                      b.id === block.id ? { ...b, posY: Number(e.target.value) } : b
                                    )
                                  )
                                }
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: 3 Bulan / 6 Bulan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Program</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Kelas Intensif">Kelas Intensif</option>
                    <option value="Kelas Lanjutan">Kelas Lanjutan</option>
                    <option value="Dana Talangan">Dana Talangan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrograms;
