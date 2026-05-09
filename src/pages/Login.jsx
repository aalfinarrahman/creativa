import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { dataService } from '../services/dataService';

const LOGIN_BG_CACHE_KEY = 'settings.loginBgUrl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginBgUrl, setLoginBgUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    const fetchSettings = async () => {
      try {
        const rows = await dataService.getAllStrict(dataService.KEYS.SETTINGS);
        if (!alive) return;
        const nextUrl =
          Array.isArray(rows)
            ? (rows.find((row) => typeof row?.loginBgUrl === 'string' && row.loginBgUrl.trim())?.loginBgUrl || '').trim()
            : '';
        localStorage.setItem(LOGIN_BG_CACHE_KEY, nextUrl);
        setLoginBgUrl(nextUrl || null);
      } catch {
        if (!alive) return;
        const cached = localStorage.getItem(LOGIN_BG_CACHE_KEY) || '';
        setLoginBgUrl(cached.trim() ? cached.trim() : null);
      }
    };
    fetchSettings();
    return () => { alive = false; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);
    try {
      const normalizedEmail = email.trim();
      const normalizedPassword = password.trim();

      const result = await dataService.login(normalizedEmail, normalizedPassword);

      if (result?.role === 'admin') {
        if (!result?.user?.id) throw new Error('Login gagal');
        localStorage.setItem('authRole', 'admin');
        localStorage.setItem('adminId', String(result.user.id));
        localStorage.setItem('adminEmail', result.user.email || normalizedEmail);
        localStorage.setItem('adminName', result.user.name || '');
        navigate('/admin/dashboard');
        return;
      }

      if (result?.role !== 'siswa' || !result?.user?.id) throw new Error('Login gagal');
      localStorage.setItem('authRole', 'siswa');
      localStorage.setItem('siswaId', String(result.user.id));
      localStorage.setItem('siswaEmail', result.user.email || normalizedEmail);
      localStorage.setItem('siswaName', result.user.name || '');
      navigate('/siswa/dashboard');
    } catch (err) {
      const message = String(err?.message || 'Login gagal');
      const prettyMessage =
        message.includes('Password belum diatur admin') ? 'Password belum diatur oleh admin.' :
        message.includes('Kolom password_hash') ? 'Sistem login belum aktif (database belum diupdate).' :
        message.includes('Tabel admins belum ada') ? 'Akun admin belum aktif (database belum diupdate).' :
        message.includes('Email atau password salah') ? 'Email atau password salah.' :
        message.includes('Email dan password wajib diisi') ? 'Email dan password wajib diisi.' :
        message;
      alert(prettyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={
        loginBgUrl
          ? { backgroundImage: `url(${loginBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundImage: 'linear-gradient(to bottom, rgb(248 250 252), rgb(255 255 255), rgb(241 245 249))' }
      }
    >
      <div className={`absolute inset-0 ${loginBgUrl ? 'bg-black/45' : ''}`}></div>
      <div className="w-full max-w-md relative">
        <div className="bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-3xl bg-slate-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Creativa Bridging International" className="h-20 w-20 object-contain" />
              </div>
              <div className="mt-5 text-2xl font-extrabold text-gray-900">Creativa Bridging International</div>
              <div className="mt-1 text-sm text-gray-600">Silakan masuk untuk melanjutkan</div>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-semibold text-base"
              >
                {submitting ? 'Memproses...' : 'Masuk'}
              </button>

              <div className="text-sm text-gray-500 text-center leading-relaxed">
                Gunakan email terdaftar. Sistem akan otomatis mengarahkan sesuai role.
              </div>
            </form>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Creativa Bridging International
        </div>
      </div>
    </div>
  );
};

export default Login;
