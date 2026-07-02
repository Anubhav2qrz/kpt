import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, BookOpen, Target, Atom } from "lucide-react";

export const metadata: Metadata = {
  title: "About Kishore Sir — Kishore Plus Tutorial",
  description:
    "Learn about Kishore Pramanik, Physics teacher from Krishnanagar, West Bengal with 10+ years of teaching experience.",
};

const HIGHLIGHTS = [
  { icon: Award, label: "10+", sub: "Years Experience" },
  { icon: BookOpen, label: "Class 9 to 12", sub: "Physics & Science" },
  { icon: Target, label: "JEE", sub: "Preparation" },
  { icon: Users, label: "NEET", sub: "Preparation" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            👨‍🏫 Meet Your Teacher
          </div>

          <h1
            className="text-5xl font-black mb-4"
            style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
          >
            About{" "}
            <span className="text-orange-500">
              Kishore Pramanik
            </span>
          </h1>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

          {/* Photo */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 rounded-3xl overflow-hidden border-2 border-blue-600/30 shadow-2xl shadow-blue-900/40">
              <Image 
                src="/sir-image.jpeg" 
                alt="Kishore Pramanik" 
                fill
                className="object-cover"
                sizes="288px"
                priority
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">

            <div>
              <h2
                className="text-3xl font-black mb-4"
                style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
              >
                About{" "}
                <span className="gradient-text-blue">
                  Kishore Sir
                </span>
              </h2>

              <p className="leading-relaxed mb-4" style={{ color: "var(--kpt-muted)" }}>
                Kishore Pramanik is a dedicated Physics teacher from
                Krishnanagar, West Bengal, with more than 10 years of
                teaching experience.
              </p>

              <p className="leading-relaxed mb-4" style={{ color: "var(--kpt-muted)" }}>
                He teaches Science for Class 9 & 10, and Physics for Class 11, 12, JEE, and
                NEET aspirants, focusing on building strong concepts
                and problem-solving skills.
              </p>

              <p className="leading-relaxed" style={{ color: "var(--kpt-muted)" }}>
                Through Kishore Plus Tutorial, he aims to make Physics
                simple, understandable, and enjoyable for every student.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="glass-card p-4 text-center"
                  >
                    <Icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />

                    <div
                      className="text-2xl font-black"
                      style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
                    >
                      {item.label}
                    </div>

                    <div className="text-xs mt-1" style={{ color: "var(--kpt-muted)" }}>
                      {item.sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="glass-card p-10 text-center mb-16">

          <Target className="w-12 h-12 text-orange-500 mx-auto mb-5" />

           <h3
            className="text-3xl font-black mb-4"
            style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
          >
            Our Mission
          </h3>

          <p className="leading-relaxed max-w-2xl mx-auto text-lg" style={{ color: "var(--kpt-muted)" }}>
            To help students understand Physics in a simple and practical
            way while preparing them for Board Exams, JEE, and NEET
            through conceptual learning and regular practice.
          </p>

          <div className="mt-6 text-orange-400 font-bold">
            — Kishore Pramanik
          </div>
        </div>

      </div>
    </div>
  );
}