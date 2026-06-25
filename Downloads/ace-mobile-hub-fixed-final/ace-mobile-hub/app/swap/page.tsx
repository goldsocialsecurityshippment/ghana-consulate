"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/utils";

const models = ["iPhone 7","iPhone 7 Plus","iPhone 8","iPhone 8 Plus","iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone 12 Mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 Mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max"];
const storageOpts = ["32GB","64GB","128GB","256GB","512GB","1TB"];
const conditions = ["Like New","Good","Fair","Poor"];

export default function SwapPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ currentModel:"", desiredModel:"", storage:"", condition:"", notes:"" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello, I'd like to swap my iPhone.\n\nCurrent Device: ${form.currentModel}\nDesired Device: ${form.desiredModel}\nStorage Wanted: ${form.storage}\nCurrent Condition: ${form.condition}\nNotes: ${form.notes}`;
    window.open(getWhatsAppLink(msg), "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-20 border-b" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-4">Upgrade Your Device</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-5">Swap Your iPhone</h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>Trade in your current iPhone toward the model you want. We handle the valuation and the upgrade — you simply choose your next device.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {submitted ? (
            <div className="text-center py-20">
              <CheckCircle size={56} className="mx-auto mb-6" style={{ color: "var(--accent)" }} />
              <h2 className="text-3xl font-bold text-[var(--text)] mb-3">Swap Request Received</h2>
              <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>Your swap request has been sent via WhatsApp. Our team will evaluate your current device and respond with the exchange details.</p>
              <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another Request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Your Current iPhone</label>
                  <select required className="form-input" value={form.currentModel} onChange={e => setForm({...form, currentModel: e.target.value})}>
                    <option value="">Select current model</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Desired iPhone</label>
                  <select required className="form-input" value={form.desiredModel} onChange={e => setForm({...form, desiredModel: e.target.value})}>
                    <option value="">Select desired model</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Desired Storage</label>
                  <select required className="form-input" value={form.storage} onChange={e => setForm({...form, storage: e.target.value})}>
                    <option value="">Select storage</option>
                    {storageOpts.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Current Device Condition</label>
                  <select required className="form-input" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                    <option value="">Select condition</option>
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Additional Notes</label>
                <textarea className="form-input min-h-[120px] resize-none" placeholder="Any additional details about your current device or preferred upgrade options" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <button type="submit" className="btn-whatsapp w-full justify-center">Submit Swap Request via WhatsApp <ArrowRight size={16} /></button>
            </form>
          )}
        </div>
      </section>

      <section className="py-16 border-t" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-10 text-center">How the Swap Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[["Submit Device","Tell us about your current iPhone and the model you want."],["Choose Upgrade","Browse available models and confirm your preferred upgrade."],["Receive Valuation","We assess your current device and provide an exchange value."],["Complete Exchange","Confirm the deal, hand over your device, and receive the upgrade."]].map(([title,desc],i) => (
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
