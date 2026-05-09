const AboutLayout = ({ children, title }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{title}</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
};

export default AboutLayout;
