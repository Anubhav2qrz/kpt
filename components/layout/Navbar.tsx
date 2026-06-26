"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/videos", label: "Videos" },
  { href: "/notes", label: "Notes" },
  { href: "/practice", label: "Daily Practice" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show public navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl shadow-lg border-b"
          : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              backgroundColor: "var(--kpt-nav-bg)",
              borderColor: "var(--kpt-border)",
              boxShadow: isDark
                ? "0 4px 24px rgba(0,0,0,0.7)"
                : "0 4px 24px rgba(37,99,235,0.1)",
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-blue-500/30 shadow-lg shadow-blue-700/30 group-hover:shadow-blue-500/50 transition-all duration-300">
              <Image src="/logo.jpg" alt="KPT Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-black text-lg tracking-tight"
                style={{ fontFamily: "Outfit", color: "var(--kpt-text)" }}
              >
                KISHORE <span className="text-orange-500">PLUS</span>
              </span>
              <span className="text-[10px] text-blue-400 tracking-[0.2em] uppercase">
                Tutorial
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? "bg-blue-600/20 text-blue-400 shadow-inner"
                    : "hover:bg-white/5"
                }`}
                style={
                  pathname !== link.href
                    ? { color: "var(--kpt-muted)" }
                    : {}
                }
                onMouseEnter={(e) => {
                  if (pathname !== link.href) {
                    (e.target as HTMLElement).style.color = "var(--kpt-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== link.href) {
                    (e.target as HTMLElement).style.color = "var(--kpt-muted)";
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 border"
              style={{
                backgroundColor: "var(--kpt-card)",
                borderColor: "var(--kpt-border)",
                color: "var(--kpt-muted)",
              }}
            >
              <span className="transition-transform duration-300">
                {isDark ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-500" />
                )}
              </span>
              <span className="text-xs hidden lg:block" style={{ color: "var(--kpt-muted)" }}>
                {isDark ? "Light" : "Dark"}
              </span>
            </button>

            <a
              href="https://wa.me/+919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange text-white text-sm font-semibold px-5 py-2 rounded-xl flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.528 5.85L.057 23.057l5.353-1.403A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.851 0-3.585-.484-5.095-1.332l-.361-.214-3.763.987.995-3.668-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Join WhatsApp
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              className="p-2 rounded-lg transition-all duration-200"
              style={{
                color: "var(--kpt-muted)",
                backgroundColor: "var(--kpt-card)",
                border: "1px solid var(--kpt-border)",
              }}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </button>

            <button
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: "var(--kpt-muted)" }}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden backdrop-blur-xl border-t px-4 pb-6 pt-2"
          style={{
            backgroundColor: "var(--kpt-nav-bg)",
            borderColor: "var(--kpt-border)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium my-1 transition-all ${
                pathname === link.href
                  ? "bg-blue-600/20 text-blue-400"
                  : "hover:bg-white/5"
              }`}
              style={
                pathname !== link.href ? { color: "var(--kpt-muted)" } : {}
              }
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/+919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 btn-orange text-white text-sm font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full"
          >
            Join WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
