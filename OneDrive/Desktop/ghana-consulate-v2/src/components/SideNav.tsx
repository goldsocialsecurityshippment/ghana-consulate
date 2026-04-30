'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SideNavProps {
  items: { name: string; href: string }[];
  title?: string;
}

export default function SideNav({ items, title = 'In This Section' }: SideNavProps) {
  const pathname = usePathname();
  return (
    <nav className="bg-ghana-muted rounded-lg border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-ghana-black">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => {
          const active = pathname === item.href || pathname === item.href + '/';
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-3 text-sm transition-colors ${active ? 'bg-ghana-cream text-ghana-red font-semibold border-l-4 border-ghana-red' : 'text-gray-700 hover:bg-white hover:text-ghana-red border-l-4 border-transparent'}`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
