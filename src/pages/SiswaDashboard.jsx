import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, Clock, CreditCard, FileText, LayoutDashboard, LogOut, MapPin, Menu, MessageCircle, Trash2, Upload, User, X } from 'lucide-react';
import { useData } from '../context/dataContext';

const parseDetails = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const SiswaDashboard = () => {
  const navigate = useNavigate();
  const { participants, loading, actions } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [fotoFile, setFotoFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [jlptFile, setJlptFile] = useState(null);
  const [sswFile, setSswFile] = useState(null);
  const [uploadingKey, setUploadingKey] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [testimoniText, setTestimoniText] = useState('');
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [koordinatLokasi, setKoordinatLokasi] = useState('');
  const [lokasiMapsUrl, setLokasiMapsUrl] = useState('');
  const [lokasiQuery, setLokasiQuery] = useState('');
  const [lokasiResults, setLokasiResults] = useState([]);
  const [lokasiSearching, setLokasiSearching] = useState(false);
  const [pembayaranStatus, setPembayaranStatus] = useState('');
  const [pembayaranTanggal, setPembayaranTanggal] = useState('');
  const [pembayaranNominal, setPembayaranNominal] = useState('');
  const [pembayaranCatatan, setPembayaranCatatan] = useState('');

  const role = localStorage.getItem('authRole');
  const siswaId = Number(localStorage.getItem('siswaId') || 0);

  const participant = useMemo(() => {
    if (!siswaId) return null;
    return participants.find((p) => Number(p.id) === siswaId) || null;
  }, [participants, siswaId]);

  const view = useMemo(() => {
    if (!participant) return null;
    const details = parseDetails(participant.details) || {};

    const merged = {
      ...details,
      ...participant,
      programMinat: details.programMinat || participant.program || '',
      noWhatsapp: details.noWhatsapp || participant.phone || '',
      email: details.email || participant.email || '',
      noKtp: details.noKtp || participant.noKtp || '',
      matchingJob: details.matchingJob || participant.matchingJob || '',
      remarks: participant.remarks || details.remarks || ''
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
        title: 'Status Pendaftaran',
        fields: [
          ['program', 'Program'],
          ['status', 'Status'],
          ['date', 'Tanggal Daftar'],
          ['remarks', 'Remarks'],
        ]
      },
    ];

    return { getValue, sections, merged };
  }, [participant]);

  useEffect(() => {
    if (!participant) return;
    const details = parseDetails(participant.details) || {};
    setTestimoniText(typeof details.testimoni === 'string' ? details.testimoni : '');
    setNamaPerusahaan(typeof details.namaPerusahaan === 'string' ? details.namaPerusahaan : '');
    const lat = details.lokasiLat;
    const lng = details.lokasiLng;
    const coordFromNumbers =
      (typeof lat === 'number' && Number.isFinite(lat)) && (typeof lng === 'number' && Number.isFinite(lng))
        ? `${lat},${lng}`
        : '';
    setKoordinatLokasi(typeof details.koordinatLokasi === 'string' ? details.koordinatLokasi : coordFromNumbers);
    setLokasiMapsUrl(typeof details.lokasiMapsUrl === 'string' ? details.lokasiMapsUrl : '');
    setLokasiQuery('');
    setLokasiResults([]);
    setPembayaranStatus(typeof details.pembayaranStatus === 'string' ? details.pembayaranStatus : '');
    setPembayaranTanggal(typeof details.pembayaranTanggal === 'string' ? details.pembayaranTanggal : '');
    setPembayaranNominal(typeof details.pembayaranNominal === 'string' ? details.pembayaranNominal : '');
    setPembayaranCatatan(typeof details.pembayaranCatatan === 'string' ? details.pembayaranCatatan : '');
  }, [participant]);

  if (role !== 'siswa') return <Navigate to="/login" replace />;
  if (loading) return <div className="max-w-5xl mx-auto p-6">Memuat data...</div>;
  if (!participant) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Siswa</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          Data peserta tidak ditemukan. Silakan login ulang.
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('authRole');
    localStorage.removeItem('siswaId');
    localStorage.removeItem('siswaEmail');
    localStorage.removeItem('siswaName');
    navigate('/');
  };

  const currentStatus = String(participant.status || '').trim() || '-';
  const currentProgram = String(participant.program || '').trim() || '-';
  const currentDate = String(participant.date || '').trim() || '-';
  const currentMatchingJob = String(view?.merged?.matchingJob || '').trim();
  const remarks = String(view?.merged?.remarks || '').trim();
  const displayName = String(view?.merged?.namaLengkap || participant.name || '').trim() || 'Siswa';
  const displayEmail = String(view?.merged?.email || participant.email || '').trim() || '-';

  const steps = [
    { key: 'pendaftaran', label: 'Pendaftaran' },
    { key: 'seleksi', label: 'Seleksi' },
    { key: 'pelatihan', label: 'Pelatihan' },
    { key: 'dokumen', label: 'Dokumen' },
    { key: 'terbang', label: 'Terbang' },
  ];

  const currentStepIndex = (() => {
    const s = currentStatus.toLowerCase();
    if (s === '-' || s.includes('baru') || s.includes('pending') || s.includes('pendaftaran')) return 0;
    if (s.includes('wawancara') || s.includes('seleksi')) return 1;
    if (s.includes('lulus seleksi') || s.includes('pelatihan')) return 2;
    if (s.includes('dokumen')) return 3;
    if (s.includes('terbang')) return 4;
    return 0;
  })();

  const statusColor = (() => {
    const s = currentStatus.toLowerCase();
    if (s.includes('lulus') || s.includes('pelatihan')) return 'bg-green-100 text-green-700';
    if (s.includes('dokumen')) return 'bg-red-100 text-red-700';
    if (s.includes('seleksi') || s.includes('wawancara')) return 'bg-orange-100 text-orange-700';
    if (s.includes('terbang')) return 'bg-purple-100 text-purple-700';
    if (s.includes('baru') || s.includes('pending')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  })();

  const essentials = (() => {
    const v = view?.merged || {};
    const name = String(participant.name || v.namaLengkap || '').trim();
    const email = String(v.email || participant.email || '').trim();
    const phone = String(v.noWhatsapp || participant.phone || '').trim();
    const noKtp = String(v.noKtp || participant.noKtp || '').trim();
    const program = String(participant.program || v.programMinat || '').trim();
    const hasFoto = Boolean(participant.fotoUrl);
    const hasCv = Boolean(participant.cvUrl);

    const items = [
      { label: 'Nama', ok: Boolean(name) },
      { label: 'Email', ok: Boolean(email) },
      { label: 'No WhatsApp', ok: Boolean(phone) },
      { label: 'No KTP', ok: Boolean(noKtp) },
      { label: 'Program', ok: Boolean(program) },
      { label: 'Foto', ok: hasFoto },
      { label: 'CV', ok: hasCv },
    ];

    const done = items.filter((i) => i.ok).length;
    const total = items.length;
    const percent = Math.round((done / total) * 100);
    const missing = items.filter((i) => !i.ok).map((i) => i.label);

    return { items, done, total, percent, missing };
  })();

  const parseLatLngLoose = (raw) => {
    if (raw === null || raw === undefined) return null;
    let text = String(raw).trim();
    if (!text) return null;
    if (text.includes('@') || text.includes('google.com') || text.includes('maps') || text.includes('q=') || text.includes('ll=')) {
      const at = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(text);
      if (at) {
        const lat = Number(at[1]);
        const lng = Number(at[2]);
        if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
      const d3d4d = /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/.exec(text);
      if (d3d4d) {
        const lat = Number(d3d4d[1]);
        const lng = Number(d3d4d[2]);
        if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
      const qp = /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?)(?:%2C|,|%20|%2F|\s)+(-?\d+(?:\.\d+)?)/.exec(text);
      if (qp) {
        const lat = Number(qp[1]);
        const lng = Number(qp[2]);
        if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }
    }
    try {
      text = decodeURIComponent(text);
    } catch {
      text = String(raw).trim();
    }
    const m = /(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/.exec(text);
    if (!m) return null;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (lat < -90 || lat > 90) return null;
    if (lng < -180 || lng > 180) return null;
    return { lat, lng };
  };

  const handleCariLokasi = async () => {
    const q = String(lokasiQuery || namaPerusahaan || '').trim();
    if (!q) {
      window.alert('Isi dulu nama perusahaan / lokasi untuk dicari.');
      return;
    }
    setLokasiSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Gagal mencari lokasi.');
      const json = await res.json();
      const rows = Array.isArray(json) ? json : [];
      const normalized = rows
        .map((r) => {
          const lat = Number(r?.lat);
          const lng = Number(r?.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          const label = String(r?.display_name || '').trim();
          return { id: String(r?.place_id || label || `${lat},${lng}`), label, lat, lng };
        })
        .filter(Boolean);
      setLokasiResults(normalized);
      if (normalized.length === 0) window.alert('Lokasi tidak ditemukan. Coba pakai kata kunci lain.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal mencari lokasi.';
      window.alert(message);
    } finally {
      setLokasiSearching(false);
    }
  };

  const handlePilihLokasi = (row) => {
    if (!row) return;
    const lat = Number(row.lat);
    const lng = Number(row.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    setKoordinatLokasi(`${lat},${lng}`);
    setLokasiMapsUrl(`https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`);
  };

  const updateDetails = async (patch) => {
    const current = parseDetails(participant.details) || {};
    const next = { ...current, ...patch };
    await actions.updateParticipant(participant.id, { details: JSON.stringify(next) });
  };

  const handleSaveTestimoni = async () => {
    setSavingKey('testimoni');
    try {
      const t = String(testimoniText || '').trim();
      await updateDetails({ testimoni: t });
      window.alert('Testimoni berhasil disimpan. Terima kasih!');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal menyimpan testimoni.';
      window.alert(message);
    } finally {
      setSavingKey('');
    }
  };

  const handleSaveLokasiKerja = async () => {
    setSavingKey('lokasiKerja');
    try {
      const perusahaan = String(namaPerusahaan || '').trim();
      if (!perusahaan) {
        window.alert('Nama perusahaan wajib diisi.');
        return;
      }
      const parsed = parseLatLngLoose(koordinatLokasi) || parseLatLngLoose(lokasiMapsUrl);
      if (!parsed) {
        window.alert('Lokasi belum valid. Pakai tombol Cari Lokasi, atau paste link share Google Maps.');
        return;
      }
      await updateDetails({
        namaPerusahaan: perusahaan,
        lokasiLat: parsed.lat,
        lokasiLng: parsed.lng,
        koordinatLokasi: `${parsed.lat},${parsed.lng}`,
        lokasiMapsUrl: String(lokasiMapsUrl || '').trim(),
      });
      window.alert('Lokasi kerja berhasil disimpan.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal menyimpan lokasi kerja.';
      window.alert(message);
    } finally {
      setSavingKey('');
    }
  };

  const handleSavePembayaran = async () => {
    setSavingKey('pembayaran');
    try {
      await updateDetails({
        pembayaranStatus: String(pembayaranStatus || '').trim(),
        pembayaranTanggal: String(pembayaranTanggal || '').trim(),
        pembayaranNominal: String(pembayaranNominal || '').trim(),
        pembayaranCatatan: String(pembayaranCatatan || '').trim(),
      });
      window.alert('Data pembayaran berhasil disimpan.');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal menyimpan pembayaran.';
      window.alert(message);
    } finally {
      setSavingKey('');
    }
  };

  const nextActions = (() => {
    const s = currentStatus.toLowerCase();
    if (s.includes('baru') || s.includes('pending') || s.includes('pendaftaran')) {
      return [
        'Pantau status di dashboard ini.',
        'Pastikan data kontak & berkas lengkap (Foto + CV).',
        'Tunggu admin menghubungi untuk tahap selanjutnya.',
      ];
    }
    if (s.includes('seleksi') || s.includes('wawancara')) {
      return [
        'Siapkan diri untuk seleksi/wawancara.',
        'Pastikan WA aktif agar mudah dihubungi.',
        'Lengkapi berkas bila masih kurang.',
      ];
    }
    if (s.includes('lulus seleksi') || s.includes('pelatihan')) {
      return [
        'Ikuti jadwal pelatihan yang diberikan admin.',
        'Pantau catatan/remarks dari admin.',
        'Pastikan dokumen pribadi siap jika diminta.',
      ];
    }
    if (s.includes('dokumen')) {
      return [
        'Siapkan dokumen yang diminta admin.',
        'Cek catatan (remarks) untuk detail dokumen.',
        'Hubungi admin bila ada yang kurang jelas.',
      ];
    }
    if (s.includes('terbang')) {
      return [
        'Konfirmasi jadwal keberangkatan.',
        'Pastikan semua dokumen perjalanan aman.',
        'Ikuti arahan admin untuk briefing terakhir.',
      ];
    }
    return [
      'Pantau status di dashboard ini.',
      'Pastikan data dan berkas lengkap.',
      'Hubungi admin bila butuh bantuan.',
    ];
  })();

  const handleUploadBerkas = async (key) => {
    const file =
      key === 'foto'
        ? fotoFile
        : key === 'cv'
          ? cvFile
          : key === 'sertifikatJlpt'
            ? jlptFile
            : key === 'sertifikatSsw'
              ? sswFile
              : null;
    if (!file) return;
    try {
      setUploadingKey(key);
      const fd = new FormData();
      fd.append(key, file);
      if (key === 'sertifikatJlpt') fd.append('sertifikatJlpt', 'Ya');
      if (key === 'sertifikatSsw') fd.append('sertifikatSsw', 'Ya');
      await actions.updateParticipant(participant.id, fd);
      if (key === 'foto') setFotoFile(null);
      if (key === 'cv') setCvFile(null);
      if (key === 'sertifikatJlpt') setJlptFile(null);
      if (key === 'sertifikatSsw') setSswFile(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Upload gagal.';
      window.alert(message);
    } finally {
      setUploadingKey('');
    }
  };

  const handleClearBerkas = async (key) => {
    const ok = window.confirm('Hapus berkas ini?');
    if (!ok) return;
    try {
      if (key === 'foto') {
        await actions.updateParticipant(participant.id, { fotoUrl: null });
        return;
      }
      if (key === 'cv') {
        await actions.updateParticipant(participant.id, { cvUrl: null });
        return;
      }
      if (key === 'sertifikatJlpt') {
        await actions.updateParticipant(participant.id, { sertifikatJlptUrl: null, sertifikatJlpt: 'Tidak' });
        return;
      }
      if (key === 'sertifikatSsw') {
        await actions.updateParticipant(participant.id, { sertifikatSswUrl: null, sertifikatSsw: 'Tidak' });
        return;
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal menghapus berkas.';
      window.alert(message);
    }
  };

  const navBtnClass = (isActive) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  const selectMenu = (key) => {
    setActiveMenu(key);
    setSidebarOpen(false);
  };

  const fileInputClass =
    'block w-full text-sm text-gray-700 file:mr-4 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-gray-900 truncate">Dashboard Siswa</div>
            <div className="text-xs text-gray-600 truncate">{displayName}</div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-gray-900/40"
              aria-label="Tutup menu"
            />
            <div className="absolute inset-y-0 left-0 w-[92%] max-w-sm bg-white shadow-xl">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-900">Menu Siswa</div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    {participant.fotoUrl ? (
                      <img
                        src={participant.fotoUrl}
                        alt={`Foto ${displayName}`}
                        className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate">{displayName}</div>
                      <div className="text-xs text-gray-600 truncate">{displayEmail}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                      {currentStatus}
                    </div>
                    <div className="text-xs text-gray-600 truncate">{currentProgram}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button type="button" onClick={() => selectMenu('dashboard')} className={navBtnClass(activeMenu === 'dashboard')}>
                    <LayoutDashboard className="w-5 h-5" />
                    Ringkasan
                  </button>
                  <button type="button" onClick={() => selectMenu('biodata')} className={navBtnClass(activeMenu === 'biodata')}>
                    <User className="w-5 h-5" />
                    Biodata
                  </button>
                  <button type="button" onClick={() => selectMenu('berkas')} className={navBtnClass(activeMenu === 'berkas')}>
                    <Upload className="w-5 h-5" />
                    Berkas
                  </button>
                  <button type="button" onClick={() => selectMenu('testimoni')} className={navBtnClass(activeMenu === 'testimoni')}>
                    <MessageCircle className="w-5 h-5" />
                    Testimoni
                  </button>
                  <button type="button" onClick={() => selectMenu('lokasiKerja')} className={navBtnClass(activeMenu === 'lokasiKerja')}>
                    <MapPin className="w-5 h-5" />
                    Lokasi Kerja
                  </button>
                  <button type="button" onClick={() => selectMenu('pembayaran')} className={navBtnClass(activeMenu === 'pembayaran')}>
                    <CreditCard className="w-5 h-5" />
                    Pembayaran
                  </button>
                  <Link to="/faq" onClick={() => setSidebarOpen(false)} className={navBtnClass(false)}>
                    <FileText className="w-5 h-5" />
                    FAQ
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {participant.fotoUrl ? (
                    <img
                      src={participant.fotoUrl}
                      alt={`Foto ${displayName}`}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{displayName}</div>
                    <div className="text-xs text-gray-600 truncate">{displayEmail}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                    {currentStatus}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{currentProgram}</div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Kelengkapan</span>
                    <span className="font-semibold text-gray-900">{essentials.percent}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-gray-900" style={{ width: `${essentials.percent}%` }} />
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <button type="button" onClick={() => selectMenu('dashboard')} className={navBtnClass(activeMenu === 'dashboard')}>
                  <LayoutDashboard className="w-5 h-5" />
                  Ringkasan
                </button>
                <button type="button" onClick={() => selectMenu('biodata')} className={navBtnClass(activeMenu === 'biodata')}>
                  <User className="w-5 h-5" />
                  Biodata
                </button>
                <button type="button" onClick={() => selectMenu('berkas')} className={navBtnClass(activeMenu === 'berkas')}>
                  <Upload className="w-5 h-5" />
                  Berkas
                </button>
                <button type="button" onClick={() => selectMenu('testimoni')} className={navBtnClass(activeMenu === 'testimoni')}>
                  <MessageCircle className="w-5 h-5" />
                  Testimoni
                </button>
                <button type="button" onClick={() => selectMenu('lokasiKerja')} className={navBtnClass(activeMenu === 'lokasiKerja')}>
                  <MapPin className="w-5 h-5" />
                  Lokasi Kerja
                </button>
                <button type="button" onClick={() => selectMenu('pembayaran')} className={navBtnClass(activeMenu === 'pembayaran')}>
                  <CreditCard className="w-5 h-5" />
                  Pembayaran
                </button>
                <Link to="/faq" className={navBtnClass(false)}>
                  <FileText className="w-5 h-5" />
                  FAQ
                </Link>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="hidden lg:flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold text-gray-900 truncate">Halo, {displayName}</h1>
              </div>
            </div>

            {activeMenu === 'dashboard' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-900">
                      Progress Pendaftaran
                    </div>
                    <div className="p-5">
                      <div className="hidden md:grid grid-cols-5 gap-3">
                        {steps.map((step, idx) => {
                          const done = idx < currentStepIndex;
                          const active = idx === currentStepIndex;
                          const circleClass = done
                            ? 'bg-green-600 text-white'
                            : active
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-200 text-gray-700';
                          return (
                            <div key={step.key} className="flex flex-col items-center text-center">
                              <div className="w-full flex items-center">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${circleClass}`}>
                                  {done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                {idx < steps.length - 1 && (
                                  <div className={`h-1 flex-1 mx-2 rounded-full ${idx < currentStepIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                                )}
                              </div>
                              <div className="mt-2 text-xs font-bold text-gray-800">{step.label}</div>
                              {active && <div className="text-[11px] text-gray-600">Tahap saat ini</div>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="md:hidden flex flex-col gap-3">
                        {steps.map((step, idx) => {
                          const done = idx < currentStepIndex;
                          const active = idx === currentStepIndex;
                          const icon = done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
                          return (
                            <div key={step.key} className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${done ? 'bg-green-600 text-white' : active ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {icon}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-bold text-gray-900">{step.label}</div>
                                {active && <div className="text-xs text-gray-600">Tahap saat ini</div>}
                              </div>
                              {done && <div className="text-xs font-bold text-green-700">Selesai</div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                      <div className="text-sm text-gray-600">Status</div>
                      <div className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {currentStatus}
                      </div>
                      <div className="mt-4 text-sm text-gray-600">Tanggal Daftar</div>
                      <div className="text-base font-extrabold text-gray-900 mt-1">{currentDate}</div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                      <div className="text-sm text-gray-600">Program</div>
                      <div className="text-base font-extrabold text-gray-900 mt-1">{currentProgram}</div>
                      {currentMatchingJob && (
                        <div className="text-xs text-gray-600 mt-2">
                          Matching Job: <span className="font-semibold text-gray-900">{currentMatchingJob}</span>
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>Kelengkapan</span>
                        <span className="font-bold text-gray-900">{essentials.percent}%</span>
                      </div>
                      <div className="mt-2 h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full bg-gray-900" style={{ width: `${essentials.percent}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-900">Langkah Selanjutnya</div>
                    <div className="p-5 space-y-3">
                      {nextActions.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 w-7 h-7 rounded-2xl bg-gray-900 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div className="text-sm text-gray-800">{t}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {remarks && (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 shadow-sm p-5">
                      <div className="flex items-center gap-2 text-blue-900 font-bold">
                        <MessageCircle className="w-4 h-4" />
                        Pesan Admin
                      </div>
                      <div className="text-sm text-blue-900 mt-2 whitespace-pre-wrap">{remarks}</div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-gray-900">Checklist Kelengkapan</div>
                      <div className="text-xs font-bold text-gray-900">{essentials.done}/{essentials.total}</div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {essentials.items.map((it) => (
                        <div key={it.label} className="flex items-center justify-between gap-3">
                          <div className="text-sm text-gray-800">{it.label}</div>
                          <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${it.ok ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {it.ok ? 'OK' : 'Belum'}
                          </div>
                        </div>
                      ))}
                    </div>
                    {essentials.missing.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600">Yang perlu dilengkapi:</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {essentials.missing.map((m) => (
                            <span key={m} className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'berkas' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="text-sm font-bold text-gray-900">Berkas</div>
                  <div className="text-sm text-gray-600 mt-1">Upload berkas yang diminta agar proses berjalan lebih cepat.</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">Foto</div>
                        <div className="text-xs text-gray-600 mt-1">JPG/PNG/WebP</div>
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${participant.fotoUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {participant.fotoUrl ? 'Terunggah' : 'Belum'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {participant.fotoUrl ? (
                        <div className="flex items-center gap-3">
                          <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={participant.fotoUrl} target="_blank" rel="noreferrer">
                            Lihat Foto
                          </a>
                          <button type="button" onClick={() => handleClearBerkas('foto')} className="text-sm font-semibold text-red-700 hover:text-red-800">
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Belum ada file.</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <input type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className={fileInputClass} />
                      <button
                        type="button"
                        disabled={!fotoFile || uploadingKey === 'foto'}
                        onClick={() => handleUploadBerkas('foto')}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                          !fotoFile || uploadingKey === 'foto'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingKey === 'foto' ? 'Mengunggah...' : 'Upload Foto'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">CV</div>
                        <div className="text-xs text-gray-600 mt-1">PDF</div>
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${participant.cvUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {participant.cvUrl ? 'Terunggah' : 'Belum'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {participant.cvUrl ? (
                        <div className="flex items-center gap-3">
                          <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={participant.cvUrl} target="_blank" rel="noreferrer">
                            Lihat CV
                          </a>
                          <button type="button" onClick={() => handleClearBerkas('cv')} className="text-sm font-semibold text-red-700 hover:text-red-800">
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Belum ada file.</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className={fileInputClass} />
                      <button
                        type="button"
                        disabled={!cvFile || uploadingKey === 'cv'}
                        onClick={() => handleUploadBerkas('cv')}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                          !cvFile || uploadingKey === 'cv'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingKey === 'cv' ? 'Mengunggah...' : 'Upload CV'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">Sertifikat JLPT/JFT</div>
                        <div className="text-xs text-gray-600 mt-1">PDF/JPG/PNG</div>
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${participant.sertifikatJlptUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {participant.sertifikatJlptUrl ? 'Terunggah' : 'Belum'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {participant.sertifikatJlptUrl ? (
                        <div className="flex items-center gap-3">
                          <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={participant.sertifikatJlptUrl} target="_blank" rel="noreferrer">
                            Lihat Sertifikat
                          </a>
                          <button type="button" onClick={() => handleClearBerkas('sertifikatJlpt')} className="text-sm font-semibold text-red-700 hover:text-red-800">
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Opsional bila belum punya.</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <input type="file" accept=".pdf,image/*" onChange={(e) => setJlptFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className={fileInputClass} />
                      <button
                        type="button"
                        disabled={!jlptFile || uploadingKey === 'sertifikatJlpt'}
                        onClick={() => handleUploadBerkas('sertifikatJlpt')}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                          !jlptFile || uploadingKey === 'sertifikatJlpt'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingKey === 'sertifikatJlpt' ? 'Mengunggah...' : 'Upload Sertifikat'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-gray-900">Sertifikat SSW</div>
                        <div className="text-xs text-gray-600 mt-1">PDF/JPG/PNG</div>
                      </div>
                      <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${participant.sertifikatSswUrl ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {participant.sertifikatSswUrl ? 'Terunggah' : 'Belum'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {participant.sertifikatSswUrl ? (
                        <div className="flex items-center gap-3">
                          <a className="text-sm font-semibold text-blue-700 hover:text-blue-900" href={participant.sertifikatSswUrl} target="_blank" rel="noreferrer">
                            Lihat Sertifikat
                          </a>
                          <button type="button" onClick={() => handleClearBerkas('sertifikatSsw')} className="text-sm font-semibold text-red-700 hover:text-red-800">
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Opsional bila belum punya.</div>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      <input type="file" accept=".pdf,image/*" onChange={(e) => setSswFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className={fileInputClass} />
                      <button
                        type="button"
                        disabled={!sswFile || uploadingKey === 'sertifikatSsw'}
                        onClick={() => handleUploadBerkas('sertifikatSsw')}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${
                          !sswFile || uploadingKey === 'sertifikatSsw'
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingKey === 'sertifikatSsw' ? 'Mengunggah...' : 'Upload Sertifikat'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'testimoni' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="text-sm font-bold text-gray-900">Tulis Testimoni</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Testimoni kamu akan tampil di halaman Alumni pada bagian Testimoni.
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800">Testimoni</label>
                    <textarea
                      value={testimoniText}
                      onChange={(e) => setTestimoniText(e.target.value)}
                      rows={6}
                      placeholder="Ceritakan pengalaman kamu selama proses hingga bekerja..."
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <div className="text-xs text-gray-500">
                      Nama yang tampil: <span className="font-semibold text-gray-900">{displayName}</span>
                    </div>
                    <button
                      type="button"
                      disabled={savingKey === 'testimoni'}
                      onClick={handleSaveTestimoni}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${
                        savingKey === 'testimoni' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {savingKey === 'testimoni' ? 'Menyimpan...' : 'Simpan Testimoni'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'lokasiKerja' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="text-sm font-bold text-gray-900">Lokasi Kerja</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Biar gampang, cukup cari lokasi otomatis atau paste link share Google Maps. Koordinat akan terisi sendiri.
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Nama Perusahaan</label>
                      <input
                        type="text"
                        value={namaPerusahaan}
                        onChange={(e) => setNamaPerusahaan(e.target.value)}
                        placeholder="Contoh: ABC Construction Co., Ltd."
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Link Share Google Maps (opsional)</label>
                      <input
                        type="text"
                        value={lokasiMapsUrl}
                        onChange={(e) => setLokasiMapsUrl(e.target.value)}
                        placeholder="Paste link dari Google Maps (Share)"
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                      {parseLatLngLoose(lokasiMapsUrl) && (
                        <a
                          className="mt-2 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                          href={lokasiMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buka Link
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <div className="text-sm font-bold text-gray-900">Cari Lokasi Otomatis</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={lokasiQuery}
                        onChange={(e) => setLokasiQuery(e.target.value)}
                        placeholder="Contoh: nama perusahaan + kota (mis. Osaka)"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                      <button
                        type="button"
                        disabled={lokasiSearching}
                        onClick={handleCariLokasi}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold ${
                          lokasiSearching ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {lokasiSearching ? 'Mencari...' : 'Cari Lokasi'}
                      </button>
                    </div>
                    {lokasiResults.length > 0 && (
                      <div className="space-y-2">
                        {lokasiResults.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => handlePilihLokasi(r)}
                            className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50"
                          >
                            <div className="text-sm font-semibold text-gray-900">{r.label || `${r.lat},${r.lng}`}</div>
                            <div className="text-xs text-gray-600 mt-1">{r.lat}, {r.lng}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Koordinat (otomatis)</label>
                      <input
                        type="text"
                        value={koordinatLokasi}
                        onChange={(e) => setKoordinatLokasi(e.target.value)}
                        placeholder="Terisi otomatis setelah pilih lokasi"
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                      {parseLatLngLoose(koordinatLokasi) && (
                        <a
                          className="mt-2 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                          href={`https://www.google.com/maps?q=${encodeURIComponent(String(koordinatLokasi).trim())}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Buka di Google Maps
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      Tips: kalau hasil pencarian kurang tepat, tambahkan kota/prefektur di kolom pencarian (mis. “Tokyo”, “Osaka”).
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      disabled={savingKey === 'lokasiKerja'}
                      onClick={handleSaveLokasiKerja}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${
                        savingKey === 'lokasiKerja' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {savingKey === 'lokasiKerja' ? 'Menyimpan...' : 'Simpan Lokasi'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'pembayaran' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="text-sm font-bold text-gray-900">Pembayaran</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Isi status dan catatan pembayaran kamu. Jika perlu bukti transfer, kirimkan via admin.
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Status</label>
                      <select
                        value={pembayaranStatus}
                        onChange={(e) => setPembayaranStatus(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      >
                        <option value="">Pilih</option>
                        <option value="Belum bayar">Belum bayar</option>
                        <option value="Sudah bayar">Sudah bayar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Tanggal</label>
                      <input
                        type="date"
                        value={pembayaranTanggal}
                        onChange={(e) => setPembayaranTanggal(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Nominal (opsional)</label>
                      <input
                        type="text"
                        value={pembayaranNominal}
                        onChange={(e) => setPembayaranNominal(e.target.value)}
                        placeholder="Contoh: 1500000"
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800">Catatan (opsional)</label>
                      <input
                        type="text"
                        value={pembayaranCatatan}
                        onChange={(e) => setPembayaranCatatan(e.target.value)}
                        placeholder="Contoh: DP tahap 1"
                        className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      disabled={savingKey === 'pembayaran'}
                      onClick={handleSavePembayaran}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${
                        savingKey === 'pembayaran' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {savingKey === 'pembayaran' ? 'Menyimpan...' : 'Simpan Pembayaran'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeMenu === 'biodata' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                  <div className="text-sm font-bold text-gray-900">Biodata</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Data ini bersifat tampilan. Jika ada yang tidak sesuai, hubungi admin.
                  </div>
                </div>

                {view?.sections.map((section, idx) => (
                  <details key={section.title} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden" open={idx === 0}>
                    <summary className="cursor-pointer list-none select-none px-5 py-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-900 flex items-center justify-between">
                      <span>{section.title}</span>
                      <span className="text-xs text-gray-600">Klik untuk buka/tutup</span>
                    </summary>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {section.fields.map(([key, label]) => (
                          <div key={key} className="flex items-start justify-between gap-4">
                            <div className="text-sm text-gray-600">{label}</div>
                            <div className="text-sm text-gray-900 font-semibold text-right whitespace-pre-wrap max-w-[60%]">
                              {view.getValue(key)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SiswaDashboard;
