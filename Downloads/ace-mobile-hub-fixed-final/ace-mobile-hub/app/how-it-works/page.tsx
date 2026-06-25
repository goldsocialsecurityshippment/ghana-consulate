import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, DollarSign, RefreshCw } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works | Ace Mobile Hub",
  description: "Learn how to buy, sell, or swap iPhones with Ace Mobile Hub. Simple, transparent, and professional.",
};

const processes = [
  {
    icon: ShoppingBag, label: "Buy", accentColor: "#2563EB",
    steps: [
      { title: "Browse the Collection", desc: "Explore our full range of genuine iPhones from iPhone 7 to iPhone 17 Pro Max. Every listing includes full specifications and model details." },
      { title: "Contact Ace Mobile Hub", desc: "Reach out via WhatsApp or call us at Accra Circle Mall. Our team will answer questions about availability, condition, and options." },
      { title: "Confirm Availability", desc: "We confirm your chosen model is in stock, discuss any final questions, and agree on the purchase details." },
      { title: "Receive Your Device", desc: "Collect from Accra Circle Mall, or have it delivered securely to anywhere in Ghana through our nationwide delivery network." },
    ],
    link: "/collection", linkLabel: "Browse Collection",
    whatsappMsg: "Hello, I'd like to buy an iPhone.",
  },
  {
    icon: DollarSign, label: "Sell", accentColor: "#059669",
    steps: [
      { title: "Submit Device Information", desc: "Share your iPhone model, storage, battery health, and condition via WhatsApp or our sell form. A photo may be requested." },
      { title: "Receive an Evaluation", desc: "Our team reviews your submission and provides a fair, market-informed valuation. No hidden deductions, no surprises." },
      { title: "Accept the Offer", desc: "If you're satisfied with the valuation, confirm your acceptance. There's no obligation to proceed if the offer doesn't meet expectations." },
      { title: "Complete the Sale", desc: "Arrange handover at our store or via logistics. Payment is made promptly upon receipt and verification of the device." },
    ],
    link: "/sell", linkLabel: "Sell Your iPhone",
    whatsappMsg: "Hello, I'd like to sell my iPhone.",
  },
  {
    icon: RefreshCw, label: "Swap", accentColor: "#7C3AED",
    steps: [
      { title: "Submit Your Current Device", desc: "Tell us about the iPhone you own — model, storage, condition, and battery health — and which model you'd like to upgrade to." },
      { title: "Choose Your Upgrade", desc: "Browse our available inventory and select the model you'd like. We'll confirm whether it's in stock and ready for exchange." },
      { title: "Receive a Valuation", desc: "We assess your device and provide an exchange value — the difference you'll pay (or receive) to complete the swap." },
      { title: "Complete the Exchange", desc: "Hand over your current iPhone and receive your new device. Delivery is available if you can't collect in person." },
    ],
    link: "/swap", linkLabel: "Swap Your iPhone",
    whatsappMsg: "Hello, I'd like to swap my iPhone.",
  },
];

export default function HowItWorksPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-16 border-b" style={{ background: "#fff", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="section-label mb-5">Our Process</div>
            <h1
              className="font-bold tracking-tight mb-5"
              style={{ fontSize: "clamp(2.4rem, 5vw, 3.5rem)", color: "var(--text)", lineHeight: "1.05" }}
            >
              How It Works
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Every transaction at Ace Mobile Hub follows a clear, professional process designed to protect both
              our customers and our reputation. Simple, transparent, and completed on your terms.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-20">
        {processes.map((process, pi) => (
          <section key={pi} className="border-b pb-20 last:border-0" style={{ borderColor: "var(--border)" }}>
            {/* Process header */}
            <div className="flex items-center gap-4 mb-10">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${process.accentColor}12`, border: `1px solid ${process.accentColor}25` }}
              >
                <process.icon size={20} style={{ color: process.accentColor }} />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
                  {process.label} an iPhone
                </h2>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {process.steps.map((step, si) => (
                <div key={si} className="card p-5">
                  <div
                    className="text-2xl font-bold mb-4"
                    style={{ color: `${process.accentColor}25` }}
                  >
                    0{si + 1}
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text)" }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Process CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link href={process.link} className="btn-primary">{process.linkLabel} <ArrowRight size={14} /></Link>
              <a
                href={getWhatsAppLink(process.whatsappMsg)}
                target="_blank" rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                Start on WhatsApp
              </a>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
