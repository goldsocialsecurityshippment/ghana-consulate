import PageLayout from '@/components/PageLayout';
import SideNav from '@/components/SideNav';
import { getJsonContent } from '@/lib/content';
import { ExternalLink } from 'lucide-react';

const nav = [
  { name: 'Welcome Message', href: '/consulate/welcome' },
  { name: 'Our Honorary Consul', href: '/consulate/honourary-consul' },
  { name: 'Former Honorary Consul', href: '/consulate/former-consul' },
  { name: 'Our People', href: '/consulate/our-people' },
  { name: 'Useful Links', href: '/consulate/useful-links' },
];

interface LinkGroup { category: string; links: { name: string; url: string }[] }
interface LinksData { ghanaLinks: LinkGroup[]; bermudaLinks: LinkGroup[] }

export const metadata = { title: 'Useful Links | The Consulate' };

function LinkSection({ group }: { group: LinkGroup }) {
  return (
    <div className="mb-6">
      <h3 className="font-serif font-semibold text-ghana-black text-base mb-3 pb-1.5 border-b border-ghana-gold/30">
        {group.category}
      </h3>
      <ul className="space-y-2">
        {group.links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-ghana-red transition-colors group"
            >
              <ExternalLink className="w-3.5 h-3.5 text-ghana-gold flex-shrink-0" />
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UsefulLinksPage() {
  const data = getJsonContent<LinksData>('useful-links.json');
  return (
    <PageLayout
      title="Useful Links"
      subtitle="A curated collection of useful links for Ghana and Bermuda"
      breadcrumbs={[{ name: 'Consulate', href: '/consulate/welcome' }, { name: 'Useful Links' }]}
      accent="gold"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SideNav items={nav} title="The Consulate" />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ghana links */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-ghana-black mb-4 flex items-center gap-2">
                <span className="w-4 h-4 inline-block rounded-sm bg-ghana-green" />
                Ghana
              </h2>
              {data.ghanaLinks.map((g, i) => <LinkSection key={i} group={g} />)}
            </div>
            {/* Bermuda links */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-ghana-black mb-4 flex items-center gap-2">
                <span className="w-4 h-4 inline-block rounded-sm bg-blue-600" />
                Bermuda
              </h2>
              {data.bermudaLinks.map((g, i) => <LinkSection key={i} group={g} />)}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-8 pt-4 border-t border-gray-100">
            The Consulate accepts no responsibility for the content of external links.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
