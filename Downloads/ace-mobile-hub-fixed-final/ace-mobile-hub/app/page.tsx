"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, BadgeCheck, CreditCard, Headphones,
  ArrowRight, Star, MapPin, CheckCircle2,
  Smartphone, RefreshCw, MessageCircle,
  Clock, Zap, Users,
} from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import { iphones } from "@/data/iphones";

const testimonials = [
  { name: "Kwame Asante", role: "Business Owner, Kumasi", quote: "Swapped my iPhone 12 for a 14 Pro. The process was smooth, the valuation was fair, and delivery reached me within two days.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", stars: 5 },
  { name: "Abena Mensah", role: "Teacher, Accra", quote: "Bought my first iPhone through the installment plan. The application was entirely remote — I didn't have to leave home.", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face", stars: 5 },
  { name: "Kofi Boateng", role: "Software Engineer, Tema", quote: "Sold my old iPhone 11 Pro and got a competitive price. The transaction was professional and completed in under 24 hours.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", stars: 5 },
];

const featuredSlugs = ["iphone-17-pro-max", "iphone-17-pro", "iphone-16-pro", "iphone-15-pro-max"];
const featuredModels = iphones.filter(p => featuredSlugs.includes(p.slug));

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.09 } } };

export default function Home() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #050A18 0%, #0A1628 35%, #0D1F3C 60%, #071020 100%)",
        }}
      >
        {/* Background glow orb — matches reference screenshot */}
        <div
          className="absolute"
          style={{
            right: "-5%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,80,200,0.55) 0%, rgba(20,60,160,0.30) 35%, rgba(10,20,80,0.10) 65%, transparent 75%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        {/* Subtle outer halo */}
        <div
          className="absolute"
          style={{
            right: "-15%",
            top: "50%",
            transform: "translateY(-50%)",
            width: "900px",
            height: "900px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(10,40,120,0.20) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        {/* Water/ripple texture overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(ellipse 80% 50% at 70% 60%, rgba(20,60,180,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 lg:gap-12 items-center">

            {/* Left: editorial copy */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeUp} className="section-label mb-6" style={{ color: "#60A5FA" }}>
                <span style={{ background: "#60A5FA" }} className="w-[18px] h-[1.5px] block flex-shrink-0 mr-2.5" />
                Ghana&rsquo;s Premier iPhone Specialist
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-bold leading-[1.02] tracking-tight mb-7"
                style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)", color: "#FFFFFF" }}
              >
                Every iPhone.{" "}
                <br className="hidden md:block" />
                Genuine. Trusted.{" "}
                <br className="hidden md:block" />
                <span style={{ color: "#3B82F6" }}>Yours.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg leading-relaxed mb-10"
                style={{ color: "rgba(255,255,255,0.65)", maxWidth: "460px" }}
              >
                Ace Mobile Hub is Accra&rsquo;s dedicated iPhone destination — buy, sell, swap, or own your dream model through flexible installment plans.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-12">
                <Link href="/collection" className="btn-hero-primary">
                  Explore the Collection <ArrowRight size={15} />
                </Link>
                <a
                  href={getWhatsAppLink("Hello, I'm interested in an iPhone from Ace Mobile Hub.")}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  Chat on WhatsApp
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                {[
                  { num: "500+", label: "Happy customers" },
                  { num: "35+", label: "Models available" },
                  { num: "16", label: "Regions covered" },
                  { num: "98%", label: "Customer satisfaction" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold" style={{ color: "#3B82F6" }}>{s.num}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: iPhone showcase with real image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
              className="flex justify-center lg:block relative"
            >
              <div className="relative mx-auto w-48 sm:w-64 lg:w-96">
                {/* Glow behind phone */}
                <div
                  className="absolute inset-0 rounded-[32px] blur-3xl"
                  style={{ background: "rgba(37,99,235,0.35)", transform: "scale(0.9) translateY(20px)" }}
                />
                {/* Phone image — transparent bg to show real product shot */}
                <div className="relative flex items-center justify-center" style={{ height: "clamp(220px, 40vw, 580px)" }}>
                  <Image
                    src="/images/iphones/iphone-hero.png"
                    alt="iPhone 17 Pro Max"
                    width={360}
                    height={580}
                    className="object-contain drop-shadow-2xl w-full h-full"
                    priority
                    style={{ filter: "drop-shadow(0 40px 60px rgba(20,60,180,0.5))" }}
                  />
                </div>

                {/* Model badge */}
                <motion.div
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.35 }}
                  className="absolute -top-4 -right-8 rounded-lg px-3.5 py-2.5 shadow-lg"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
                >
                  <div className="text-[11px] font-bold" style={{ color: "#fff" }}>iPhone 17 Pro Max</div>
                  <div className="text-[10px]" style={{ color: "#60A5FA" }}>Now Available</div>
                </motion.div>

                {/* Installment badge */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1, duration: 0.35 }}
                  className="absolute -bottom-4 -left-8 rounded-lg px-3.5 py-2.5 shadow-lg flex items-center gap-2.5"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(37,99,235,0.3)" }}>
                    <CreditCard size={13} style={{ color: "#60A5FA" }} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold" style={{ color: "#fff" }}>Installments</div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>From 3 months</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>

      </section>

      {/* Bottom services strip — sits BELOW the hero, full dark bg */}
      <div style={{ background: "#050A18", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: Smartphone, label: "Buy iPhones", desc: "Curated genuine models" },
              { icon: RefreshCw, label: "Sell & Swap", desc: "Competitive valuations" },
              { icon: CreditCard, label: "Installments", desc: "Flexible payment plans" },
              { icon: Headphones, label: "Dedicated Support", desc: "Team here to help" },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 py-4 px-3 sm:px-4 ${i % 2 === 0 ? "border-r" : ""} md:border-r border-b md:border-b-0`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.25)" }}>
                  <s.icon size={14} style={{ color: "#60A5FA" }} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold" style={{ color: "#fff" }}>{s.label}</div>
                  <div className="text-[10px] sm:text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FEATURED COLLECTION ──────────────────────────────── */}
      <section className="py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="section-label mb-4">Featured Models</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
                Latest iPhones
              </h2>
            </motion.div>
            <Link
              href="/collection"
              className="flex items-center gap-2 text-sm font-semibold shrink-0"
              style={{ color: "var(--accent)" }}
            >
              View all models <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4-up editorial grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] gap-4 sm:gap-5">

            {/* Hero card */}
            {featuredModels[0] && (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="lg:row-span-2"
              >
                <Link href={`/iphone/${featuredModels[0].slug}`} className="phone-card group block h-full">
                  <div
                    className="relative overflow-hidden"
                    style={{ height: "340px", background: "var(--card-bg)" }}
                  >
                    <Image
                      src={featuredModels[0].image}
                      alt={featuredModels[0].name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ padding: "12% 18%", filter: "drop-shadow(0 16px 32px rgba(15,23,42,0.13))" }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
                      {featuredModels[0].year}
                    </div>
                    <h3 className="text-xl font-bold mb-1.5" style={{ color: "var(--text)" }}>
                      {featuredModels[0].name}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                      {featuredModels[0].tagline}
                    </p>
                    <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                      Check Availability <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Smaller cards */}
            {featuredModels.slice(1).map((phone, i) => (
              <motion.div
                key={phone.slug}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp}
                style={{ transitionDelay: `${(i + 1) * 0.07}s` }}
              >
                <Link href={`/iphone/${phone.slug}`} className="phone-card group flex overflow-hidden h-full">
                  <div
                    className="w-28 shrink-0 relative overflow-hidden"
                    style={{ background: "var(--card-bg)", minHeight: "120px" }}
                  >
                    <Image
                      src={phone.image}
                      alt={phone.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      style={{ padding: "10% 15%", filter: "drop-shadow(0 10px 20px rgba(15,23,42,0.12))" }}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <div className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: "var(--accent)" }}>
                      {phone.year}
                    </div>
                    <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>{phone.name}</h3>
                    <p className="text-xs mb-3 leading-snug" style={{ color: "var(--text-secondary)" }}>{phone.tagline}</p>
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                      Inquire <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY ACE MOBILE HUB ──────────────────────────────── */}
      <section className="border-y" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 items-start">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="section-label mb-5">Why Choose Us</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-6" style={{ color: "var(--text)" }}>
                iPhone-only.<br />
                Genuinely trusted.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                We built Ace Mobile Hub around one product — the iPhone. That focus means deeper knowledge, better valuations, and a curated experience you won&rsquo;t find at a general retailer.
              </motion.p>
              <motion.div variants={fadeUp}>
                <a
                  href={getWhatsAppLink("Hello, I'd like to learn more about Ace Mobile Hub.")}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-outline inline-flex"
                >
                  Talk to Us
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 gap-px"
              style={{ background: "var(--border)" }}
            >
              {[
                { icon: BadgeCheck, title: "iPhone Specialists Only", desc: "Our entire focus is Apple iPhones — from SE to 17 Pro Max. No distractions, no dilution." },
                { icon: Shield, title: "Verified Genuine Devices", desc: "Every device is checked for authenticity before sale. Zero counterfeits, zero compromises." },
                { icon: CreditCard, title: "Flexible Installments", desc: "Own the iPhone you want today and pay over 3, 6, or 12 months with clear, fair terms." },
                { icon: RefreshCw, title: "Sell & Swap", desc: "Get a competitive offer for your current device. Trade it in or sell it outright — your call." },
                { icon: Headphones, title: "Dedicated Support", desc: "Our team is available throughout your purchase, from model selection through to delivery." },
                { icon: MapPin, title: "Nationwide Delivery", desc: "We deliver to all 16 regions of Ghana — securely packaged, reliably dispatched." },
              ].map((card, i) => (
                <motion.div key={i} variants={fadeUp} className="p-6" style={{ background: "#fff" }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(37,99,235,0.07)" }}>
                    <card.icon size={17} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text)" }}>{card.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── INSTALLMENT PLANS ───────────────────────────────── */}
      <section className="py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="section-label mb-5">Installment Plans</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-5" style={{ color: "var(--text)" }}>
                Own an iPhone today.{" "}
                <span style={{ color: "var(--accent)" }}>Pay over time.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                No complicated paperwork, no surprises. Just a clear payment schedule that fits your life. Apply from anywhere in Ghana — entirely remote.
              </motion.p>
              <motion.div variants={stagger} className="space-y-3 mb-9">
                {[
                  { icon: Clock, label: "Flexible duration", detail: "3, 6 or 12 months" },
                  { icon: Zap, label: "Quick approval", detail: "Simple remote application" },
                  { icon: CheckCircle2, label: "Transparent terms", detail: "No hidden fees" },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.07)" }}>
                      <item.icon size={14} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{item.label}</span>
                      <span className="text-sm ml-2" style={{ color: "var(--text-secondary)" }}>— {item.detail}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/installment" className="btn-primary inline-flex">
                  Apply for a Plan <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="space-y-3"
            >
              {[
                { plan: "3-Month Plan", detail: "Pay in 3 equal parts", badge: "Most Flexible", highlight: false },
                { plan: "6-Month Plan", detail: "Spread over 6 months", badge: "Most Popular", highlight: true },
                { plan: "12-Month Plan", detail: "Lowest monthly commitment", badge: "Most Accessible", highlight: false },
              ].map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-5 rounded-xl border"
                  style={{
                    background: "#fff",
                    borderColor: p.highlight ? "var(--accent)" : "var(--border)",
                    boxShadow: p.highlight ? "0 4px 20px rgba(37,99,235,0.10)" : "none",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: p.highlight ? "var(--accent)" : "rgba(37,99,235,0.07)" }}
                  >
                    <CreditCard size={18} style={{ color: p.highlight ? "#fff" : "var(--accent)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold" style={{ color: "var(--text)" }}>{p.plan}</div>
                    <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{p.detail}</div>
                  </div>
                  <span
                    className="text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
                    style={{
                      background: p.highlight ? "rgba(37,99,235,0.09)" : "#F1F5F9",
                      color: p.highlight ? "var(--accent)" : "var(--text-secondary)",
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
              ))}
              <div className="p-4 rounded-xl text-center text-sm" style={{ background: "#F8FAFC", border: "1px solid var(--border)" }}>
                Not sure which plan fits?{" "}
                <a
                  href={getWhatsAppLink("Hello, I'd like to know more about your installment plans.")}
                  target="_blank" rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "var(--accent)" }}
                >
                  Ask us on WhatsApp.
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SELL YOUR iPHONE ─────────────────────────────────── */}
      <section className="py-24 border-y" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="section-label mb-5">Sell Your iPhone</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-5" style={{ color: "var(--text)" }}>
                Your iPhone, turned into cash.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Fast, fair, and completely transparent. Submit your device details via WhatsApp and receive a competitive offer within 24 hours — no haggling, no hidden deductions.
              </motion.p>
              <motion.ol variants={stagger} className="space-y-4 mb-9">
                {[
                  "Share your device details via WhatsApp",
                  "Receive a fair market valuation within 24 hours",
                  "Accept the offer and arrange handover",
                  "Get paid promptly — cash or mobile money",
                ].map((step, i) => (
                  <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: "rgba(37,99,235,0.09)", color: "var(--accent)", border: "1px solid rgba(37,99,235,0.18)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{step}</span>
                  </motion.li>
                ))}
              </motion.ol>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                <Link href="/sell" className="btn-primary inline-flex">
                  Get a Valuation <ArrowRight size={15} />
                </Link>
                <Link href="/swap" className="btn-outline inline-flex">
                  Trade-In Instead
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: phone lineup with real images */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="hidden lg:grid grid-cols-3 gap-3"
            >
              {["iphone-14-pro", "iphone-13-pro", "iphone-12-pro"].map((slug, i) => {
                const phone = iphones.find(p => p.slug === slug);
                if (!phone) return null;
                return (
                  <div
                    key={slug}
                    className="rounded-2xl overflow-hidden aspect-[3/4] flex flex-col"
                    style={{
                      background: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      transform: i === 1 ? "translateY(-12px)" : "none",
                    }}
                  >
                    <div className="flex-1 relative overflow-hidden">
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        fill
                        className="object-contain"
                        style={{ padding: "12% 18%" }}
                      />
                    </div>
                    <div className="p-3 text-center border-t" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                      <div className="text-[10px] font-semibold" style={{ color: "var(--text)" }}>{phone.name}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-14 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="section-label mb-5">Customer Stories</motion.div>
              <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>
                What customers say
              </motion.h2>
              <motion.p variants={fadeUp} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Ghanaians across all 16 regions trust Ace Mobile Hub.
              </motion.p>
            </motion.div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {testimonials.map((t, i) => (
                <motion.div key={i} variants={fadeUp} className="card p-6">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} size={12} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
                      <Image src={t.image} alt={t.name} width={36} height={36} className="w-full h-full object-cover" unoptimized />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA ─────────────────────────────────────── */}
      <section className="py-20 border-t" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0B5345 0%, #075E54 100%)" }}
          >
            <div className="p-6 sm:p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-5 text-xs font-semibold tracking-widest uppercase text-white/60">
                    <MessageCircle size={12} /> WhatsApp
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Questions? We reply fast.
                  </h2>
                  <p className="text-base text-white/70 mb-7 max-w-lg">
                    Ask about a specific model, discuss installment options, or get a valuation for your current device. Our team is ready.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: "Buy an iPhone", msg: "Hello, I'd like to buy an iPhone." },
                      { label: "Sell My iPhone", msg: "Hello, I'd like to sell my iPhone." },
                      { label: "Installment Plans", msg: "Hello, I'd like to learn about installment plans." },
                      { label: "Trade-In", msg: "Hello, I'd like to trade in my iPhone." },
                    ].map((item, i) => (
                      <a
                        key={i}
                        href={getWhatsAppLink(item.msg)}
                        target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <a
                    href={getWhatsAppLink("Hello, I'm interested in Ace Mobile Hub.")}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                    style={{ background: "#25D366", color: "#fff" }}
                  >
                    <MessageCircle size={18} />
                    Start a Conversation
                  </a>
                  <div className="flex items-center justify-center lg:justify-end gap-1.5 mt-4 text-white/50 text-xs">
                    <Users size={11} />
                    Typically replies within a few minutes
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 border-t" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="section-label mb-5 justify-center">Get Started</motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text)" }}>
              Ready to find your iPhone?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-base mb-9" style={{ color: "var(--text-secondary)" }}>
              Browse the full collection or chat with us directly on WhatsApp.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3">
              <Link href="/collection" className="btn-primary">Browse iPhones <ArrowRight size={15} /></Link>
              <a href={getWhatsAppLink("Hello, I'd like to get started with Ace Mobile Hub.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Chat on WhatsApp</a>
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
              <MapPin size={13} style={{ color: "var(--accent)" }} />
              Ace Mobile Hub · Accra Circle Mall, Ghana
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
