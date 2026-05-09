import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JobLocations from './JobLocations';
import Testimonials from './Testimonials';

const AlumniLayout = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = (location.hash || '').trim();
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -80);
    }, 0);
  }, [location.hash]);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 space-y-16">
        <section id="lokasi-kerja">
          <JobLocations />
        </section>
        <section id="testimoni">
          <Testimonials />
        </section>
      </div>
    </div>
  );
};

export default AlumniLayout;
