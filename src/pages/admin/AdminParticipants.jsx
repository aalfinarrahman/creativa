
import { useMemo, useState } from 'react';
import { Search, Trash2, Edit, Plus, X, Save, Send, Eye } from 'lucide-react';
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

const normalizePhoneToWa = (rawPhone) => {
  if (!rawPhone) return '';
  const digitsOnly = String(rawPhone).replace(/[^\d]/g, '');
  if (!digitsOnly) return '';
  if (digitsOnly.startsWith('62')) return digitsOnly;
  if (digitsOnly.startsWith('0')) return `62${digitsOnly.slice(1)}`;
  if (digitsOnly.startsWith('8')) return `62${digitsOnly}`;
  return digitsOnly;
};

const getComputed = (participant) => {
  const details = parseDetails(participant.details);
  const email = participant.email || details?.email || '';
  const phone = participant.phone || details?.noWhatsapp || details?.phone || '';
  const noKtp = participant.noKtp || details?.noKtp || '';
  const program = participant.program || details?.programMinat || '';
  const matchingJob = participant.matchingJob || details?.matchingJob || '';
  const remarks = participant.remarks || '';

  const issues = [];
  if (!participant.name) issues.push('Nama kosong');
  if (!email) issues.push('Email kosong');
  if (!noKtp) issues.push('No KTP kosong');
  if (!phone) issues.push('No WhatsApp kosong');
  if (!program) issues.push('Program kosong');
  if (program === 'Matching Job' && !matchingJob) issues.push('Matching Job belum diisi');
  if (Object.prototype.hasOwnProperty.call(participant, 'password_hash') && !participant.password_hash) {
    issues.push('Password login belum diatur');
  }

  return { email, phone, noKtp, program, matchingJob, remarks, issues };
};

const AdminParticipants = () => {
  const { participants, actions, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeIssues, setActiveIssues] = useState([]);
  const [detailParticipant, setDetailParticipant] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    program: 'Magang',
    matchingJob: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    email: '',
    noKtp: '',
    phone: '',
    remarks: '',
    password: ''
  });

  const issueCount = useMemo(() => {
    return participants.reduce((acc, p) => acc + (getComputed(p).issues.length > 0 ? 1 : 0), 0);
  }, [participants]);

  const detailView = useMemo(() => {
    if (!detailParticipant) return null;
    const computed = getComputed(detailParticipant);
    const details = parseDetails(detailParticipant.details) || {};
    const merged = {
      ...details,
      ...detailParticipant,
      programMinat: details.programMinat || computed.program || '',
      noWhatsapp: details.noWhatsapp || computed.phone || '',
      email: details.email || computed.email || '',
      noKtp: details.noKtp || computed.noKtp || '',
      matchingJob: details.matchingJob || computed.matchingJob || '',
      remarks: computed.remarks || detailParticipant.remarks || ''
    };

    const getValue = (key) => {
      const v = merged[key];
      if (v === null || v === undefined || v === '') return '-';
      if (typeof v === 'boolean') return v ? 'Ya' : 'Tidak';
      return String(v);
    };

    const sections = [
      {
        title: 'Identitas Diri',
        fields: [
          ['namaLengkap', 'Nama Lengkap'],
          ['email', 'Email'],
          ['noKtp', 'No KTP'],
          ['noWhatsapp', 'No WhatsApp'],
          ['instagram', 'Instagram'],
          ['usia', 'Usia'],
          ['pendidikan', 'Pendidikan'],
          ['jurusan', 'Jurusan'],
          ['kotaDomisili', 'Kota Domisili'],
        ]
      },
      {
        title: 'Fisik',
        fields: [
          ['tinggiBadan', 'Tinggi Badan'],
          ['beratBadan', 'Berat Badan'],
        ]
      },
      {
        title: 'Pekerjaan',
        fields: [
          ['statusPekerjaan', 'Status Pekerjaan'],
          ['pengalamanKerjaIndonesia', 'Pengalaman Kerja di Indonesia'],
          ['posisiPengalamanKerja', 'Posisi Pengalaman Kerja'],
          ['statusPernikahan', 'Status Pernikahan'],
        ]
      },
      {
        title: 'Kesehatan',
        fields: [
          ['kondisiMata', 'Kondisi Mata'],
          ['besarMinus', 'Besar Minus'],
          ['butaWarna', 'Buta Warna'],
          ['bertato', 'Bertato'],
          ['bertindik', 'Bertindik'],
          ['patahTulang', 'Pernah Patah Tulang'],
          ['kondisiTulang', 'Kondisi Tulang'],
          ['skoliosis', 'Skoliosis'],
          ['cacatFisik', 'Cacat Fisik'],
          ['penyakitBerat', 'Penyakit Berat'],
          ['penyakitMenular', 'Penyakit Menular'],
        ]
      },
      {
        title: 'Kemampuan & Minat',
        fields: [
          ['sertifikatJlpt', 'Memiliki Sertifikat JLPT/JFT'],
          ['sertifikatSsw', 'Memiliki Sertifikat SSW'],
          ['bidangSsw', 'Bidang SSW'],
          ['programMinat', 'Program yang Diminati'],
          ['matchingJob', 'Matching Job'],
          ['matchingJobLainnya', 'Matching Job Lainnya'],
          ['kemampuanBahasa', 'Kemampuan Bahasa Jepang'],
          ['rencanaKeJepang', 'Rencana ke Jepang'],
          ['relasiDiJepang', 'Relasi di Jepang'],
          ['pengalamanLuarNegeri', 'Pengalaman Luar Negeri'],
          ['pengalamanIlegal', 'Pengalaman Ilegal/Deportasi'],
          ['lokasiTinggal', 'Lokasi Tinggal'],
        ]
      },
      {
        title: 'Administrasi',
        fields: [
          ['date', 'Tanggal Daftar'],
          ['status', 'Status'],
          ['remarks', 'Remarks'],
        ]
      },
    ];

    return { computed, details, merged, getValue, sections };
  }, [detailParticipant]);

  const handleOpenModal = (participant = null) => {
    if (participant) {
      const computed = getComputed(participant);
      setEditingId(participant.id);
      setFormData({
        name: participant.name,
        program: computed.program,
        matchingJob: computed.matchingJob,
        status: participant.status,
        date: participant.date,
        email: computed.email || '',
        noKtp: computed.noKtp || '',
        phone: computed.phone || '',
        remarks: computed.remarks || '',
        password: ''
      });
      setActiveIssues(computed.issues);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        program: 'Magang',
        matchingJob: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        email: '',
        noKtp: '',
        phone: '',
        remarks: '',
        password: ''
      });
      setActiveIssues([]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    payload.matchingJob = formData.program === 'Matching Job' ? formData.matchingJob : '';
    if (typeof payload.password === 'string') payload.password = payload.password.trim();
    if (!payload.password) delete payload.password;
    if (editingId) {
      await actions.updateParticipant(editingId, payload);
    } else {
      await actions.addParticipant(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
      await actions.deleteParticipant(id);
    }
  };

  const handleOpenDetail = (participant) => {
    setDetailParticipant(participant);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setDetailParticipant(null);
  };

  const handleSendWa = (participant) => {
    const computed = getComputed(participant);
    const waPhone = normalizePhoneToWa(computed.phone);
    if (!waPhone) return;

    const issuesLines = computed.issues.length ? computed.issues.map(i => `- ${i}`).join('\n') : '';
    const remarksLines = computed.remarks ? `\n\nCatatan admin:\n${computed.remarks}` : '';
    const text =
      `Halo ${participant.name || ''}, terima kasih sudah mendaftar di Creativa Bridging International.\n` +
      (issuesLines ? `\nKami menemukan beberapa data perlu dicek:\n${issuesLines}\n` : '\n') +
      `${remarksLines}\n\nMohon balas WA ini dengan data yang benar. Terima kasih.`;

    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Filter logic
  const filteredParticipants = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => {
      const computed = getComputed(p);
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (computed.program || '').toLowerCase().includes(q) ||
        (computed.email || '').toLowerCase().includes(q) ||
          (computed.noKtp || '').toLowerCase().includes(q) ||
        (computed.phone || '').toLowerCase().includes(q) ||
        (computed.matchingJob || '').toLowerCase().includes(q)
      );
    });
  }, [participants, searchTerm]);

  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Data Peserta</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Peserta
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama, email, WA, program, matching job..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {issueCount > 0 && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Ada {issueCount} data peserta yang perlu dicek (baris berwarna merah).
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold border-b">Nama</th>
                <th className="px-6 py-3 font-semibold border-b">Email</th>
                <th className="px-6 py-3 font-semibold border-b">No KTP</th>
                <th className="px-6 py-3 font-semibold border-b">WhatsApp</th>
                <th className="px-6 py-3 font-semibold border-b">Program</th>
                <th className="px-6 py-3 font-semibold border-b">Matching Job</th>
                <th className="px-6 py-3 font-semibold border-b">Tanggal Daftar</th>
                <th className="px-6 py-3 font-semibold border-b">Status</th>
                <th className="px-6 py-3 font-semibold border-b">Remarks</th>
                <th className="px-6 py-3 font-semibold border-b text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((p) => {
                  const computed = getComputed(p);
                  const hasIssues = computed.issues.length > 0;
                  const waPhone = normalizePhoneToWa(computed.phone);
                  return (
                  <tr
                    key={p.id}
                    className={`${hasIssues ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600">{computed.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{computed.noKtp || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{computed.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{computed.program || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{computed.matchingJob || '-'}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{p.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'Lulus Seleksi' ? 'bg-green-100 text-green-700' :
                        p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        p.status === 'Terbang' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {computed.remarks ? (
                        <div className="whitespace-pre-wrap">{computed.remarks}</div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                      {hasIssues && (
                        <div className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
                          {computed.issues.map((i) => `• ${i}`).join('\n')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleSendWa(p)}
                          disabled={!waPhone}
                          className={`${waPhone ? 'text-green-600 hover:text-green-800' : 'text-gray-300'} p-1`}
                          title={waPhone ? 'Kirim WA' : 'No WhatsApp belum ada'}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenDetail(p)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="Lihat Detail"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(p)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data peserta.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Peserta' : 'Tambah Peserta'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeIssues.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 whitespace-pre-wrap">
                  {activeIssues.map((i) => `• ${i}`).join('\n')}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                >
                  {formData.program && !['Kelas Intensif', 'Kelas Lanjutan', 'Dana Talangan'].includes(formData.program) && (
                    <option value={formData.program}>{formData.program}</option>
                  )}
                  <option value="Kelas Intensif">Kelas Intensif</option>
                  <option value="Kelas Lanjutan">Kelas Lanjutan</option>
                  <option value="Dana Talangan">Dana Talangan</option>
                  <option value="Matching Job">Matching Job</option>
                </select>
              </div>

              {formData.program === 'Matching Job' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matching Job</label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.matchingJob}
                    onChange={(e) => setFormData({ ...formData, matchingJob: e.target.value })}
                  >
                    <option value="">Pilih Matching Job</option>
                    <option value="Kaigo">Kaigo</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restoran">Restoran</option>
                    <option value="Manufaktur/Factory">Manufaktur/Factory</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Wawancara">Wawancara</option>
                  <option value="Lulus Seleksi">Lulus Seleksi</option>
                  <option value="Dokumen">Dokumen</option>
                  <option value="Pelatihan">Pelatihan</option>
                  <option value="Terbang">Terbang</option>
                  <option value="Gagal">Gagal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No KTP</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.noKtp}
                  onChange={(e) => setFormData({ ...formData, noKtp: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Login Siswa</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin ubah"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px]"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Catatan untuk peserta (mis. data kurang jelas, minta perbaikan, dll)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Daftar</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
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
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && detailView && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <div className="text-lg font-bold text-gray-800">Detail Peserta</div>
              <div className="text-sm text-gray-600">
                {detailParticipant?.name || detailView.getValue('namaLengkap')} • {detailView.getValue('programMinat')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSendWa(detailParticipant)}
                disabled={!normalizePhoneToWa(detailView.getValue('noWhatsapp')) || detailView.getValue('noWhatsapp') === '-'}
                className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Kirim WA
              </button>
              <button
                onClick={() => {
                  handleCloseDetail();
                  handleOpenModal(detailParticipant);
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button onClick={handleCloseDetail} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {detailView.computed.issues.length > 0 && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 whitespace-pre-wrap">
                {detailView.computed.issues.map((i) => `• ${i}`).join('\n')}
              </div>
            )}

            {detailView.sections.map((section) => (
              <div key={section.title} className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 text-gray-800 font-semibold">{section.title}</div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {section.fields.map(([key, label]) => (
                    <div key={key} className="flex items-start justify-between gap-4">
                      <div className="text-sm text-gray-600">{label}</div>
                      <div className="text-sm text-gray-900 font-medium text-right whitespace-pre-wrap max-w-[60%]">
                        {detailView.getValue(key)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 text-gray-800 font-semibold">Berkas</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm text-gray-600">Foto</div>
                  <div className="text-sm text-gray-900 font-medium text-right">
                    {detailParticipant?.fotoUrl ? (
                      <a className="text-blue-600 hover:text-blue-800" href={detailParticipant.fotoUrl} target="_blank" rel="noreferrer">
                        Lihat Foto
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-sm text-gray-600">CV</div>
                  <div className="text-sm text-gray-900 font-medium text-right">
                    {detailParticipant?.cvUrl ? (
                      <a className="text-blue-600 hover:text-blue-800" href={detailParticipant.cvUrl} target="_blank" rel="noreferrer">
                        Lihat CV
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParticipants;
