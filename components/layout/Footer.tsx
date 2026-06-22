import Link from "next/link";
import Image from "next/image";
import { Atom, PlayCircle, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Videos", href: "/videos" },
  { label: "Notes", href: "/notes" },
  { label: "Daily Practice", href: "/practice" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-blue-900/20 bg-[#060c22] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-500/30 flex items-center justify-center">
                <Image src="/logo.jpg" alt="KPT Logo" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <div className="font-black text-lg text-white" style={{ fontFamily: "Outfit" }}>
                  KISHORE <span className="text-orange-500">PLUS</span>
                </div>
                <div className="text-[10px] text-blue-400 tracking-[0.2em] uppercase">Tutorial</div>
              </div>
            </div>
            <p className="text-[#7a8dbe] text-sm leading-relaxed">
              Expert Physics coaching for Class 11, Class 12, JEE & NEET. Building tomorrow's physicists today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#7a8dbe] hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest text-blue-400">
              Connect With Us
            </h3>
            <div className="space-y-4">
              <a
                href="https://wa.me/+916296096600"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#7a8dbe] hover:text-green-400 text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-green-500" />
                WhatsApp: +91 62960 96600
              </a>
              <a
                href="mailto:pramanickkishore1996@gmail.com"
                className="flex items-center gap-3 text-[#7a8dbe] hover:text-blue-400 text-sm transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                pramanickkishore1996@gmail.com
              </a>
              <a
                href="https://youtube.com/@KishorePlusTutorial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#7a8dbe] hover:text-red-400 text-sm transition-colors"
              >
                <PlayCircle className="w-4 h-4 text-red-500" />
                YouTube Channel
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#7a8dbe] text-xs">
            © {new Date().getFullYear()} Kishore Plus Tutorial. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-[#7a8dbe] hover:text-blue-400 text-xs transition-colors"
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
}
