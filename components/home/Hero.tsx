import Link from "next/link";
import { Download, Play, ChevronRight, Atom, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/6 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.7s" }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(#2563eb 1px, transparent 1px), linear-gradient(to right, #2563eb 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Expert Physics Coaching
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6" style={{ fontFamily: "Outfit" }}>
              <span style={{ color: "var(--kpt-text)" }}>Master</span>
              <br />
              <span className="gradient-text">Physics</span>
              <br />
              <span style={{ color: "var(--kpt-text)" }}>with</span>{" "}
              <span className="text-orange-500">Kishore Sir</span>
            </h1>

            <p className="text-lg leading-relaxed mb-10 max-w-xl" style={{ color: "var(--kpt-muted)" }}>
              Premium physics coaching for Class 9, 10, 11, 12, JEE &amp; NEET. Conceptual clarity, exam-focused content, and proven results — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/+919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-base"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.85L.057 23.057l5.353-1.403A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.851 0-3.585-.484-5.095-1.332l-.361-.214-3.763.987.995-3.668-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                Join WhatsApp
              </a>
              <Link
                href="/notes"
                className="btn-glow inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-base"
              >
                <Download className="w-5 h-5" />
                Download Notes
              </Link>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 font-semibold px-6 py-4 rounded-2xl text-base transition-all duration-300 hover:text-blue-400"
                style={{ color: "var(--kpt-muted)", border: "1px solid var(--kpt-border)" }}
              >
                <Play className="w-5 h-5" />
                Watch Free Videos
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — Teacher Photo Placeholder */}
          <div className="relative flex justify-center items-center animate-fade-up-delay-2">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/30 to-orange-500/20 blur-2xl scale-110" />
              {/* Photo circle */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-blue-600/40 shadow-2xl shadow-blue-900/50 pulse-ring">
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #0a0a1a 60%, #000000 100%)" }}>
                  <Atom className="w-24 h-24 text-blue-400/60 float-anim mb-4" />
                  <span className="text-blue-300 font-bold text-xl" style={{ fontFamily: "Outfit" }}>Kishore Sir</span>
                  <span className="text-[#7a8dbe] text-sm mt-1">Physics Expert</span>
                  <span className="text-[#7a8dbe] text-xs mt-1">(Photo coming soon)</span>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2 float-anim" style={{ animationDelay: "0.5s" }}>
                <span className="text-xs text-blue-400 font-semibold">🎯 JEE Expert</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 float-anim" style={{ animationDelay: "1s" }}>
                <span className="text-xs text-orange-400 font-semibold">⚡ NEET Specialist</span>
              </div>
              <div className="absolute top-1/2 -right-8 glass-card px-4 py-2 float-anim" style={{ animationDelay: "1.5s" }}>
                <span className="text-xs text-green-400 font-semibold">✅ 10+ Years Exp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[#7a8dbe] text-xs">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-blue-600/40 flex items-start justify-center pt-1">
          <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
