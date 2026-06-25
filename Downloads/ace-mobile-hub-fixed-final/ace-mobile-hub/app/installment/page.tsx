"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle, CreditCard, Shield, Home, Globe } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

const models = ["iPhone 7","iPhone 7 Plus","iPhone 8","iPhone 8 Plus","iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone 12 Mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 Mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max"];
const regions = ["Greater Accra","Ashanti","Western","Eastern","Central","Northern","Upper East","Upper West","Volta","Oti","Bono","Bono East","Ahafo","Savannah","North East","Western North"];

export default function InstallmentPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", ghanaCard:"", model:"", region:"", notes:"" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello, I'd like to apply for an iPhone installment plan.\n\nFull Name: ${form.name}\nPhone: ${form.phone}\nGhana Card Number: ${form.ghanaCard}\nDesired iPhone: ${form.model}\nRegion: ${form.region}\nNotes: ${form.notes}`;
    window.open(getWhatsAppLink(msg), "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-24 border-b" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-4">Flexible Ownership</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-6 max-w-3xl">
            Purchase Your Preferred iPhone Through Flexible Installment Plans
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Own the iPhone you want today, and spread the cost over time. Our remote application process means you can apply from anywhere in Ghana without leaving your home.
          </p>
        </div>
      </section>

      <section className="py-20 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-3">Key Details</div>
          <h2 className="text-3xl font-bold text-[var(--text)] mb-10">How the Installment Plan Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: CreditCard, title: "Valid Ghana Card Required", desc: "A valid Ghana Card is mandatory for all installment applications. This ensures security and identity verification for all parties." },
              { icon: Home, title: "Stay-At-Home Application", desc: "The entire application process is conducted remotely. No need to visit our store — apply from wherever you are in Ghana." },
              { icon: Shield, title: "Verification Process", desc: "Our team reviews your application and verifies your identity securely. You will be guided through each step." },
              { icon: Globe, title: "Nationwide Availability", desc: "Installment plans are available to eligible applicants across all regions of Ghana, with delivery to your door." },
            ].map((item, i) => (
              <div key={i} className="card p-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <item.icon size={18} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-3">Apply Now</div>
          <h2 className="text-3xl font-bold text-[var(--text)] mb-8">Installment Application</h2>
          {submitted ? (
            <div className="text-center py-16">
              <CheckCircle size={56} className="mx-auto mb-6" style={{ color: "var(--accent)" }} />
              <h3 className="text-3xl font-bold text-[var(--text)] mb-3">Application Submitted</h3>
              <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>Your installment application has been sent via WhatsApp. Our team will contact you within business hours to continue the process.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another Application</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input required className="form-input" placeholder="As it appears on your Ghana Card" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input required className="form-input" placeholder="Active phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="form-label">Ghana Card Number</label>
                <input required className="form-input" placeholder="GHA-XXXXXXXXX-X" value={form.ghanaCard} onChange={e => setForm({...form, ghanaCard: e.target.value})} />
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Required for identity verification. Your information is handled confidentially.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Desired iPhone</label>
                  <select required className="form-input" value={form.model} onChange={e => setForm({...form, model: e.target.value})}>
                    <option value="">Select iPhone model</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Your Region</label>
                  <select required className="form-input" value={form.region} onChange={e => setForm({...form, region: e.target.value})}>
                    <option value="">Select region</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Additional Notes</label>
                <textarea className="form-input min-h-[100px] resize-none" placeholder="Any additional context about your application" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn-whatsapp w-full justify-center">Submit Application via WhatsApp <ArrowRight size={16} /></button>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Approval is subject to verification. Terms and conditions apply. Our team will communicate all details.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
