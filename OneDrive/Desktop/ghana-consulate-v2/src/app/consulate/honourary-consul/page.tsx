import PageLayout from '@/components/PageLayout';
import SideNav from '@/components/SideNav';
import { getJsonContent } from '@/lib/content';

const nav = [
  { name: 'Welcome Message', href: '/consulate/welcome' },
  { name: 'Our Honorary Consul', href: '/consulate/honourary-consul' },
  { name: 'Former Honorary Consul', href: '/consulate/former-consul' },
  { name: 'Our People', href: '/consulate/our-people' },
  { name: 'Useful Links', href: '/consulate/useful-links' },
];

interface ConsulData {
  current: {
    name: string;
    title: string;
    appointedYear: string;
    bio: string[];
  };
}

export const metadata = { title: 'Our Honorary Consul | The Consulate' };

export default function HonouraryConsulPage() {
  const { current: consul } = getJsonContent<ConsulData>('consul.json');
  return (
    <PageLayout
      title="Our Honorary Consul"
      subtitle="Honourary Consulate of Ghana, Hamilton Bermuda"
      breadcrumbs={[{ name: 'Consulate', href: '/consulate/welcome' }, { name: 'Our Honorary Consul' }]}
      accent="gold"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SideNav items={nav} title="The Consulate" />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            {/* Placeholder avatar */}
            <div className="flex-shrink-0 w-48 h-56 rounded-lg bg-gradient-to-br from-ghana-green to-ghana-green-dark flex items-center justify-center shadow-card">
              <svg viewBox="0 0 80 90" className="w-28 h-28 opacity-60" fill="white">
                <circle cx="40" cy="28" r="20" />
                <path d="M5 80c0-19.3 15.7-35 35-35s35 15.7 35 35" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ghana-black mb-1">{consul.name}</h2>
              <p className="text-ghana-red font-semibold text-base mb-1">{consul.title}</p>
              <p className="text-gray-500 text-sm mb-4">Appointed {consul.appointedYear} · Hamilton, Bermuda</p>
              <div className="flex gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-ghana-red" />
                <div className="h-1.5 flex-1 rounded-full bg-ghana-gold" />
                <div className="h-1.5 flex-1 rounded-full bg-ghana-green" />
              </div>
            </div>
          </div>

          <div className="section-divider" />

          <div className="space-y-4">
            {consul.bio.map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
