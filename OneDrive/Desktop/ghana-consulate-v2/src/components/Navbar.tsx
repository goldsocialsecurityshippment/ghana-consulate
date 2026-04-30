'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import GhanaCoatOfArms from './GhanaCoatOfArms';

const navigation = [
  { name: 'Home', href: '/' },
  {
    name: 'Consular',
    href: '/consular-services/visa-application',
    children: [
      { name: 'Visa Application', href: '/consular-services/visa-application' },
    ],
  },
  {
    name: 'About',
    href: '#',
    children: [
      { name: 'The Presidency', href: 'https://presidency.gov.gh/', external: true },
      { name: 'Official Website', href: 'https://www.ghana.gov.gh/', external: true },
      { name: 'Invest in Ghana', href: 'https://gipc.gov.gh/', external: true },
      { name: 'Tourism', href: 'https://www.ghana.travel/', external: true },
      { name: 'Economy & Trade', href: 'https://ghanatrade.com.gh/', external: true },
    ],
  },
  { name: 'FAQs', href: '/faqs' },
  { name: 'News', href: '/news' },
  {
    name: 'Consulate',
    href: '/consulate/welcome',
    children: [
      { name: 'Welcome Message', href: '/consulate/welcome' },
      { name: 'Our Honorary Consul', href: '/consulate/honourary-consul' },
      { name: 'Former Honorary Consul', href: '/consulate/former-consul' },
      { name: 'Our People', href: '/consulate/our-people' },
      { name: 'Useful Links', href: '/consulate/useful-links' },
    ],
  },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="ghana-stripe" />
      <div className="page-container">
        <div className="flex items-center justify-between h-[68px] md:h-[75px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
              <GhanaCoatOfArms />
            </div>
            <div>
              <div className="font-serif font-semibold text-ghana-black text-sm md:text-base leading-tight">
                Honourary Consulate of Ghana
              </div>
              <div className="text-ghana-green text-xs md:text-sm leading-tight font-medium">
                Hamilton, Bermuda
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="nav-item relative">
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors
                      ${isActive(item.href) ? 'text-ghana-red' : 'text-gray-700 hover:text-ghana-red'}`}
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                  <div className="dropdown-menu absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                    {item.children.map((child) =>
                      'external' in child && child.external ? (
                        <a
                          key={child.href}
                          href={child.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-ghana-cream hover:text-ghana-red transition-colors"
                        >
                          {child.name}
                        </a>
                      ) : (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm transition-colors
                            ${isActive(child.href) ? 'bg-ghana-cream text-ghana-red font-medium border-l-4 border-ghana-red' : 'text-gray-700 hover:bg-ghana-cream hover:text-ghana-red'}`}
                        >
                          {child.name}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors
                    ${isActive(item.href) ? 'text-ghana-red' : 'text-gray-700 hover:text-ghana-red'}`}
                >
                  {item.name}
                </Link>
              )
            )}
            <Link href="/consular-services/visa-application" className="ml-2 btn-primary text-xs">
              Apply for Visa
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded text-gray-600 hover:text-ghana-red hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="page-container py-3 flex flex-col gap-0.5">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.name ? null : item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors ${isActive(item.href) ? 'text-ghana-red' : 'text-gray-700'}`}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileExpanded === item.name && (
                    <div className="ml-4 border-l-2 border-ghana-gold/40 pl-3 mb-1 flex flex-col gap-0.5">
                      {item.children.map((child) =>
                        'external' in child && child.external ? (
                          <a
                            key={child.href}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2 rounded text-sm text-gray-600 hover:text-ghana-red transition-colors"
                          >
                            {child.name}
                          </a>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 rounded text-sm transition-colors ${isActive(child.href) ? 'text-ghana-red font-medium' : 'text-gray-600 hover:text-ghana-red'}`}
                          >
                            {child.name}
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${isActive(item.href) ? 'text-ghana-red' : 'text-gray-700 hover:text-ghana-red'}`}
                >
                  {item.name}
                </Link>
              )
            )}
            <div className="pt-2 pb-1">
              <Link href="/consular-services/visa-application" className="btn-primary w-full justify-center text-sm">
                Apply for Visa
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
