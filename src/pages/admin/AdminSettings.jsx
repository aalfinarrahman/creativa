import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Save, User, Lock, Bell, Globe, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { dataService } from '../../services/dataService';

const LOGIN_BG_CACHE_KEY = 'settings.loginBgUrl';
const HOME_HERO_BG_CACHE_KEY = 'settings.homeHeroBgUrl';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [loginBgUrl, setLoginBgUrl] = useState(null);
  const [loginBgFile, setLoginBgFile] = useState(null);
  const [homeHeroBgUrl, setHomeHeroBgUrl] = useState(null);
  const [homeHeroBgFile, setHomeHeroBgFile] = useState(null);
  const loginBgInputRef = useRef(null);
  const homeHeroBgInputRef = useRef(null);
  
  // Profile State
  const [profile, setProfile] = useState(() => {
    const defaultProfile = { name: 'Admin Creativa', email: 'admin@creativabridging.com' };
    const savedProfile = localStorage.getItem('adminProfile');
    if (!savedProfile) return defaultProfile;
    try {
      return JSON.parse(savedProfile);
    } catch {
      return defaultProfile;
    }
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSaveProfile = () => {
    localStorage.setItem('adminProfile', JSON.stringify(profile));
    alert('Profil berhasil disimpan!');
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
        alert('Mohon lengkapi semua field password.');
        return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    if (passwords.new.length < 6) {
        alert('Password minimal 6 karakter');
        return;
    }
    // Simulate password update
    alert('Password berhasil diperbarui!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: 'Profil Admin', icon: <User className="w-5 h-5" /> },
    { id: 'security', label: 'Keamanan', icon: <Lock className="w-5 h-5" /> },
    { id: 'notification', label: 'Notifikasi', icon: <Bell className="w-5 h-5" /> },
    { id: 'site', label: 'Website', icon: <Globe className="w-5 h-5" /> },
  ];

  const loginBgPreview = useMemo(() => {
    if (!loginBgFile) return null;
    return URL.createObjectURL(loginBgFile);
  }, [loginBgFile]);

  const homeHeroBgPreview = useMemo(() => {
    if (!homeHeroBgFile) return null;
    return URL.createObjectURL(homeHeroBgFile);
  }, [homeHeroBgFile]);

  useEffect(() => {
    return () => {
      if (loginBgPreview) URL.revokeObjectURL(loginBgPreview);
      if (homeHeroBgPreview) URL.revokeObjectURL(homeHeroBgPreview);
    };
  }, [loginBgPreview, homeHeroBgPreview]);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const rows = await dataService.getAllStrict(dataService.KEYS.SETTINGS);
      const pick = (field) => {
        if (!Array.isArray(rows)) return '';
        for (const row of rows) {
          const value = row?.[field];
          if (typeof value === 'string' && value.trim()) return value.trim();
        }
        return '';
      };
      const nextLoginBgUrl = pick('loginBgUrl');
      const nextHomeHeroBgUrl = pick('homeHeroBgUrl');
      localStorage.setItem(LOGIN_BG_CACHE_KEY, nextLoginBgUrl);
      localStorage.setItem(HOME_HERO_BG_CACHE_KEY, nextHomeHeroBgUrl);
      setLoginBgUrl(nextLoginBgUrl || null);
      setHomeHeroBgUrl(nextHomeHeroBgUrl || null);
    } catch (err) {
      setSettingsError(String(err?.message || 'Gagal memuat pengaturan.'));
      const cachedLoginBgUrl = localStorage.getItem(LOGIN_BG_CACHE_KEY) || '';
      const cachedHomeHeroBgUrl = localStorage.getItem(HOME_HERO_BG_CACHE_KEY) || '';
      setLoginBgUrl(cachedLoginBgUrl.trim() ? cachedLoginBgUrl.trim() : null);
      setHomeHeroBgUrl(cachedHomeHeroBgUrl.trim() ? cachedHomeHeroBgUrl.trim() : null);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUploadLoginBg = async () => {
    if (!loginBgFile) {
      loginBgInputRef.current?.click();
      return;
    }
    setSettingsLoading(true);
    try {
      const formData = new FormData();
      formData.append('loginBg', loginBgFile);
      const created = await dataService.add(dataService.KEYS.SETTINGS, formData);
      const nextUrl = typeof created?.loginBgUrl === 'string' ? created.loginBgUrl.trim() : '';
      if (nextUrl) {
        localStorage.setItem(LOGIN_BG_CACHE_KEY, nextUrl);
        setLoginBgUrl(nextUrl || null);
        setLoginBgFile(null);
      } else {
        await fetchSettings();
        setLoginBgFile(null);
      }
      alert('Background login berhasil diupload.');
    } catch (err) {
      alert(String(err?.message || 'Gagal upload background.'));
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleClearLoginBg = async () => {
    setSettingsLoading(true);
    try {
      await dataService.add(dataService.KEYS.SETTINGS, { loginBgUrl: '' });
      localStorage.setItem(LOGIN_BG_CACHE_KEY, '');
      setLoginBgUrl(null);
      setLoginBgFile(null);
      alert('Background login dihapus.');
    } catch (err) {
      alert(String(err?.message || 'Gagal menghapus background.'));
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUploadHomeHeroBg = async () => {
    if (!homeHeroBgFile) {
      homeHeroBgInputRef.current?.click();
      return;
    }
    setSettingsLoading(true);
    try {
      const formData = new FormData();
      formData.append('homeHeroBg', homeHeroBgFile);
      const created = await dataService.add(dataService.KEYS.SETTINGS, formData);
      const nextUrl = typeof created?.homeHeroBgUrl === 'string' ? created.homeHeroBgUrl.trim() : '';
      if (nextUrl) {
        localStorage.setItem(HOME_HERO_BG_CACHE_KEY, nextUrl);
        setHomeHeroBgUrl(nextUrl || null);
        setHomeHeroBgFile(null);
      } else {
        await fetchSettings();
        setHomeHeroBgFile(null);
      }
      alert('Background beranda berhasil diupload.');
    } catch (err) {
      alert(String(err?.message || 'Gagal upload background.'));
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleClearHomeHeroBg = async () => {
    setSettingsLoading(true);
    try {
      await dataService.add(dataService.KEYS.SETTINGS, { homeHeroBgUrl: '' });
      localStorage.setItem(HOME_HERO_BG_CACHE_KEY, '');
      setHomeHeroBgUrl(null);
      setHomeHeroBgFile(null);
      alert('Background beranda dihapus.');
    } catch (err) {
      alert(String(err?.message || 'Gagal menghapus background.'));
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Settings */}
        <div className="w-full lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2 h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Settings */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-6">Edit Profil</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-6">Ubah Password</h3>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                  <input 
                    type="password" 
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                    onClick={handleUpdatePassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mb-4 text-gray-300" />
                <p>Pengaturan notifikasi belum tersedia.</p>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-4 mb-6">Pengaturan Website</h3>

              {settingsError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {settingsError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Background Beranda (Hero)
                    </div>
                    <div className="text-xs text-gray-500">
                      {settingsLoading ? 'Memuat...' : (homeHeroBgUrl ? 'Tersimpan' : 'Belum tersimpan')}
                    </div>
                  </div>

                  <div className="p-4">
                    <div
                      className="h-48 rounded-xl border border-gray-200 bg-white overflow-hidden relative"
                      style={
                        (homeHeroBgPreview || homeHeroBgUrl)
                          ? {
                              backgroundImage: `url(${homeHeroBgPreview || homeHeroBgUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : undefined
                      }
                    >
                      {!(homeHeroBgPreview || homeHeroBgUrl) && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          Belum ada background
                        </div>
                      )}
                      {(homeHeroBgPreview || homeHeroBgUrl) && (
                        <div className="absolute inset-0 bg-black/20"></div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setHomeHeroBgFile(e.target.files?.[0] || null)}
                        ref={homeHeroBgInputRef}
                        className="w-full text-sm"
                      />
                      {homeHeroBgFile && (
                        <div className="text-xs text-gray-600">
                          File dipilih: <span className="font-medium">{homeHeroBgFile.name}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={handleUploadHomeHeroBg}
                          disabled={settingsLoading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={handleClearHomeHeroBg}
                          disabled={settingsLoading || (!homeHeroBgUrl && !homeHeroBgPreview)}
                          className="bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 leading-relaxed">
                        Rekomendasi: foto landscape (mis. 1920×1080). Format: JPG/PNG/WebP.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Background Login
                    </div>
                    <div className="text-xs text-gray-500">
                      {settingsLoading ? 'Memuat...' : (loginBgUrl ? 'Tersimpan' : 'Belum tersimpan')}
                    </div>
                  </div>

                  <div className="p-4">
                    <div
                      className="h-48 rounded-xl border border-gray-200 bg-white overflow-hidden relative"
                      style={
                        (loginBgPreview || loginBgUrl)
                          ? {
                              backgroundImage: `url(${loginBgPreview || loginBgUrl})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }
                          : undefined
                      }
                    >
                      {!(loginBgPreview || loginBgUrl) && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          Belum ada background
                        </div>
                      )}
                      {(loginBgPreview || loginBgUrl) && (
                        <div className="absolute inset-0 bg-black/20"></div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLoginBgFile(e.target.files?.[0] || null)}
                        ref={loginBgInputRef}
                        className="w-full text-sm"
                      />
                      {loginBgFile && (
                        <div className="text-xs text-gray-600">
                          File dipilih: <span className="font-medium">{loginBgFile.name}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={handleUploadLoginBg}
                          disabled={settingsLoading}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={handleClearLoginBg}
                          disabled={settingsLoading || (!loginBgUrl && !loginBgPreview)}
                          className="bg-white hover:bg-gray-50 disabled:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>

                      <div className="text-xs text-gray-500 leading-relaxed">
                        Rekomendasi: foto landscape (mis. 1920×1080). Format: JPG/PNG/WebP.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
