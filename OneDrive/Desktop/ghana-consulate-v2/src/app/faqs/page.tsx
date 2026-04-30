'use client';
import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Do I need a visa to visit Ghana?',
    a: 'Most visitors require a visa to enter Ghana. ECOWAS member state nationals and citizens of countries with bilateral visa waiver agreements with Ghana are exempt. Please refer to our Visa Application page for the full list of exempt nationalities and categories.',
  },
  {
    q: 'How long does a visa application take to process?',
    a: 'Standard Visa Applications take 10 to 15 working days from the start of the application process. Applicants are strongly advised to submit their Visa Applications at least one (1) month before their intended date of travel to allow sufficient processing time.',
  },
  {
    q: 'How do I apply for a Ghana visa from Bermuda?',
    a: 'You can apply through the Honourary Consulate of Ghana in Bermuda. Please contact the Consulate by prior arrangement to schedule an appointment and obtain the current application forms and guidance.',
  },
  {
    q: 'Are visa application fees refundable?',
    a: 'No. Visa application fees are non-refundable whether your application is successful or not. Please ensure you meet all requirements before submitting your application.',
  },
  {
    q: 'What is the minimum passport validity required to enter Ghana?',
    a: 'Your passport must have a validity of at least six (6) months after the date you intend to leave Ghana. Passports with less than six months remaining validity will not be accepted.',
  },
  {
    q: 'Do I need a Yellow Fever vaccination to enter Ghana?',
    a: 'Yes. Visitors are required to have been vaccinated against Yellow Fever at least ten (10) days before their proposed date of entry into Ghana. You must carry your Yellow Fever vaccination certificate when travelling.',
  },
  {
    q: 'Can I work in Ghana on a visitor visa?',
    a: 'No. Persons who enter Ghana as visitors are not permitted to take up employment, even if there happens to be a vacancy on the Immigrant Quota of a prospective employer. A separate work permit and appropriate visa category are required for employment.',
  },
  {
    q: 'Can children travel to Ghana alone?',
    a: 'Children travelling with or without their parents must have their own passport or travel document. A letter of consent from parent(s) or guardian(s) is required where applicable. Please contact the Consulate for specific guidance on requirements for minors travelling.',
  },
  {
    q: "What are the consulate's business hours?",
    a: 'The Consulate operates by prior arrangement only. Please contact us via email to schedule an appointment. Walk-in visits cannot be accommodated without a prior appointment.',
  },
  {
    q: 'How do I contact the Consulate for assistance?',
    a: 'You can contact the Honourary Consulate of Ghana in Bermuda via email at info@ghanahc.bm. All visits and services are by prior arrangement. We aim to respond to all enquiries as promptly as possible.',
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-ghana-cream transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-ghana-red/10 text-ghana-red font-semibold text-xs flex items-center justify-center flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-serif font-semibold text-ghana-black text-base">{faq.q}</span>
        </span>
        <ChevronDown className={`w-5 h-5 text-ghana-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-ghana-cream border-t border-ghana-gold/20">
          <p className="text-gray-700 text-sm leading-relaxed ml-10">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  return (
    <PageLayout
      title="Frequently Asked Questions"
      subtitle="Answers to common questions about the Consulate and Ghana"
      breadcrumbs={[{ name: 'FAQs' }]}
      accent="gold"
    >
      <div className="max-w-3xl">
        <p className="text-gray-600 leading-relaxed mb-8">
          Below you will find answers to the questions we receive most frequently. If you cannot find the answer to your question here, please do not hesitate to contact the Consulate directly.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
        <div className="mt-10 p-6 bg-ghana-cream rounded-xl border border-ghana-gold/20">
          <h3 className="font-serif font-semibold text-ghana-black mb-2">Still have a question?</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            If your question is not answered above, please contact the Consulate directly and we will be happy to assist you.
          </p>
          <a href="mailto:info@ghanahc.bm" className="btn-primary text-sm">
            Email the Consulate
          </a>
        </div>
      </div>
    </PageLayout>
  );
}
