import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb { name: string; href?: string; }

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  children: React.ReactNode;
  accent?: 'red' | 'gold' | 'green';
}

export default function PageLayout({ title, subtitle, breadcrumbs, children, accent = 'gold' }: PageLayoutProps) {
  const bar = { red: 'bg-ghana-red', gold: 'bg-ghana-gold', green: 'bg-ghana-green' }[accent];
  return (
    <>
      <div className="bg-gradient-to-r from-ghana-black via-gray-900 to-ghana-green-dark text-white">
        <div className="page-container py-10 md:py-14">
          {breadcrumbs && (
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-ghana-gold transition-colors">Home</Link>
              {breadcrumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-ghana-gold transition-colors">{c.name}</Link>
                  ) : (
                    <span className="text-gray-200">{c.name}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-gray-300 mt-2 text-base md:text-lg max-w-2xl">{subtitle}</p>}
          <div className={`w-16 h-1 mt-4 ${bar} rounded-full`} />
        </div>
      </div>
      <div className="bg-white">
        <div className="page-container py-10 md:py-14">{children}</div>
      </div>
    </>
  );
}
