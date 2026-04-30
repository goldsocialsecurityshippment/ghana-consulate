import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center page-container py-20">
        <div className="flex justify-center gap-0 mb-8">
          <div className="w-10 h-2 bg-ghana-red rounded-l-full" />
          <div className="w-10 h-2 bg-ghana-gold" />
          <div className="w-10 h-2 bg-ghana-green rounded-r-full" />
        </div>
        <h1 className="font-serif text-8xl font-bold text-gray-100 mb-4">404</h1>
        <h2 className="font-serif text-2xl font-semibold text-ghana-black mb-3">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Please return to the homepage or use the navigation to find what you need.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> Go to Homepage
          </Link>
          <Link href="/contact" className="btn-outline">
            <ArrowLeft className="w-4 h-4" /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
