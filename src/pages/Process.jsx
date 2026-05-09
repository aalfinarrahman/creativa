import Registration from './process/Registration';
import Selection from './process/Selection';
import Training from './process/Training';
import Interview from './process/Interview';
import Documents from './process/Documents';
import Departure from './process/Departure';

const Process = () => {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Proses ke Jepang</h1>
          <p className="text-lg text-gray-600">
            Urutan proses lengkap dari pendaftaran sampai keberangkatan.
          </p>
        </div>

        <div className="space-y-10">
          <Registration embedded />
          <Selection embedded />
          <Training embedded />
          <Interview embedded />
          <Documents embedded />
          <Departure embedded />
        </div>
      </div>
    </div>
  );
};

export default Process;
