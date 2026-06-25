import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="text-center px-6">
        <div className="text-8xl font-bold mb-4" style={{ color: "var(--accent)", opacity: 0.3 }}>404</div>
        <h1 className="text-3xl font-bold text-[var(--text)] mb-3">Page Not Found</h1>
        <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary inline-flex">Return Home <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
