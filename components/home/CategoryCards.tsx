import Link from "next/link";
import { BookOpen, FlaskConical, Target, Atom } from "lucide-react";

const CATEGORIES = [
  {
    label: "Class 11 Physics",
    href: "/videos?category=class11",
    icon: BookOpen,
    color: "from-blue-600 to-blue-800",
    glow: "shadow-blue-600/20",
    description: "Motion, Forces, Thermodynamics & more",
  },
  {
    label: "Class 12 Physics",
    href: "/videos?category=class12",
    icon: Atom,
    color: "from-indigo-600 to-indigo-900",
    glow: "shadow-indigo-600/20",
    description: "Electricity, Magnetism, Optics & more",
  },
  {
    label: "JEE Physics",
    href: "/videos?category=jee",
    icon: FlaskConical,
    color: "from-orange-600 to-orange-900",
    glow: "shadow-orange-600/20",
    description: "Advanced problem solving for JEE",
  },
  {
    label: "NEET Physics",
    href: "/videos?category=neet",
    icon: Target,
    color: "from-emerald-600 to-emerald-900",
    glow: "shadow-emerald-600/20",
    description: "Targeted preparation for NEET",
  },
];

export function CategoryCards() {
  return (
    <section className="py-20 bg-[#060c22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            📚 Choose Your Path
          </div>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "Outfit" }}>
            All <span className="gradient-text">Physics Courses</span>
          </h2>
          <p className="text-[#7a8dbe] mt-4 max-w-xl mx-auto">
            Select your class or exam and dive into curated video lectures designed for exam success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`category-card glass-card p-8 flex flex-col items-center text-center group shadow-xl ${cat.glow}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Outfit" }}>
                  {cat.label}
                </h3>
                <p className="text-[#7a8dbe] text-sm">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
