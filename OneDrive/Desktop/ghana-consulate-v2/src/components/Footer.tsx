import Link from 'next/link';
import { MapPin, Mail, Clock } from 'lucide-react';
import GhanaCoatOfArms from './GhanaCoatOfArms';

const usefulLinks = [
  { name: 'Home', href: '/' },
  { name: 'The Consulate', href: '/consulate/welcome' },
  { name: 'Visa Application', href: '/consular-services/visa-application' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

const exploreGhana = [
  { name: 'The Presidency', href: 'https://presidency.gov.gh/' },
  { name: 'Official Government Website', href: 'https://www.ghana.gov.gh/' },
  { name: 'Ghana Investment Promotion Centre', href: 'https://gipc.gov.gh/' },
  { name: 'Ghana Tourism Authority', href: 'https://www.ghana.travel/' },
  { name: 'Economy & Trade', href: 'https://ghanatrade.com.gh/' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ghana-black text-white">
      <div className="ghana-stripe" />
      <div className="page-container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex-shrink-0 opacity-90">
                <GhanaCoatOfArms />
              </div>
              <div>
                <div className="font-serif font-semibold text-white leading-tight text-sm">
                  Honourary Consulate of Ghana
                </div>
                <div className="text-ghana-gold text-xs leading-tight">Hamilton, Bermuda</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Representing the Republic of Ghana in Bermuda. Committed to serving Ghanaians and the Bermudian community.
            </p>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4 pb-2 border-b border-gray-700">
              Business Hours
            </h3>
            <div className="flex items-start gap-2.5 text-gray-300">
              <Clock className="w-4 h-4 mt-0.5 text-ghana-gold flex-shrink-0" />
              <div>
                <p className="font-medium text-white text-sm">By Appointment Only</p>
                <p className="text-sm mt-0.5 text-ghana-gold font-medium">Per prior arrangement</p>
                <p className="text-xs text-gray-400 mt-1">Contact us to arrange an appointment.</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-ghana-gold flex-shrink-0" />
                <span className="text-gray-300 text-sm">Hamilton, Bermuda</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 text-ghana-gold flex-shrink-0" />
                <a href="mailto:info@ghanahc.bm" className="text-gray-300 hover:text-ghana-gold text-sm transition-colors">
                  info@ghanahc.bm
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4 pb-2 border-b border-gray-700">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-ghana-gold text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-ghana-gold opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Ghana */}
          <div>
            <h3 className="font-serif font-semibold text-white text-lg mb-4 pb-2 border-b border-gray-700">
              Explore Ghana
            </h3>
            <ul className="space-y-2">
              {exploreGhana.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-ghana-gold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-ghana-gold opacity-60 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="page-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {year} Ghana Consulate, Bermuda. We accept no responsibility for external links.
          </p>
          <p className="text-gray-600 text-xs">Freedom and Justice</p>
        </div>
      </div>
    </footer>
  );
}
