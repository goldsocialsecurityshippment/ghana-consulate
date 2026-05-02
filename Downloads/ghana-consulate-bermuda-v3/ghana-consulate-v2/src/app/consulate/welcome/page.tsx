import PageLayout from '@/components/PageLayout';
import SideNav from '@/components/SideNav';
import Link from 'next/link';

const consultateNav = [
  { name: 'Welcome Message', href: '/consulate/welcome' },
  { name: 'Our Honorary Consul', href: '/consulate/honourary-consul' },
  { name: 'Former Honorary Consul', href: '/consulate/former-consul' },
  { name: 'Our People', href: '/consulate/our-people' },
  { name: 'Useful Links', href: '/consulate/useful-links' },
];

export const metadata = { title: 'Welcome Message | The Consulate' };

export default function WelcomePage() {
  return (
    <PageLayout
      title="Welcome Message"
      subtitle="From the Honourary Consulate of Ghana, Hamilton Bermuda"
      breadcrumbs={[{ name: 'Consulate', href: '/consulate/welcome' }, { name: 'Welcome Message' }]}
      accent="gold"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SideNav items={consultateNav} title="The Consulate" />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="font-serif text-3xl font-semibold text-ghana-gold mb-2">Akwaaba!</h2>
            <div className="w-16 h-1 bg-ghana-gold rounded-full mb-6" />
          </div>
          <div className="prose-content space-y-5 text-gray-700 leading-relaxed">
            <p>
              I take this opportunity to welcome you to this website for the Honourary Consulate of Ghana in Bermuda. Over the years since its formation, the Consulate has served Ghanaians and the Bermudian community in diverse ways and continually seeks ways to improve on its service.
            </p>
            <p>
              This website is to serve as an online presence to continue to serve you and most importantly bring information and our services to your doorstep. The Consulate will be using the website to provide you with information useful for anyone with an association or interest in Ghana.
            </p>
            <p>
              The website covers information tailored to respond to the main queries we receive at the Consulate. There is also information about Ghana specifically — including{' '}
              <a href="https://www.presidency.gov.gh/" target="_blank" rel="noopener noreferrer" className="text-ghana-red hover:underline">The Presidency</a>,{' '}
              <a href="https://www.gipcghana.com/" target="_blank" rel="noopener noreferrer" className="text-ghana-red hover:underline">Investment</a>,{' '}
              <a href="https://ghanatrade.com.gh/" target="_blank" rel="noopener noreferrer" className="text-ghana-red hover:underline">Economy and Trade</a>, as well as{' '}
              <a href="https://www.ghana.travel/" target="_blank" rel="noopener noreferrer" className="text-ghana-red hover:underline">Tourism</a>.
              The <Link href="/consular-services/visa-application" className="text-ghana-red hover:underline">Visa Application</Link> link leads you to our downloadable forms and guidance.
            </p>
            <p>
              As well as covering <Link href="/faqs" className="text-ghana-red hover:underline">Frequently Asked Questions</Link> and their answers, the website also covers <Link href="/news" className="text-ghana-red hover:underline">news articles</Link> which are relevant to the Consulate.
            </p>
            <p>
              There are subject areas where we cannot help directly and so there is provision for <Link href="/consulate/useful-links" className="text-ghana-red hover:underline">links to other websites</Link> relevant to Ghana and Bermuda which we hope you will find useful. The site also provides our contact details and our availability.
            </p>
            <p>The Consulate is honoured to be of service and we hope this website is of use to you.</p>
            <p className="font-semibold text-ghana-black">Thank you for visiting.</p>
          </div>

          <div className="mt-10 p-6 bg-ghana-cream rounded-xl border border-ghana-gold/20">
            <p className="font-serif font-semibold text-ghana-black text-lg mb-1">Ronita Teye-Botchway</p>
            <p className="text-ghana-red text-sm font-medium">Honorary Consul of Ghana</p>
            <p className="text-gray-500 text-sm">Hamilton, Bermuda</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
