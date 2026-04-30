import PageLayout from '@/components/PageLayout';
import { getJsonContent } from '@/lib/content';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';

interface VisaData {
  entryRequirements: string;
  conditions: string[];
  processing: string;
  exemptCategories: { category: string; description: string; countries: string }[];
  prohibitedMigrants: string[];
}

export const metadata = { title: 'Visa Application | Consular Services' };

export default function VisaApplicationPage() {
  const visa = getJsonContent<VisaData>('visa.json');
  return (
    <PageLayout
      title="Visa Application"
      subtitle="Entry requirements and visa information for Ghana"
      breadcrumbs={[{ name: 'Consular Services', href: '/consular-services/visa-application' }, { name: 'Visa Application' }]}
      accent="red"
    >
      <div className="max-w-4xl space-y-12">
        <div>
          <h2 className="section-heading">Entry Requirements for Ghana</h2>
          <div className="section-divider" />
          <p className="text-gray-700 leading-relaxed">{visa.entryRequirements}</p>
        </div>

        <div>
          <h2 className="section-heading">Conditions for the Issuance of Visas</h2>
          <div className="section-divider" />
          <ul className="space-y-3">
            {visa.conditions.map((c, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Application Processing</h3>
            <p className="text-blue-700 text-sm leading-relaxed">{visa.processing}</p>
          </div>
        </div>

        <div>
          <h2 className="section-heading">Persons Entitled to Enter Ghana Without a Visa</h2>
          <div className="section-divider" />
          <div className="space-y-4">
            {visa.exemptCategories.map((cat, i) => (
              <div key={i} className="card p-5">
                <h3 className="font-serif font-semibold text-ghana-black text-base mb-2">{cat.category}</h3>
                <p className="text-gray-600 text-sm mb-1 leading-relaxed">{cat.description}</p>
                {cat.countries && <p className="text-gray-500 text-sm italic">{cat.countries}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Prohibited Migrants</h3>
          </div>
          <p className="text-red-700 text-sm mb-3">The following categories of persons are prohibited immigrants:</p>
          <ul className="space-y-1.5">
            {visa.prohibitedMigrants.map((p, i) => (
              <li key={i} className="text-red-700 text-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}