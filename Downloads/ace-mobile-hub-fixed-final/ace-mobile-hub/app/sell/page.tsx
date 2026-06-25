"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

const models = ["iPhone 7","iPhone 7 Plus","iPhone 8","iPhone 8 Plus","iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone 12 Mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 Mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max"];
const storageOpts = ["16GB","32GB","64GB","128GB","256GB","512GB","1TB"];
const conditions = ["Brand New","Like New (minimal use)","Good (minor scratches)","Fair (visible wear)","Poor (significant damage)"];

export default function SellPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", model:"", storage:"", battery:"", condition:"", notes:"" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello, I'd like to sell my iPhone.\n\nName: ${form.name}\nPhone: ${form.phone}\nModel: ${form.model}\nStorage: ${form.storage}\nBattery Health: ${form.battery}%\nCondition: ${form.condition}\nNotes: ${form.notes}`;
    window.open(getWhatsAppLink(msg), "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-20 border-b" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 max-w-3xl">
          <div className="section-label mb-4">Sell Your Device</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-5">Sell Your iPhone</h1>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Submit your device information and receive a competitive evaluation from our team. Secure, transparent, and straightforward.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {submitted ? (
            <div className="text-center py-20">
              <CheckCircle size={56} className="mx-auto mb-6" style={{ color: "var(--accent)" }} />
              <h2 className="text-3xl font-bold text-[var(--text)] mb-3">Submission Received</h2>
              <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>Your device information has been sent via WhatsApp. Our team will review it and respond with an evaluation shortly.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another Device</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input required className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input required className="form-input" placeholder="e.g. 0541234567" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">iPhone Model</label>
                  <select required className="form-input" value={form.model} onChange={e => setForm({...form, model: e.target.value})}>
                    <option value="">Select model</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Storage Capacity</label>
                  <select required className="form-input" value={form.storage} onChange={e => setForm({...form, storage: e.target.value})}>
                    <option value="">Select storage</option>
                    {storageOpts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Battery Health (%)</label>
                  <input required type="number" min="1" max="100" className="form-input" placeholder="e.g. 87" value={form.battery} onChange={e => setForm({...form, battery: e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Device Condition</label>
                  <select required className="form-input" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                    <option value="">Select condition</option>
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Additional Notes</label>
                <textarea className="form-input min-h-[120px] resize-none" placeholder="Any additional information about your device (accessories included, original box, known issues, etc.)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn-whatsapp w-full justify-center">
                Submit via WhatsApp <ArrowRight size={16} />
              </button>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Your information will be sent via WhatsApp. Our team responds within business hours.</p>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-10 text-center">How the Process Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[["Submit Info","Complete the form above with your device details."],["Receive Evaluation","Our team reviews and sends you a fair market valuation."],["Accept Offer","If you're satisfied, confirm acceptance to proceed."],["Complete Sale","Arrange handover or delivery and receive payment."]].map(([title,desc],i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold" style={{ background: "rgba(201,168,76,0.1)", color: "var(--accent)", border: "1px solid rgba(201,168,76,0.2)" }}>{i+1}</div>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
