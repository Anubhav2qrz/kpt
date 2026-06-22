export function StatsBar() {
  const stats = [
    { value: "5000+", label: "Students Taught" },
    { value: "500+", label: "Video Lectures" },
    { value: "10+", label: "Years Experience" },
    { value: "95%", label: "JEE/NEET Success" },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="stat-number mb-2">{stat.value}</div>
              <div className="text-[#7a8dbe] text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
