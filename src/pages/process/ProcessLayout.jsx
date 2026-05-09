const ProcessLayout = ({ children, title, embedded = false, sectionId }) => {
  if (embedded) {
    return (
      <section id={sectionId} className="scroll-mt-24">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">{title}</h2>
          {children}
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{title}</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">{children}</div>
    </div>
  );
};

export default ProcessLayout;
