"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, MessageCircle, CheckCircle } from "lucide-react";
import { PHONE_NUMBER, BUSINESS_ADDRESS, getWhatsAppLink } from "@/lib/utils";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", phone:"", subject:"", message:"" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello, I'm contacting Ace Mobile Hub.\n\nName: ${form.name}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\nMessage: ${form.message}`;
    window.open(getWhatsAppLink(msg), "_blank");
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <section className="pt-36 pb-20 border-b" style={{ borderColor: "var(--border)", background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="section-label mb-4">Reach Us</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--text)] mb-5">Contact Ace Mobile Hub</h1>
          <p className="text-lg max-w-xl" style={{ color: "var(--text-secondary)" }}>We're here to help with purchases, valuations, swap enquiries, or any other questions about our services.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-8">Get in Touch</h2>
              <div className="space-y-6 mb-10">
                {[
                  { icon: Phone, label: "Phone", value: PHONE_NUMBER, href: `tel:${PHONE_NUMBER}` },
                  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us on WhatsApp", href: getWhatsAppLink("Hello, I'd like to get in touch with Ace Mobile Hub.") },
                  { icon: MapPin, label: "Location", value: BUSINESS_ADDRESS, href: "https://maps.google.com/?q=Accra+Circle+Mall+Ghana" },
                ].map((item, i) => (
                  <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.12)" }}>
                      <item.icon size={17} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>{item.label}</div>
                      <div className="text-sm text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="rounded-lg p-6 border mb-8" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={16} style={{ color: "var(--accent)" }} />
                  <span className="text-sm font-semibold text-[var(--text)]">Business Hours</span>
                </div>
                <div className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex justify-between">
                    <span>Monday – Friday</span><span>9:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span><span>9:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span><span className="font-medium" style={{ color: "#EF4444" }}>Closed</span>
                  </div>
                </div>
              </div>

              {/* Map embed */}
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9!2d-0.2136!3d5.5502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2d34cf%3A0xd3a5e0df3e5a6a8f!2sCircle%20Mall%2C%20Accra!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%" height="250" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85)" }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Ace Mobile Hub location at Accra Circle Mall"
                />
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)] mb-8">Send a Message</h2>
              {submitted ? (
                <div className="text-center py-16">
                  <CheckCircle size={48} className="mx-auto mb-5" style={{ color: "var(--accent)" }} />
                  <h3 className="text-2xl font-bold text-[var(--text)] mb-3">Message Sent</h3>
                  <p className="text-base mb-6" style={{ color: "var(--text-secondary)" }}>Your message has been sent via WhatsApp. We'll respond within business hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input required className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input required className="form-input" placeholder="Your phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Subject</label>
                    <input required className="form-input" placeholder="What is this regarding?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Message</label>
                    <textarea required className="form-input min-h-[160px] resize-none" placeholder="How can we help you?" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-whatsapp w-full justify-center">Send via WhatsApp</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
