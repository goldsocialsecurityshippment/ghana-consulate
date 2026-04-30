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
  former: {
    name: string;
    credentials: string;
    passedAway: string;
    sections: { heading: string; content: string }[];
  };
}

export const metadata = { title: 'Former Honorary Consul | The Consulate' };

export default function FormerConsulPage() {
  const { former } = getJsonContent<ConsulData>('consul.json');
  return (
    <PageLayout
      title="Former Honorary Consul"
      subtitle="In memory of Dr. Leonard Teye-Botchway"
      breadcrumbs={[{ name: 'Consulate', href: '/consulate/welcome' }, { name: 'Former Honorary Consul' }]}
      accent="gold"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SideNav items={nav} title="The Consulate" />
          </div>
        </aside>
        <div className="lg:col-span-3">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="flex-shrink-0 w-48 h-56 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-card">
              <svg viewBox="0 0 80 90" className="w-28 h-28 opacity-50" fill="white">
                <circle cx="40" cy="28" r="20" />
                <path d="M5 80c0-19.3 15.7-35 35-35s35 15.7 35 35" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ghana-black mb-1">{former.name}</h2>
              <p className="text-ghana-red text-sm font-medium mb-1">First Honorary Consul of Ghana in Bermuda</p>
              <p className="text-gray-400 text-xs italic mb-2">{former.credentials}</p>
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
                Passed away {former.passedAway}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {former.sections.map((section, i) => (
              <div key={i}>
                <h3 className="font-serif font-semibold text-ghana-black text-xl mb-3 pb-2 border-b border-ghana-gold/30">
                  {section.heading}
                </h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-ghana-green text-white rounded-xl">
            <p className="font-serif text-lg italic text-center text-green-100">
              "His dedication to Ghana, to Bermuda, and to the people he served continues to inspire the work of the Consulate today."
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
