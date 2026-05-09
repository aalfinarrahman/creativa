import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Users, MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { useData } from '../../context/dataContext';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const parseDetails = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const JobLocations = () => {
  const { participants } = useData();

  const locations = useMemo(() => {
    const parseLatLngLoose = (raw) => {
      if (raw === null || raw === undefined) return null;
      let text = String(raw).trim();
      if (!text) return null;
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

    const rows = (Array.isArray(participants) ? participants : [])
      .map((p) => {
        const details = parseDetails(p?.details) || {};
        const company = String(details.namaPerusahaan || '').trim();
        const directLat = details.lokasiLat;
        const directLng = details.lokasiLng;
        const directOk =
          (typeof directLat === 'number' && Number.isFinite(directLat)) && (typeof directLng === 'number' && Number.isFinite(directLng));
        const parsed = directOk ? { lat: directLat, lng: directLng } : parseLatLngLoose(details.koordinatLokasi);
        if (!parsed) return null;
        if (!company) return null;
        const student = String(details.namaLengkap || p?.name || '').trim() || 'Alumni';
        return { company, lat: parsed.lat, lng: parsed.lng, student };
      })
      .filter(Boolean);

    const grouped = new Map();
    for (const row of rows) {
      const key = `${row.company}|${row.lat},${row.lng}`;
      const existing = grouped.get(key);
      if (!existing) {
        grouped.set(key, {
          id: `loc-${key}`,
          name: row.company,
          lat: row.lat,
          lng: row.lng,
          students: 1,
          studentNames: [row.student],
        });
      } else {
        existing.students += 1;
        if (!existing.studentNames.includes(row.student)) existing.studentNames.push(row.student);
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [participants]);

  const stats = useMemo(() => {
    const totalAlumni = locations.reduce((acc, loc) => acc + (Number(loc.students) || 0), 0);
    const totalPerusahaan = locations.length;
    const totalTitik = locations.length;
    return { totalAlumni, totalPerusahaan, totalTitik };
  }, [locations]);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Peta Sebaran Alumni</h2>
        <p className="text-lg text-gray-600">
          Lihat lokasi kerja alumni berdasarkan input lokasi dari masing-masing siswa.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-xl text-center">
          <h4 className="text-4xl font-bold text-blue-600">{stats.totalAlumni}</h4>
          <p className="text-sm text-gray-600 font-medium mt-1">Alumni Terdata</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl text-center">
          <h4 className="text-4xl font-bold text-green-600">{stats.totalTitik}</h4>
          <p className="text-sm text-gray-600 font-medium mt-1">Titik Lokasi</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-xl text-center">
          <h4 className="text-4xl font-bold text-orange-600">{stats.totalPerusahaan}</h4>
          <p className="text-sm text-gray-600 font-medium mt-1">Perusahaan</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl text-center">
          <h4 className="text-4xl font-bold text-purple-600">100%</h4>
          <p className="text-sm text-gray-600 font-medium mt-1">Berdasarkan Input</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        {locations.length === 0 && (
          <div className="px-2 pb-4 text-sm text-gray-600">
            Belum ada siswa yang mengisi lokasi kerja.
          </div>
        )}
        <div className="h-[600px] w-full rounded-lg overflow-hidden relative z-0">
          <MapContainer 
            center={[36.2048, 138.2529]} 
            zoom={5} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {loc.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-2 text-gray-700 font-medium">
                        <Users className="w-4 h-4 text-gray-500" />
                        {loc.students} Alumni
                      </p>
                      {Array.isArray(loc.studentNames) && loc.studentNames.length > 0 && (
                        <div className="text-xs text-gray-600">
                          {loc.studentNames.slice(0, 8).join(', ')}
                          {loc.studentNames.length > 8 ? `, dan ${loc.studentNames.length - 8} lainnya` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default JobLocations;
