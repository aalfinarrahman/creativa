import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterLayout from './RegisterLayout';
import { useData } from '../../context/dataContext';

const RegisterForm = () => {
  const { actions } = useData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noKtp: '',
    noWhatsapp: '',
    instagram: '',
    usia: '',
    pendidikan: '',
    jurusan: '',
    kotaDomisili: '',
    tinggiBadan: '',
    beratBadan: '',
    statusPekerjaan: '',
    pengalamanKerjaIndonesia: 'Tidak',
    posisiPengalamanKerja: '',
    statusPernikahan: '',
    kondisiMata: '',
    besarMinus: '',
    butaWarna: 'Tidak',
    bertato: 'Tidak',
    bertindik: 'Tidak',
    patahTulang: 'Tidak',
    kondisiTulang: 'Normal',
    skoliosis: 'Tidak',
    cacatFisik: 'Tidak',
    penyakitBerat: 'Tidak',
    penyakitMenular: 'Tidak',
    sertifikatJlpt: 'Tidak',
    sertifikatSsw: 'Tidak',
    bidangSsw: '',
    programMinat: '',
    matchingJob: '',
    matchingJobLainnya: '',
    kemampuanBahasa: 'Belum bisa',
    rencanaKeJepang: 'Kerja',
    relasiDiJepang: 'Tidak ada',
    pengalamanLuarNegeri: 'Tidak',
    pengalamanIlegal: 'Tidak',
    lokasiTinggal: '',
    foto: null,
    cv: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => {
      const nextValue = type === 'file' ? files[0] : value;
      if (name === 'programMinat' && nextValue !== 'Matching Job') {
        return {
          ...prev,
          [name]: nextValue,
          matchingJob: '',
          matchingJobLainnya: ''
        };
      }
      return {
        ...prev,
        [name]: nextValue
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const details = { ...formData };
      delete details.foto;
      delete details.cv;

      if (formData.programMinat === 'Matching Job') {
        const normalizedMatchingJob =
          formData.matchingJob === 'Lainnya' ? (formData.matchingJobLainnya || '') : formData.matchingJob;
        details.matchingJob = normalizedMatchingJob;
      } else {
        details.matchingJob = '';
        details.matchingJobLainnya = '';
      }

      const payload = new FormData();
      const dbData = {
        ...details,
        name: formData.namaLengkap,
        program: formData.programMinat || 'Umum',
        email: formData.email,
        phone: formData.noWhatsapp,
        status: 'Baru',
        date: new Date().toISOString().split('T')[0],
        details: JSON.stringify(details)
      };

      Object.entries(dbData).forEach(([key, value]) => {
        payload.append(key, value ?? '');
      });

      if (formData.foto) payload.append('foto', formData.foto);
      if (formData.cv) payload.append('cv', formData.cv);

      await actions.addParticipant(payload);
      alert('Pendaftaran berhasil dikirim! Data Anda telah tersimpan.');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    }
  };

  const sectionClass = "bg-white p-6 md:p-7 rounded-2xl border border-gray-100 shadow-sm";
  const sectionTitleClass = "text-lg md:text-xl font-bold text-gray-900 mb-5";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  const selectClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <RegisterLayout title="Formulir Pendaftaran">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        
        {/* Identitas Diri */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Identitas Diri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Nama Lengkap *</label>
              <input type="text" name="namaLengkap" required value={formData.namaLengkap} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Email Aktif *</label>
              <input type="email" name="email" required value={formData.email} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>No KTP *</label>
              <input type="text" name="noKtp" required value={formData.noKtp} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Nomor WhatsApp *</label>
              <input type="tel" name="noWhatsapp" required value={formData.noWhatsapp} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Akun Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Usia Saat ini *</label>
              <input type="number" name="usia" required value={formData.usia} className={inputClass} onChange={handleChange} />
            </div>
             <div className="md:col-span-2">
              <label className={labelClass}>Kota Domisili *</label>
              <input type="text" name="kotaDomisili" required value={formData.kotaDomisili} className={inputClass} onChange={handleChange} />
            </div>
             <div className="md:col-span-2">
              <label className={labelClass}>Lokasi Tinggal Saat ini *</label>
              <select name="lokasiTinggal" required value={formData.lokasiTinggal} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Lokasi</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Jepang">Jepang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pendidikan & Pekerjaan */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Pendidikan & Pekerjaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Pendidikan Terakhir *</label>
              <select name="pendidikan" required value={formData.pendidikan} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Pendidikan</option>
                <option value="Tidak Sekolah">Tidak Sekolah</option>
                <option value="SD">SD / Sederajat</option>
                <option value="SMP">SMP / Sederajat</option>
                <option value="SMA">SMA / SMK / Sederajat</option>
                <option value="Paket C">Paket C</option>
                <option value="D1/2/3">D1 / D2 / D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Jurusan Terakhir</label>
              <input type="text" name="jurusan" value={formData.jurusan} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Status Pekerjaan Saat ini *</label>
              <select name="statusPekerjaan" required value={formData.statusPekerjaan} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Status</option>
                <option value="Pelajar/Mahasiswa">Pelajar / Mahasiswa / Belum Lulus</option>
                <option value="Baru Lulus">Baru Lulus Sekolah / Kuliah</option>
                <option value="Karyawan">Karyawan (Bekerja)</option>
                <option value="Wiraswasta">Wiraswasta (Usaha Sendiri)</option>
                <option value="Tidak Bekerja">Tidak Bekerja</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Ada Pengalaman Kerja di Indonesia? *</label>
               <select name="pengalamanKerjaIndonesia" required value={formData.pengalamanKerjaIndonesia} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             {formData.pengalamanKerjaIndonesia === 'Ya' && (
              <div className="md:col-span-2">
                <label className={labelClass}>Pengalaman Kerja (Posisi / Jabatan)</label>
                <input type="text" name="posisiPengalamanKerja" value={formData.posisiPengalamanKerja} className={inputClass} onChange={handleChange} placeholder="Contoh: Staff Gudang, Kasir, dll" />
              </div>
            )}
          </div>
        </div>

        {/* Kondisi Fisik & Kesehatan */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Kondisi Fisik & Kesehatan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tinggi Badan (cm) *</label>
              <input type="number" name="tinggiBadan" required value={formData.tinggiBadan} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Berat Badan (kg) *</label>
              <input type="number" name="beratBadan" required value={formData.beratBadan} className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Status Pernikahan *</label>
              <select name="statusPernikahan" required value={formData.statusPernikahan} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Status</option>
                <option value="Single">Single (Belum Menikah)</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai">Cerai (Pernah Menikah)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Kondisi Mata *</label>
              <select name="kondisiMata" required value={formData.kondisiMata} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Kondisi</option>
                <option value="Normal">Normal</option>
                <option value="Minus">Minus</option>
                <option value="Plus">Plus</option>
                <option value="Silinder">Silinder</option>
                <option value="Rabun">Rabun</option>
              </select>
            </div>
             {(formData.kondisiMata === 'Minus' || formData.kondisiMata === 'Plus' || formData.kondisiMata === 'Silinder') && (
              <div>
                <label className={labelClass}>Besar Minus (Optional)</label>
                <input type="text" name="besarMinus" value={formData.besarMinus} className={inputClass} onChange={handleChange} placeholder="Contoh: -1.5 kanan, -2 kiri" />
              </div>
            )}
             <div>
              <label className={labelClass}>Buta Warna? *</label>
              <select name="butaWarna" required value={formData.butaWarna} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya (Total / Parsial)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Bertato? *</label>
              <select name="bertato" required value={formData.bertato} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Bertindik (Khusus Laki-laki)? *</label>
              <select name="bertindik" required value={formData.bertindik} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Pernah Patah Tulang? *</label>
              <select name="patahTulang" required value={formData.patahTulang} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Kondisi Tulang *</label>
              <select name="kondisiTulang" required value={formData.kondisiTulang} className={selectClass} onChange={handleChange}>
                <option value="Normal">Normal</option>
                <option value="Kaki O/X">Tulang Kaki O/X</option>
                <option value="Skoliosis">Tulang Belakang Skoliosis</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Memiliki Skoliosis? *</label>
              <select name="skoliosis" required value={formData.skoliosis} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Ada Cacat Fisik? *</label>
              <select name="cacatFisik" required value={formData.cacatFisik} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Penyakit Asma / TBC / Hepatitis? *</label>
              <select name="penyakitBerat" required value={formData.penyakitBerat} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Penyakit Menular Lainnya? *</label>
              <select name="penyakitMenular" required value={formData.penyakitMenular} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kemampuan & Minat */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Kemampuan & Minat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Memiliki Sertifikat JLPT / JFT? *</label>
              <select name="sertifikatJlpt" required value={formData.sertifikatJlpt} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Memiliki Sertifikat SSW? *</label>
              <select name="sertifikatSsw" required value={formData.sertifikatSsw} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ya">Ya</option>
              </select>
            </div>
             {formData.sertifikatSsw === 'Ya' && (
              <div className="md:col-span-2">
                <label className={labelClass}>Bidang SSW</label>
                <input type="text" name="bidangSsw" value={formData.bidangSsw} className={inputClass} onChange={handleChange} />
              </div>
            )}
            <div>
              <label className={labelClass}>Program yang Diminati *</label>
              <select name="programMinat" required value={formData.programMinat} className={selectClass} onChange={handleChange}>
                <option value="">Pilih Program</option>
                <option value="Kelas Intensif">Kelas Intensif</option>
                <option value="Kelas Lanjutan">Kelas Lanjutan</option>
                <option value="Dana Talangan">Dana Talangan</option>
                <option value="Matching Job">Matching Job</option>
              </select>
            </div>
            {formData.programMinat === 'Matching Job' && (
              <>
                <div>
                  <label className={labelClass}>Matching Job *</label>
                  <select name="matchingJob" required value={formData.matchingJob} className={selectClass} onChange={handleChange}>
                    <option value="">Pilih Matching Job</option>
                    <option value="Kaigo">Kaigo</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restoran">Restoran</option>
                    <option value="Manufaktur/Factory">Manufaktur/Factory</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                {formData.matchingJob === 'Lainnya' && (
                  <div>
                    <label className={labelClass}>Matching Job Lainnya *</label>
                    <input
                      type="text"
                      name="matchingJobLainnya"
                      required
                      value={formData.matchingJobLainnya}
                      className={inputClass}
                      onChange={handleChange}
                      placeholder="Tulis matching job yang kamu inginkan"
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <label className={labelClass}>Kemampuan Bahasa Jepang *</label>
              <select name="kemampuanBahasa" required value={formData.kemampuanBahasa} className={selectClass} onChange={handleChange}>
                <option value="Belum bisa">Belum bisa sama sekali</option>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Rencana Ke Jepang *</label>
              <select name="rencanaKeJepang" required value={formData.rencanaKeJepang} className={selectClass} onChange={handleChange}>
                <option value="Kerja">Kerja</option>
                <option value="Sekolah">Sekolah</option>
                <option value="Kerja Sambil Sekolah">Kerja Sambil Sekolah</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Relasi di Jepang *</label>
              <select name="relasiDiJepang" required value={formData.relasiDiJepang} className={selectClass} onChange={handleChange}>
                <option value="Tidak ada">Tidak ada</option>
                <option value="Teman">Teman</option>
                <option value="Saudara">Saudara</option>
                <option value="Keluarga">Keluarga</option>
              </select>
            </div>
             <div>
              <label className={labelClass}>Pengalaman Luar Negeri *</label>
              <select name="pengalamanLuarNegeri" required value={formData.pengalamanLuarNegeri} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ada">Ada</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Pengalaman Ilegal / Deportasi? *</label>
              <select name="pengalamanIlegal" required value={formData.pengalamanIlegal} className={selectClass} onChange={handleChange}>
                <option value="Tidak">Tidak</option>
                <option value="Ada">Ada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Dokumen */}
        <div className={sectionClass}>
          <h3 className={sectionTitleClass}>Upload Dokumen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Upload Foto (3x4 Background Merah) *</label>
              <input type="file" name="foto" required accept="image/*" className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleChange} />
              <p className="text-xs text-gray-500 mt-1">Maks 10 MB.</p>
            </div>
            <div>
              <label className={labelClass}>Upload CV *</label>
              <input type="file" name="cv" required accept=".pdf,.doc,.docx" className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={handleChange} />
              <p className="text-xs text-gray-500 mt-1">Maks 10 MB.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button type="submit" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Kirim Pendaftaran
          </button>
          <p className="mt-4 text-sm text-gray-500">
            Butuh bantuan? Hubungi Info Pendaftaran: <span className="font-bold text-gray-700">08152222672</span>
          </p>
        </div>
      </form>
    </RegisterLayout>
  );
};

export default RegisterForm;
