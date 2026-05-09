const RegisterLayout = ({ children, title }) => {
  return (
    <div className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{title}</h1>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
