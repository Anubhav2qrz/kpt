import type { Metadata } from "next";
import { Phone, Mail, PlayCircle, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Kishore Plus Tutorial",
  description: "Get in touch with Kishore Plus Tutorial via WhatsApp, email, or YouTube.",
};

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "WhatsApp",
    value: "+91 62960 96600",
    sub: "Chat with us directly",
    href: "https://wa.me/+916296096600",
    color: "from-green-600 to-green-800",
    glow: "shadow-green-600/20",
    cta: "Open WhatsApp",
  },
  {
    icon: Mail,
    title: "Email",
    value: "pramanickkishore1996@gmail.com",
    sub: "We reply within 24 hours",
    href: "mailto:pramanickkishore1996@gmail.com",
    color: "from-blue-600 to-blue-800",
    glow: "shadow-blue-600/20",
    cta: "Send Email",
  },
  {
    icon: PlayCircle,
    title: "YouTube",
    value: "@KishorePlusTutorial",
    sub: "Subscribe for free lectures",
    href: "https://youtube.com/@KishorePlusTutorial",
    color: "from-red-600 to-red-800",
    glow: "shadow-red-600/20",
    cta: "Visit Channel",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            📞 Reach Out
          </div>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "Outfit" }}>
            Get in <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-[#7a8dbe] max-w-lg mx-auto">
            Have questions about admissions, courses, or anything else? We're here to help — reach out through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-card p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 shadow-xl ${card.glow}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "Outfit" }}>{card.title}</h3>
                <p className="text-[#7a8dbe] text-xs mb-2">{card.sub}</p>
                <p className="text-blue-300 text-sm font-medium break-all mb-5">{card.value}</p>
                <span className="btn-glow text-white text-sm font-semibold px-6 py-2 rounded-xl">
                  {card.cta}
                </span>
              </a>
            );
          })}
        </div>

        {/* WhatsApp CTA */}
        <div className="glass-card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-blue-600/5 pointer-events-none" />
          <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "Outfit" }}>
            Join Our WhatsApp Group
          </h3>
          <p className="text-[#7a8dbe] mb-6 max-w-md mx-auto">
            Get instant notifications about new videos, exam updates, and free study material directly on WhatsApp.
          </p>
          <a
            href="https://wa.me/+916296096600"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-green-600/30 hover:shadow-green-500/50 hover:-translate-y-1 transition-all duration-300 text-base"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.85L.057 23.057l5.353-1.403A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.851 0-3.585-.484-5.095-1.332l-.361-.214-3.763.987.995-3.668-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Join WhatsApp Group
          </a>
        </div>
      </div>
    </div>
  );
}
