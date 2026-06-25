import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Monitor, Cpu, Battery, Camera, HardDrive, Smartphone } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";
import { getIPhoneBySlug, getAllSlugs, iphones } from "@/data/iphones";

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const phone = getIPhoneBySlug(slug);
  if (!phone) return { title: "iPhone Not Found" };
  return {
    title: `${phone.name} | iPhone Collection`,
    description: phone.description,
    openGraph: { title: `${phone.name} | Ace Mobile Hub`, description: phone.description },
  };
}

export default async function IPhonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phone = getIPhoneBySlug(slug);
  if (!phone) notFound();

  const currentIndex = iphones.findIndex(p => p.slug === slug);
  const prevPhone = currentIndex > 0 ? iphones[currentIndex - 1] : null;
  const nextPhone = currentIndex < iphones.length - 1 ? iphones[currentIndex + 1] : null;

  const specs = [
    { key: "display", label: "Display", value: phone.display, icon: Monitor },
    { key: "processor", label: "Processor", value: phone.processor, icon: Cpu },
    { key: "camera", label: "Camera", value: phone.camera, icon: Camera },
    { key: "battery", label: "Battery", value: phone.battery, icon: Battery },
    { key: "storage", label: "Storage", value: phone.storage.join(" · "), icon: HardDrive },
    { key: "os", label: "OS", value: phone.os, icon: Smartphone },
  ];

  const whatsappMsg = `Hello, I'm interested in the ${phone.name}. Could you let me know about availability?`;

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* Breadcrumb */}
      <div className="pt-24 pb-0" style={{ background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-wide transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={13} /> Back to Collection
          </Link>
        </div>
      </div>

      {/* ─── Hero ─── */}
      <section className="py-14" style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 items-center">

            {/* Copy */}
            <div className="order-2 lg:order-1">
              <div className="section-label mb-5">{phone.year}</div>
              <h1
                className="font-bold tracking-tight mb-4"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", color: "var(--text)", lineHeight: "1.05" }}
              >
                {phone.name}
              </h1>
              <p className="text-lg font-medium mb-4" style={{ color: "var(--accent)" }}>
                {phone.tagline}
              </p>
              <p className="text-base leading-relaxed mb-7 max-w-xl" style={{ color: "var(--text-secondary)" }}>
                {phone.description}
              </p>

              {/* Storage options */}
              <div className="mb-7">
                <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                  Storage Options
                </div>
                <div className="flex flex-wrap gap-2">
                  {phone.storage.map(s => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded text-xs font-semibold"
                      style={{ background: "#F1F5F9", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                  Available Colours
                </div>
                <div className="flex flex-wrap gap-2">
                  {phone.colors.map(color => (
                    <span
                      key={color}
                      className="px-3 py-1.5 rounded text-xs"
                      style={{ background: "rgba(37,99,235,0.05)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={getWhatsAppLink(whatsappMsg)}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  Check Availability
                </a>
                <a
                  href={getWhatsAppLink(whatsappMsg)}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-outline"
                >
                  WhatsApp Inquiry
                </a>
              </div>
            </div>

            {/* Device image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div
                className="relative w-full max-w-xs"
                style={{
                  background: "linear-gradient(145deg, 0A1628 0%, #0D1F3C 100%)",
                  borderRadius: "24px",
                  border: "1px solid var(--border)",
                  padding: "2.5rem 2rem",
                }}
              >
                <Image
                  src={phone.image}
                  alt={`${phone.name}`}
                  width={240}
                  height={380}
                  className="w-full object-contain"
                  style={{ maxHeight: "380px" }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Quick Stats band ─── */}
      <div className="border-b" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
            {[
              { label: "Release Year", value: phone.year.toString() },
              { label: "Dimensions", value: phone.dimensions },
              { label: "Weight", value: phone.weight },
              { label: "Colours Available", value: `${phone.colors.length} options` },
            ].map(item => (
              <div key={item.label} className="py-5 px-6">
                <div className="text-base font-bold" style={{ color: "var(--text)" }}>{item.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Specs ─── */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-5">Specifications</div>
          <h2 className="text-2xl font-bold mb-10" style={{ color: "var(--text)" }}>Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map(spec => (
              <div key={spec.key} className="card p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "rgba(37,99,235,0.07)" }}
                  >
                    <spec.icon size={15} style={{ color: "var(--accent)" }} />
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                    {spec.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Deep dive ─── */}
      <section className="py-20 border-t border-b" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-5">What Sets It Apart</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Performance", content: phone.performance, icon: Cpu },
              { title: "Photography", content: phone.photography, icon: Camera },
              { title: "Battery Life", content: phone.batteryLife, icon: Battery },
            ].map(section => (
              <div key={section.title}>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "rgba(37,99,235,0.07)" }}
                >
                  <section.icon size={18} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>{section.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 p-7 rounded-xl border" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Best For
            </div>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {phone.bestFor}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Inquiry CTA ─── */}
      <section className="py-20" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--text)" }}>
            Interested in the {phone.name}?
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Reach out on WhatsApp to check availability or arrange delivery anywhere in Ghana.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={getWhatsAppLink(whatsappMsg)}
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Check Availability on WhatsApp
            </a>
            <Link href="/collection" className="btn-outline">Browse Other Models</Link>
          </div>
        </div>
      </section>

      {/* ─── Prev / Next ─── */}
      <div className="border-t" style={{ borderColor: "var(--border)", background: "#fff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex justify-between gap-4">
          {prevPhone ? (
            <Link href={`/iphone/${prevPhone.slug}`} className="flex items-center gap-3 group">
              <ArrowLeft size={14} style={{ color: "var(--accent)" }} />
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Previous</div>
                <div className="text-sm font-medium group-hover:underline" style={{ color: "var(--text)" }}>{prevPhone.name}</div>
              </div>
            </Link>
          ) : <div />}
          {nextPhone ? (
            <Link href={`/iphone/${nextPhone.slug}`} className="flex items-center gap-3 group text-right">
              <div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>Next</div>
                <div className="text-sm font-medium group-hover:underline" style={{ color: "var(--text)" }}>{nextPhone.name}</div>
              </div>
              <ArrowRight size={14} style={{ color: "var(--accent)" }} />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
