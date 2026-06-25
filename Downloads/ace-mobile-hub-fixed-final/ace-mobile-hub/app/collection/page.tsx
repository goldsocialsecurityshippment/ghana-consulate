import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { iphones } from "@/data/iphones";
import { getWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "iPhone Collection | Ace Mobile Hub",
  description: "Browse our complete collection of genuine iPhones — from iPhone SE to iPhone 17 Pro Max. Available at Ace Mobile Hub, Accra Circle Mall.",
};

const series = [
  { label: "iPhone 17 Series", year: "2025", slugs: ["iphone-17", "iphone-17-air", "iphone-17-pro", "iphone-17-pro-max", "iphone-17e"] },
  { label: "iPhone 16 Series", year: "2024", slugs: ["iphone-16", "iphone-16-plus", "iphone-16-pro", "iphone-16-pro-max"] },
  { label: "iPhone 15 Series", year: "2023", slugs: ["iphone-15", "iphone-15-plus", "iphone-15-pro", "iphone-15-pro-max"] },
  { label: "iPhone 14 Series", year: "2022", slugs: ["iphone-14", "iphone-14-plus", "iphone-14-pro", "iphone-14-pro-max"] },
  { label: "iPhone 13 Series", year: "2021", slugs: ["iphone-13-mini", "iphone-13", "iphone-13-pro", "iphone-13-pro-max"] },
  { label: "iPhone 12 Series", year: "2020", slugs: ["iphone-12-mini", "iphone-12", "iphone-12-pro", "iphone-12-pro-max"] },
  { label: "iPhone 11 Series", year: "2019", slugs: ["iphone-11", "iphone-11-pro", "iphone-11-pro-max"] },
  { label: "iPhone X Series", year: "2017–2018", slugs: ["iphone-x", "iphone-xr", "iphone-xs", "iphone-xs-max"] },
  { label: "iPhone 8 & 7 Series", year: "2016–2017", slugs: ["iphone-7", "iphone-7-plus", "iphone-8", "iphone-8-plus"] },
  { label: "SE Series", year: "2016–2022", slugs: ["iphone-se-1st-gen", "iphone-se-2nd-gen", "iphone-se-3rd-gen"] },
];

export default function CollectionPage() {
  return (
    <div style={{ background: "var(--bg)" }}>

      {/* Page header */}
      <section
        className="pt-36 pb-16 border-b"
        style={{ background: "#fff", borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="section-label mb-5">Complete Lineup</div>
            <h1 className="font-bold tracking-tight mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "var(--text)" }}>
              iPhone Collection
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Genuine iPhones from SE to iPhone 17 Pro Max. Every model verified authentic —
              available to buy, trade-in, or own through an installment plan.
            </p>
          </div>
        </div>
      </section>

      {/* Series sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20">
        {series.map(({ label, year, slugs }) => {
          const phones = iphones.filter(p => slugs.includes(p.slug));
          if (phones.length === 0) return null;
          return (
            <div key={label}>
              {/* Series header */}
              <div className="flex items-baseline justify-between mb-8 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{label}</h2>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>{year}</span>
                </div>
                <a
                  href={getWhatsAppLink(`Hello, I'm interested in the ${label}.`)}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: "var(--accent)" }}
                >
                  Inquire about this series <ArrowRight size={11} />
                </a>
              </div>

              {/* Phone grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {phones.map(phone => (
                  <Link key={phone.slug} href={`/iphone/${phone.slug}`} className="phone-card group block">
                    {/* Image area — bg matches card so no visible box */}
                    <div
                      className="relative overflow-hidden flex items-center justify-center"
                      style={{ background: "var(--card-bg)", height: "220px" }}
                    >
                      <Image
                        src={phone.image}
                        alt={phone.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        style={{ padding: "8% 12%", filter: "drop-shadow(0 8px 20px rgba(15,23,42,0.13))" }}
                      />
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                        {phone.name}
                      </h3>
                      <p className="text-xs mb-1 leading-snug" style={{ color: "var(--text-secondary)" }}>
                        {phone.display.split(",")[0]}
                      </p>
                      <p className="text-xs mb-3 italic" style={{ color: "var(--text-muted)" }}>
                        {phone.tagline}
                      </p>

                      {/* Storage chips */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {phone.storage.slice(0, 3).map(s => (
                          <span
                            key={s}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ background: "#F1F5F9", color: "var(--text-secondary)" }}
                          >
                            {s}
                          </span>
                        ))}
                        {phone.storage.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ color: "var(--text-muted)" }}>
                            +{phone.storage.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                        View Details <ArrowRight size={11} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <section className="border-t py-16" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text)" }}>
            Can&rsquo;t find the model you&rsquo;re looking for?
          </h2>
          <p className="text-base mb-7" style={{ color: "var(--text-secondary)" }}>
            Our inventory updates regularly. Reach out on WhatsApp and we&rsquo;ll let you know about availability.
          </p>
          <a
            href={getWhatsAppLink("Hello, I'm looking for a specific iPhone model. Can you help?")}
            target="_blank" rel="noopener noreferrer"
            className="btn-whatsapp inline-flex"
          >
            Ask About Availability
          </a>
        </div>
      </section>
    </div>
  );
}
