import Link from "next/link";
import { BookOpen, FlaskConical, Target, Atom, GraduationCap, Microscope } from "lucide-react";

const CATEGORIES = [
  {
    label: "Class 9 Physics",
    href: "/videos?category=class9",
    icon: GraduationCap,
    color: "from-violet-600 to-violet-900",
    glow: "shadow-violet-600/20",
    description: "Motion, Gravitation, Sound & Work",
    badge: "Foundation",
    badgeColor: "bg-violet-600/20 text-violet-300 border-violet-600/30",
  },
  {
    label: "Class 10 Physics",
    href: "/videos?category=class10",
    icon: Microscope,
    color: "from-cyan-600 to-cyan-900",
    glow: "shadow-cyan-600/20",
    description: "Light, Electricity & Magnetic Effects",
    badge: "Foundation",
    badgeColor: "bg-cyan-600/20 text-cyan-300 border-cyan-600/30",
  },
  {
    label: "Class 11 Physics",
    href: "/videos?category=class11",
    icon: BookOpen,
    color: "from-blue-600 to-blue-800",
    glow: "shadow-blue-600/20",
    description: "Motion, Forces, Thermodynamics & more",
    badge: "Board",
    badgeColor: "bg-blue-600/20 text-blue-300 border-blue-600/30",
  },
  {
    label: "Class 12 Physics",
    href: "/videos?category=class12",
    icon: Atom,
    color: "from-indigo-600 to-indigo-900",
    glow: "shadow-indigo-600/20",
    description: "Electricity, Magnetism, Optics & more",
    badge: "Board",
    badgeColor: "bg-indigo-600/20 text-indigo-300 border-indigo-600/30",
  },
  {
    label: "JEE Physics",
    href: "/videos?category=jee",
    icon: FlaskConical,
    color: "from-orange-600 to-orange-900",
    glow: "shadow-orange-600/20",
    description: "Advanced problem solving for JEE",
    badge: "Competitive",
    badgeColor: "bg-orange-600/20 text-orange-300 border-orange-600/30",
  },
  {
    label: "NEET Physics",
    href: "/videos?category=neet",
    icon: Target,
    color: "from-emerald-600 to-emerald-900",
    glow: "shadow-emerald-600/20",
    description: "Targeted preparation for NEET",
    badge: "Competitive",
    badgeColor: "bg-emerald-600/20 text-emerald-300 border-emerald-600/30",
  },
];

export function CategoryCards() {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--kpt-section-alt)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            📚 Choose Your Path
          </div>
          <h2 className="text-4xl font-black" style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}>
            All <span className="gradient-text">Physics Courses</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--kpt-muted)" }}>
            Select your class or exam and dive into curated video lectures designed for exam success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`category-card glass-card p-8 flex flex-col items-center text-center group shadow-xl ${cat.glow}`}
              >
                {/* Badge */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border mb-4 ${cat.badgeColor}`}
                >
                  {cat.badge}
                </span>

                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
                >
                  {cat.label}
                </h3>
                <p className="text-sm" style={{ color: "var(--kpt-muted)" }}>
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
