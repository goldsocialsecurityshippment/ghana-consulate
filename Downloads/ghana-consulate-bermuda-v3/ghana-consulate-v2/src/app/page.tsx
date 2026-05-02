'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, FileText, Users, HelpCircle, Newspaper, Globe, Clock, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'H.E. John Dramani Mahama',
    subtitle: 'President of the Republic of Ghana',
    bg: 'from-ghana-black to-ghana-green-dark',
    image: '/president.png',
  },
  {
    id: 2,
    title: 'Hon. Samuel Okudzeto Ablakwa',
    subtitle: 'Minister of Foreign Affairs, Republic of Ghana',
    bg: 'from-ghana-black to-blue-900',
    image: '/minister.png',
  },
  {
    id: 3,
    title: 'H.E. Mrs. Sabah Zita Benson',
    subtitle: 'High Commissioner, Ghana High Commission UK',
    bg: 'from-ghana-black to-ghana-red-dark',
    image: '/highcommissioner.png',
  },
  {
    id: 4,
    title: 'Ronita Teye-Botchway',
    subtitle: 'Honorary Consul of Ghana, Bermuda',
    bg: 'from-ghana-black to-ghana-green-dark',
    image: '/consul.png',
  },
];
function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative min-h-[560px] md:min-h-[620px] flex items-center overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`} />

      {/* Flag stripe */}
      <div className="absolute left-0 top-0 bottom-0 flex">
        <div className="w-1.5 bg-ghana-red opacity-80" />
        <div className="w-1.5 bg-ghana-gold opacity-80" />
        <div className="w-1.5 bg-ghana-green opacity-80" />
      </div>

      {/* Kente pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <pattern id="kente" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="10" height="10" fill="#D4A017" />
            <rect x="10" y="10" width="10" height="10" fill="#D4A017" />
            <rect x="0" y="10" width="10" height="10" fill="#006B3F" />
            <rect x="10" y="0" width="10" height="10" fill="#CF0A0A" />
          </pattern>
          <rect width="100" height="100" fill="url(#kente)" />
        </svg>
      </div>

     {/* Slide image */}
<div className="absolute right-0 top-0 bottom-0 w-2/5 hidden lg:block">
  <img
    src={slide.image}
    alt={slide.title}
    className="w-full h-full object-cover object-top opacity-40"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-ghana-black via-transparent to-transparent" />
</div>

      {/* Content */}
      <div className="relative z-10 page-container py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <span className="text-sm text-ghana-gold font-medium">🇬🇭 Republic of Ghana</span>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-sm text-gray-300">Hamilton, Bermuda</span>
          </div>

          <p className="text-ghana-gold font-semibold text-sm uppercase tracking-widest mb-2">
            Welcome to the Honourary Consulate of Ghana
          </p>

          <h1 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-tight mb-2 transition-all duration-500">
            {slide.title}
          </h1>
          <p className="text-ghana-gold text-lg mb-6 font-medium">{slide.subtitle}</p>

          <p className="text-gray-300 leading-relaxed max-w-xl mb-8">
            Over the years since its formation, the Consulate has served Ghanaians and the Bermudian community in diverse ways and continually seeks ways to improve on its service.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://dashboard.ecimsglobal.com/#/login"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm md:text-base px-6 py-3"
            >
              Apply for Visa <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/consulate/welcome" className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded text-sm md:text-base font-medium hover:bg-white/10 transition-colors">
              Welcome Message
            </Link>
          </div>
        </div>
      </div>

      {/* Slider controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-ghana-gold w-6' : 'bg-white/40'}`}
          />
        ))}
      </div>

      {/* Straight bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
    </section>
  );
}

function QuickLinks() {
  const links = [
    {
      title: 'Visa Application',
      description: 'Apply for a Ghana visa. View entry requirements, conditions, and exemptions.',
      href: 'https://dashboard.ecimsglobal.com/#/login',
      external: true,
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-ghana-red',
    },
    {
      title: 'The Consulate',
      description: 'Meet the Honorary Consul, learn about our team, and read the welcome message.',
      href: '/consulate/welcome',
      external: false,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-ghana-green',
    },
    {
      title: 'FAQs',
      description: 'Find answers to frequently asked questions about visas and consular services.',
      href: '/faqs',
      external: false,
      icon: <HelpCircle className="w-6 h-6 text-white" />,
      color: 'bg-ghana-gold',
    },
    {
      title: 'News',
      description: 'Stay up to date with the latest news and announcements from the Consulate.',
      href: '/news',
      external: false,
      icon: <Newspaper className="w-6 h-6 text-white" />,
      color: 'bg-gray-700',
    },
  ];

  return (
    <section className="py-14 md:py-20 bg-ghana-muted">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="section-heading">How Can We Help?</h2>
          <div className="section-divider mx-auto" />
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
            The Consulate provides a range of services for Ghanaians and those with an interest in Ghana.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card group p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <h3 className="font-serif font-semibold text-ghana-black text-lg group-hover:text-ghana-red transition-colors">{link.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{link.description}</p>
                <div className="flex items-center gap-1.5 text-ghana-red text-sm font-medium">
                  Apply now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="card group p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${link.color} group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <h3 className="font-serif font-semibold text-ghana-black text-lg group-hover:text-ghana-red transition-colors">{link.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{link.description}</p>
                <div className="flex items-center gap-1.5 text-ghana-red text-sm font-medium">
                  Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function WelcomeStrip() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="page-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-ghana-red text-sm font-semibold uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ghana-black leading-tight mb-4">
              Serving Ghana &amp; Bermuda
            </h2>
            <div className="w-16 h-1 bg-ghana-gold mb-6 rounded-full" />
            <p className="text-gray-600 leading-relaxed mb-4">
              The Honourary Consulate of Ghana in Bermuda serves as an important link between the Republic of Ghana
              and the island of Bermuda. We are dedicated to supporting Ghanaians living and working in Bermuda,
              and to fostering strong people-to-people connections between our two communities.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our services cover visa applications, welfare support for Ghanaian nationals, promotion of Ghana as
              a tourist and investment destination, and facilitation of official consular duties.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/consulate/welcome" className="btn-primary">
                Read Welcome Message <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn-outline">Contact Us</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Globe className="w-6 h-6 text-ghana-red" />, title: 'Visa Services', desc: 'Assistance with Ghana visa applications for residents of Bermuda.' },
              { icon: <Users className="w-6 h-6 text-ghana-green" />, title: 'Community Welfare', desc: 'Supporting Ghanaians in Bermuda with welfare and consular assistance.' },
              { icon: <FileText className="w-6 h-6 text-ghana-gold" />, title: 'Official Representation', desc: "Representing Ghana's interests and promoting bilateral relations." },
              { icon: <Clock className="w-6 h-6 text-gray-500" />, title: 'By Appointment', desc: 'All services are available per prior arrangement. Contact us to schedule.' },
            ].map((c, i) => (
              <div key={i} className="card p-5 flex flex-col gap-3">
                <div className="w-11 h-11 rounded-lg bg-ghana-cream flex items-center justify-center">{c.icon}</div>
                <h3 className="font-serif font-semibold text-ghana-black text-sm">{c.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GhanaCallout() {
  return (
    <section className="py-12 bg-ghana-green">
      <div className="page-container text-center">
        <p className="text-ghana-gold text-sm font-semibold uppercase tracking-widest mb-3">Republic of Ghana</p>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-4">"Freedom and Justice"</h2>
        <p className="text-green-100 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-6">
          Ghana is a vibrant, democratic nation in West Africa. Discover investment opportunities,
          tourism, trade, and the rich culture of Ghana.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="https://gipc.gov.gh/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ghana-gold text-ghana-black font-semibold px-5 py-2.5 rounded hover:bg-ghana-gold-light transition-colors text-sm">
            Invest in Ghana <ArrowRight className="w-4 h-4" />
          </a>
          <a href="https://www.ghana.travel/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/40 text-white px-5 py-2.5 rounded hover:bg-white/10 transition-colors text-sm">
            Tourism in Ghana
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactStrip() {
  return (
    <section className="py-10 bg-white border-t border-gray-100">
      <div className="page-container">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div>
            <h3 className="font-serif font-semibold text-ghana-black text-xl mb-1">Need Assistance?</h3>
            <p className="text-gray-600 text-sm">Contact us to schedule an appointment or request information.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-ghana-gold" />Per prior arrangement</span>
            <a href="mailto:info@ghanahc.bm" className="flex items-center gap-2 hover:text-ghana-red transition-colors">
              <Mail className="w-4 h-4 text-ghana-red" />info@ghanahc.bm
            </a>
          </div>
          <Link href="/contact" className="btn-primary flex-shrink-0">
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <QuickLinks />
      <WelcomeStrip />
      <GhanaCallout />
      <ContactStrip />
    </>
  );
}
