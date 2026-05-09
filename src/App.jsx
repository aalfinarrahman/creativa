import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/about/Profile';
import VisionMission from './pages/about/VisionMission';
import Legality from './pages/about/Legality';
import Team from './pages/about/Team';
import Facilities from './pages/about/Facilities';
import JapanProgram from './pages/JapanProgram';
import ProgramDetail from './pages/ProgramDetail';
import Process from './pages/Process';
import Registration from './pages/process/Registration';
import Selection from './pages/process/Selection';
import Training from './pages/process/Training';
import Interview from './pages/process/Interview';
import Documents from './pages/process/Documents';
import Departure from './pages/process/Departure';
import Gallery from './pages/Gallery';
import Articles from './pages/Articles';
import FAQ from './pages/FAQ';
import RegisterForm from './pages/register/RegisterForm';
import Login from './pages/Login';
import SiswaDashboard from './pages/SiswaDashboard';
import NotFound from './pages/NotFound';

// Alumni Imports
import AlumniLayout from './pages/alumni/AlumniLayout';
import Testimonials from './pages/alumni/Testimonials';
import SuccessStories from './pages/alumni/SuccessStories';
import JobLocations from './pages/alumni/JobLocations';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminParticipants from './pages/admin/AdminParticipants';
import AdminStatus from './pages/admin/AdminStatus';
import AdminPrograms from './pages/admin/AdminPrograms';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminGallery from './pages/admin/AdminGallery';
import AdminArticles from './pages/admin/AdminArticles';
import AdminTeam from './pages/admin/AdminTeam';
import AdminBroadcast from './pages/admin/AdminBroadcast';
import AdminExport from './pages/admin/AdminExport';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tentang-kami" element={<About />} />
          <Route path="tentang/profil" element={<Profile />} />
          <Route path="tentang/visi-misi" element={<VisionMission />} />
          <Route path="tentang/legalitas" element={<Legality />} />
          <Route path="tentang/tim-kami" element={<Team />} />
          <Route path="tentang/fasilitas" element={<Facilities />} />
          
          <Route path="program-jepang" element={<JapanProgram />} />
          <Route path="program-jepang/:id" element={<ProgramDetail />} />
          
          <Route path="proses-ke-jepang" element={<Process />} />
          <Route path="proses/pendaftaran" element={<Registration />} />
          <Route path="proses/seleksi" element={<Selection />} />
          <Route path="proses/pelatihan" element={<Training />} />
          <Route path="proses/interview" element={<Interview />} />
          <Route path="proses/dokumen" element={<Documents />} />
          <Route path="proses/keberangkatan" element={<Departure />} />

          <Route path="alumni" element={<AlumniLayout />}>
            <Route index element={<Testimonials />} />
            <Route path="testimoni" element={<Testimonials />} />
            <Route path="kisah-sukses" element={<SuccessStories />} />
            <Route path="lokasi-kerja" element={<JobLocations />} />
          </Route>

          <Route path="galeri" element={<Gallery />} />
          <Route path="lowker" element={<Articles />} />
          <Route path="artikel" element={<Navigate to="/lowker" replace />} />
          <Route path="faq" element={<FAQ />} />
          
          <Route path="daftar" element={<RegisterForm />} />
          <Route path="daftar/form-pendaftaran" element={<Navigate to="/daftar" replace />} />
          <Route path="daftar/persyaratan" element={<Navigate to="/daftar" replace />} />
          <Route path="daftar/panduan-daftar" element={<Navigate to="/daftar" replace />} />

          <Route path="login" element={<Login />} />
          <Route path="siswa/dashboard" element={<SiswaDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="peserta" element={<AdminParticipants />} />
          <Route path="status-peserta" element={<AdminStatus />} />
          <Route path="program" element={<AdminPrograms />} />
          <Route path="dokumen" element={<AdminDocuments />} />
          <Route path="galeri" element={<AdminGallery />} />
          <Route path="lowker" element={<AdminArticles />} />
          <Route path="artikel" element={<Navigate to="/admin/lowker" replace />} />
          <Route path="tim" element={<AdminTeam />} />
          <Route path="broadcast" element={<AdminBroadcast />} />
          <Route path="export-data" element={<AdminExport />} />
          <Route path="pengaturan" element={<AdminSettings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
