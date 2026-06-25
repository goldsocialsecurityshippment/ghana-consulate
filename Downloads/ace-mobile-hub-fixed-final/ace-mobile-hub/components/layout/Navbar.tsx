"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { PHONE_NUMBER, getWhatsAppLink } from "@/lib/utils";

const navLinks = [
  { label: "Collection", href: "/collection" },
  {
    label: "Services",
    href: "#",
    children: [
      { label: "Buy an iPhone", href: "/collection" },
      { label: "Sell Your iPhone", href: "/sell" },
      { label: "Trade-In", href: "/swap" },
      { label: "Installment Plans", href: "/installment" },
    ],
  },
  { label: "Compare", href: "/comparison" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-250 ${
        scrolled
          ? "shadow-sm"
          : ""
      }`}
      style={{
        background: scrolled ? "rgba(255,255,255,0.97)" : "#fff",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/logo.png"
            alt="Ace Mobile Hub"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm tracking-[0.12em]" style={{ color: "var(--text)" }}>
              ACE MOBILE HUB
            </span>
            <span className="text-[8px] tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
              iPhone Specialist · Accra
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative group">
                <button className="nav-link flex items-center gap-1 py-1">
                  {link.label}
                  <ChevronDown size={11} className="opacity-40 group-hover:opacity-70 transition-opacity" />
                </button>
                <div className="absolute top-full left-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-180">
                  <div
                    className="rounded-lg py-1.5 min-w-[190px] shadow-lg"
                    style={{ background: "#fff", border: "1px solid var(--border)" }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-xs font-medium transition-colors hover:bg-slate-50"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={link.label} href={link.href} className="nav-link">
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="text-xs font-medium tracking-wide transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {PHONE_NUMBER}
          </a>
          <a
            href={getWhatsAppLink("Hello, I'm interested in an iPhone.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ padding: "0.5rem 1.125rem", fontSize: "0.75rem", borderRadius: "5px" }}
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden transition-colors"
          style={{ color: "var(--text-secondary)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden border-t px-6 py-5"
          style={{ background: "#fff", borderColor: "var(--border)" }}
        >
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    className="w-full text-left py-2.5 text-sm font-medium flex items-center justify-between"
                    style={{ color: "var(--text-secondary)" }}
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    {link.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 border-l ml-2 mb-1" style={{ borderColor: "var(--border)" }}>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block py-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-2.5 text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
              <a
                href={getWhatsAppLink("Hello, I'm interested in an iPhone.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
