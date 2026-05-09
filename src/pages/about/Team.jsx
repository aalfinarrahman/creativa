import AboutLayout from './AboutLayout';
import { Linkedin, Mail, User } from 'lucide-react';
import { useData } from '../../context/dataContext';

const Team = () => {
  const { teams, loading } = useData();

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const leaders = teams.slice(0, 2);
  const members = teams.slice(2);

  const TeamCard = ({ member }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group w-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={member.image || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={member.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-2 text-center">
        <h3 className="text-xs font-bold text-gray-900 leading-tight mb-0.5 truncate px-0.5">{member.name}</h3>
        <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider truncate px-0.5">{member.role}</p>
      </div>
    </div>
  );

  return (
    <AboutLayout title="Tim Kami">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-gray-600 text-lg">
          Kami didukung oleh tenaga profesional yang berdedikasi tinggi untuk membimbing dan mengantarkan kesuksesan para peserta didik.
        </p>
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Belum ada data tim yang ditampilkan.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Leaders Section (Top 2) */}
          {leaders.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {leaders.map((member) => (
                <div key={member.id} className="w-32 md:w-40">
                  <TeamCard member={member} />
                </div>
              ))}
            </div>
          )}

          {/* Members Section (Rest) */}
          {members.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 justify-items-center">
              {members.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      )}
    </AboutLayout>
  );
};

export default Team;
