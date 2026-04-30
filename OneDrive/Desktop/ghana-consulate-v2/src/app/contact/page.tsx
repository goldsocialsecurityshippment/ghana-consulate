import PageLayout from '@/components/PageLayout';
import { Mail, MapPin, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Contact | Honourary Consulate of Ghana, Bermuda' };

const usefulContacts = [
  { name: 'Ghana Immigration Service', desc: 'For immigration enquiries', url: 'https://home.gis.gov.gh' },
  { name: 'Ministry of Foreign Affairs, Ghana', desc: 'For diplomatic and foreign affairs matters', url: 'https://mfa.gov.gh' },
  { name: 'Ghana Investment Promotion Centre', desc: 'For trade and investment enquiries', url: 'https://gipc.gov.gh' },
  { name: 'Ghana Tourism Authority', desc: 'For travel and tourism information', url: 'https://www.ghana.travel' },
  { name: 'Bermuda Government', desc: 'Official Bermuda Government portal', url: 'https://www.gov.bm' },
];

export default function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with the Honourary Consulate of Ghana in Bermuda"
      breadcrumbs={[{ name: 'Contact' }]}
      accent="green"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact info column */}
        <div className="lg:col-span-1 space-y-5">
          <div className="card p-5 border-l-4 border-ghana-gold">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-ghana-gold flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-semibold text-ghana-black mb-0.5">Business Hours</h3>
                <p className="text-ghana-gold font-semibold text-sm">Per prior arrangement</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  All visits must be scheduled in advance. Please contact us by email to arrange an appointment.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-ghana-green">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-semibold text-ghana-black mb-0.5">Location</h3>
                <p className="text-gray-600 text-sm">Hamilton, Bermuda</p>
              </div>
            </div>
          </div>

          <div className="card p-5 border-l-4 border-ghana-red">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-ghana-red flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-serif font-semibold text-ghana-black mb-0.5">Email</h3>
                <a href="mailto:info@ghanahc.bm" className="text-ghana-red text-sm hover:underline">
                  info@ghanahc.bm
                </a>
                <p className="text-gray-500 text-xs mt-1">We aim to respond within 2 business days.</p>
              </div>
            </div>
          </div>

          {/* Useful contacts */}
          <div className="card overflow-hidden">
            <div className="bg-ghana-black px-4 py-3">
              <h3 className="font-serif font-semibold text-white text-sm">Other Useful Contacts</h3>
            </div>
            <ul className="divide-y divide-gray-50">
              {usefulContacts.map((c) => (
                <li key={c.url}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-2 px-4 py-3 hover:bg-ghana-cream transition-colors group"
                  >
                    <div>
                      <p className="text-sm text-ghana-black font-medium group-hover:text-ghana-red transition-colors">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.desc}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-ghana-red mt-0.5 flex-shrink-0 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main content column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="section-heading">Get in Touch</h2>
            <div className="section-divider" />
            <p className="text-gray-700 leading-relaxed">
              We welcome enquiries from Bermudian residents, Ghanaian nationals, and all those requiring consular assistance.
              Please contact us to schedule an appointment or to request information about our services. All visits are strictly
              by prior arrangement only.
            </p>
          </div>

          {/* Appointment notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-0.5">Appointment Required</p>
              <p className="text-amber-700 text-sm leading-relaxed">
                The Consulate operates by prior appointment only. Please contact us by email to schedule your
                appointment before visiting. Walk-in visits cannot be accommodated.
              </p>
            </div>
          </div>

          {/* Contact card */}
          <div className="card p-6 md:p-8">
            <h3 className="font-serif font-semibold text-ghana-black text-xl mb-2">Send Us an Enquiry</h3>
            <p className="text-gray-500 text-sm mb-6">
              Use your email client to contact us directly. We respond within 2 business days.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-ghana-muted rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">General Enquiries</p>
                <a href="mailto:info@ghanahc.bm" className="text-ghana-red font-medium text-sm hover:underline">
                  info@ghanahc.bm
                </a>
              </div>
              <div className="bg-ghana-muted rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">Visa Enquiries</p>
                <a href="mailto:info@ghanahc.bm?subject=Visa Enquiry" className="text-ghana-red font-medium text-sm hover:underline">
                  info@ghanahc.bm
                </a>
                <p className="text-xs text-gray-400 mt-0.5">Subject: Visa Enquiry</p>
              </div>
            </div>
            <a
              href="mailto:info@ghanahc.bm?subject=Consulate Enquiry – Appointment Request"
              className="btn-primary w-full justify-center text-sm"
            >
              <Mail className="w-4 h-4" />
              Email the Consulate
            </a>
          </div>

          {/* Ghana High Commission reference */}
          <div className="rounded-xl border border-ghana-gold/30 overflow-hidden">
            <div className="bg-ghana-gold/10 px-5 py-3 border-b border-ghana-gold/20">
              <h3 className="font-serif font-semibold text-ghana-black">Ghana High Commission – United Kingdom</h3>
            </div>
            <div className="p-5 text-sm text-gray-600 space-y-2">
              <p className="leading-relaxed">
                For matters that require the attention of the Ghana High Commission, please contact the
                Ghana High Commission in London, which has jurisdiction over Bermuda.
              </p>
              <div className="flex items-start gap-2 mt-3">
                <ExternalLink className="w-4 h-4 text-ghana-gold flex-shrink-0 mt-0.5" />
                <a
                  href="https://ghc.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ghana-red transition-colors"
                >
                  ghc.org.uk
                </a>
              </div>
            </div>
          </div>

          {/* Visa CTA */}
          <div className="bg-ghana-green rounded-xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-semibold text-white mb-1">Applying for a Ghana Visa?</h3>
              <p className="text-green-100 text-sm">View full visa requirements and application guidance.</p>
            </div>
            <Link href="/consular-services/visa-application" className="flex-shrink-0 bg-white text-ghana-green font-semibold text-sm px-5 py-2.5 rounded hover:bg-ghana-cream transition-colors">
              Visa Information →
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
