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

interface TeamData { people: { name: string; role: string }[] }

export const metadata = { title: 'Our People | The Consulate' };

export default function OurPeoplePage() {
  const { people } = getJsonContent<TeamData>('team.json');
  return (
    <PageLayout
      title="Our People"
      subtitle="The dedicated team serving the Honourary Consulate of Ghana in Bermuda"
      breadcrumbs={[{ name: 'Consulate', href: '/consulate/welcome' }, { name: 'Our People' }]}
      accent="green"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SideNav items={nav} title="The Consulate" />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <h2 className="section-heading">Meet the Team</h2>
          <div className="section-divider" />
          <p className="text-gray-600 leading-relaxed mb-8">
            Our consulate is staffed by dedicated professionals committed to delivering high-quality consular services to Ghanaians and the wider Bermudian community.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {people.map((person, i) => (
              <div key={i} className="card p-6 flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-ghana-green to-ghana-green-dark flex items-center justify-center">
                  <svg viewBox="0 0 80 80" className="w-12 h-12 opacity-70" fill="white">
                    <circle cx="40" cy="28" r="16" />
                    <path d="M10 70c0-16.6 13.4-30 30-30s30 13.4 30 30" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-ghana-black text-base leading-snug">{person.name}</h3>
                  <p className="text-ghana-red text-xs font-medium mt-0.5">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
