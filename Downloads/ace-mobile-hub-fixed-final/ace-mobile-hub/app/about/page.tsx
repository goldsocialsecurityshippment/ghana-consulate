import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ace Mobile Hub — Ghana's trusted iPhone specialist based at Accra Circle Mall.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* Header */}
      <section className="pt-36 pb-16 border-b" style={{ background: "#fff", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="section-label mb-5">Our Story</div>
            <h1
              className="font-bold tracking-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)", color: "var(--text)", lineHeight: "1.05" }}
            >
              About Ace Mobile Hub
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              A dedicated iPhone destination built on transparency, trust, and a genuine passion for Apple technology.
            </p>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: "var(--text)" }}>Who We Are</h2>
              <div className="space-y-5 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <p>
                  Ace Mobile Hub is Ghana&rsquo;s dedicated iPhone specialist, operating from Accra Circle Mall.
                  We were established with a single focus: to provide Ghanaians with a trustworthy, professional
                  destination for buying, selling, and swapping genuine Apple iPhone devices.
                </p>
                <p>
                  Unlike general mobile phone retailers, every aspect of our business centres on iPhones.
                  This specialisation means superior product knowledge, more accurate device valuations,
                  and a level of service general electronics stores cannot match.
                </p>
                <p>
                  From our base at Accra Circle Mall, we serve customers across Greater Accra and, through
                  our nationwide delivery network, across every region of Ghana.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "iPhone-Only Focus",
                  desc: "Our complete expertise and inventory is dedicated to Apple iPhones — from iPhone 7 through the current iPhone 17 series.",
                },
                {
                  title: "Verified Genuine Devices",
                  desc: "We work exclusively with authentic Apple hardware. Every device is checked before it reaches a customer.",
                },
                {
                  title: "Customer-First Approach",
                  desc: "We take time to understand what each customer needs — whether buying, selling, swapping, or applying for an installment plan.",
                },
              ].map((item, i) => (
                <div key={i} className="card p-5 flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(37,99,235,0.07)" }}
                  >
                    <BadgeCheck size={15} style={{ color: "var(--accent)" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 border-y" style={{ background: "#fff", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-5">Our Services</div>
          <h2 className="text-2xl font-bold mb-12" style={{ color: "var(--text)" }}>What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Buy iPhones", desc: "Choose from a curated selection of genuine iPhones spanning every major model from iPhone 7 to iPhone 17 Pro Max.", link: "/collection" },
              { title: "Sell Your iPhone", desc: "Receive a competitive, honest evaluation for your current iPhone and complete a secure, straightforward sale.", link: "/sell" },
              { title: "Swap Your iPhone", desc: "Trade your existing iPhone toward an upgrade. We handle the valuation, the transaction, and the transition.", link: "/swap" },
              { title: "Installment Plans", desc: "Own your preferred iPhone through a structured installment plan — with remote application, valid ID required.", link: "/installment" },
            ].map((s, i) => (
              <Link key={i} href={s.link} className="card p-6 group block">
                <h3 className="text-base font-bold mb-2.5" style={{ color: "var(--text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                  Learn More <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label mb-5">Nationwide Reach</div>
              <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--text)" }}>Delivery Across Ghana</h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                While our physical presence is at Accra Circle Mall, our service extends to every corner of Ghana.
                We work with trusted dispatch and courier partners to ensure every iPhone reaches its new owner
                safely, securely, and on time.
              </p>
              <p className="text-base leading-relaxed mb-7" style={{ color: "var(--text-secondary)" }}>
                All devices are carefully packaged before dispatch, and customers are kept informed throughout.
              </p>
              <div className="flex items-center gap-2.5 mb-7">
                <MapPin size={14} style={{ color: "var(--accent)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Accra Circle Mall, Ghana</span>
              </div>
              <a
                href={getWhatsAppLink("Hello, I'd like to learn more about Ace Mobile Hub.")}
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp inline-flex"
              >
                Get in Touch
              </a>
            </div>

            <div className="card p-8">
              <div className="space-y-7">
                {[
                  { stat: "iPhone 7 – 17", label: "Full model range covered" },
                  { stat: "All 16 Regions", label: "Nationwide delivery available" },
                  { stat: "100%", label: "Genuine verified devices" },
                  { stat: "Remote", label: "Installment application process" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>{item.stat}</div>
                    <div className="text-sm text-right" style={{ color: "var(--text-secondary)" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
