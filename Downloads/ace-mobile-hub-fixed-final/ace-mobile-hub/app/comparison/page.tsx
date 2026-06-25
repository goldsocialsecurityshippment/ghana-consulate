"use client";
import { useState } from "react";
import Image from "next/image";
import { Monitor, Cpu, Battery, Camera, HardDrive, Smartphone, Weight, Ruler, Calendar, ArrowRight } from "lucide-react";
import { iphones, getIPhoneBySlug } from "@/data/iphones";
import { getWhatsAppLink } from "@/lib/utils";

const specRows = [
  { key: "display", label: "Display", icon: Monitor },
  { key: "processor", label: "Processor", icon: Cpu },
  { key: "camera", label: "Camera", icon: Camera },
  { key: "battery", label: "Battery", icon: Battery },
  { key: "storage", label: "Storage", icon: HardDrive },
  { key: "os", label: "Operating System", icon: Smartphone },
  { key: "dimensions", label: "Dimensions", icon: Ruler },
  { key: "weight", label: "Weight", icon: Weight },
  { key: "year", label: "Release Year", icon: Calendar },
];

export default function ComparisonPage() {
  const [phone1, setPhone1] = useState("iphone-15-pro-max");
  const [phone2, setPhone2] = useState("iphone-14-pro-max");

  const p1 = getIPhoneBySlug(phone1);
  const p2 = getIPhoneBySlug(phone2);

  const getSpecValue = (phone: typeof p1, key: string) => {
    if (!phone) return "—";
    if (key === "storage") return (phone.storage as string[]).join(", ");
    if (key === "year") return phone.year.toString();
    return (phone as any)[key] || "—";
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-20 border-b" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-4">Side by Side</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-5">Compare iPhones</h1>
          <p className="text-lg max-w-xl" style={{ color: "var(--text-secondary)" }}>Select any two iPhone models to compare specifications side by side and make an informed decision.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[{ value: phone1, setter: setPhone1, label: "iPhone A" }, { value: phone2, setter: setPhone2, label: "iPhone B" }].map((sel, i) => (
              <div key={i}>
                <label className="form-label">{sel.label}</label>
                <select className="form-input text-base" value={sel.value} onChange={e => sel.setter(e.target.value)}>
                  {iphones.map(p => <option key={p.slug} value={p.slug}>{p.name} ({p.year})</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Device Images & Names */}
          {p1 && p2 && (
            <>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[p1, p2].map(phone => (
                  <div key={phone.slug} className="text-center">
                    <div className="w-40 h-52 relative mx-auto mb-4 rounded-xl overflow-hidden" style={{ background: "#f8faff" }}>
                      <Image src={phone.image.replace(".jpg",".svg")} alt={phone.name} fill className="object-contain p-4" />
                    </div>
                    <div className="text-sm font-bold text-[var(--text)] mb-1">{phone.name}</div>
                    <div className="text-xs" style={{ color: "var(--accent)" }}>{phone.year}</div>
                  </div>
                ))}
              </div>

              {/* Spec Table */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                {specRows.map((row, ri) => (
                  <div key={row.key} className={`grid grid-cols-3 ${ri % 2 === 0 ? "" : ""}`} style={{ background: ri % 2 === 0 ? "#0d0d0d" : "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-2 px-5 py-4 border-r" style={{ borderColor: "var(--border)" }}>
                      <row.icon size={14} style={{ color: "var(--accent)" }} />
                      <span className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                    </div>
                    {[p1, p2].map((phone, pi) => (
                      <div key={pi} className={`px-5 py-4 text-xs leading-relaxed ${pi === 0 ? "border-r" : ""}`} style={{ color: "rgba(255,255,255,0.7)", borderColor: "var(--border)" }}>
                        {getSpecValue(phone, row.key)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Color comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                {[p1, p2].map(phone => (
                  <div key={phone.slug} className="card p-5">
                    <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>{phone.name} — Available Colours</div>
                    <div className="flex flex-wrap gap-2">
                      {phone.colors.map(c => (
                        <span key={c} className="px-2.5 py-1 rounded text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.07)" }}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 mt-10 justify-center">
                <a href={getWhatsAppLink(`Hello, I've been comparing the ${p1.name} and ${p2.name}. Could you help me decide and check availability?`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Ask Our Team to Help You Decide</a>
                <a href={`/iphone/${p1.slug}`} className="btn-outline">View {p1.name} Details <ArrowRight size={14} /></a>
                <a href={`/iphone/${p2.slug}`} className="btn-outline">View {p2.name} Details <ArrowRight size={14} /></a>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
