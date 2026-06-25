import Link from "next/link";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { BUSINESS_ADDRESS, PHONE_NUMBER, getWhatsAppLink } from "@/lib/utils";

const iPhoneLinks = [
  { label: "iPhone 17 Series", href: "/iphone/iphone-17-pro-max" },
  { label: "iPhone 16 Series", href: "/iphone/iphone-16-pro-max" },
  { label: "iPhone 15 Series", href: "/iphone/iphone-15-pro-max" },
  { label: "iPhone 14 Series", href: "/iphone/iphone-14-pro-max" },
  { label: "SE Series", href: "/iphone/iphone-se-3rd-gen" },
  { label: "View Full Collection", href: "/collection" },
];

const serviceLinks = [
  { label: "Buy an iPhone", href: "/collection" },
  { label: "Sell Your iPhone", href: "/sell" },
  { label: "Trade-In", href: "/swap" },
  { label: "Installment Plans", href: "/installment" },
  { label: "Compare Models", href: "/comparison" },
  { label: "Nationwide Delivery", href: "/contact" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", background: "#fff" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <div className="font-bold text-base tracking-wider" style={{ color: "var(--text)" }}>ACE MOBILE HUB</div>
              <div className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--accent)" }}>
                Ghana&rsquo;s Premier iPhone Marketplace
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: "var(--text-secondary)" }}>
              Ghana&rsquo;s trusted iPhone destination. We specialise in buying, selling, and trade-ins of genuine Apple devices with a commitment to quality and customer trust.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{BUSINESS_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} style={{ color: "var(--accent)" }} />
                <a href={`tel:${PHONE_NUMBER}`} className="text-sm" style={{ color: "var(--text-secondary)" }}>{PHONE_NUMBER}</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div>Mon – Sat: 9:00 AM – 7:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* iPhones */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--text-muted)" }}>iPhone Models</h4>
            <ul className="space-y-3">
              {iPhoneLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-600" style={{ color: "var(--text-secondary)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--text-muted)" }}>Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-600" style={{ color: "var(--text-secondary)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + WhatsApp */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--text-muted)" }}>Company</h4>
            <ul className="space-y-3 mb-8">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm transition-colors hover:text-blue-600" style={{ color: "var(--text-secondary)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={getWhatsAppLink("Hello, I'd like to inquire about an iPhone.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg transition-colors"
              style={{ background: "rgba(37,211,102,0.1)", color: "#16a34a", border: "1px solid rgba(37,211,102,0.25)" }}
            >
              <MessageCircle size={16} />
              Chat on WhatsApp
            </a>
            <a
              href="https://www.instagram.com/ace_mobile_hub"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg transition-colors"
              style={{ background: "rgba(225,48,108,0.08)", color: "#e1306c", border: "1px solid rgba(225,48,108,0.2)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Ace Mobile Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Genuine iPhones · Secure Transactions · Nationwide Delivery
            </p>
            <a
              href="https://www.instagram.com/ace_mobile_hub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:opacity-70"
              style={{ color: "#e1306c" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
