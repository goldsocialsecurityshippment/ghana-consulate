import PageLayout from '@/components/PageLayout';
import { getJsonContent } from '@/lib/content';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}
interface NewsData { articles: Article[] }

export async function generateStaticParams() {
  const { articles } = getJsonContent<NewsData>('news.json');
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { articles } = getJsonContent<NewsData>('news.json');
  const article = articles.find((a) => a.slug === params.slug);
  return { title: article ? `${article.title} | News` : 'News' };
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { articles } = getJsonContent<NewsData>('news.json');
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== params.slug);

  return (
    <PageLayout
      title={article.title}
      breadcrumbs={[{ name: 'News', href: '/news' }, { name: article.title }]}
      accent="red"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Article */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs bg-ghana-red/10 text-ghana-red font-medium px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />{article.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />{article.date}
            </span>
          </div>

          <div className="prose-content">
            {article.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link href="/news" className="inline-flex items-center gap-2 text-ghana-red text-sm font-medium hover:gap-3 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {others.length > 0 && (
            <div className="card overflow-hidden">
              <div className="bg-ghana-black px-4 py-3">
                <h3 className="font-serif font-semibold text-white text-sm">More News</h3>
              </div>
              <ul className="divide-y divide-gray-50">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/news/${a.slug}`} className="block px-4 py-3 hover:bg-ghana-cream transition-colors group">
                      <p className="text-sm font-medium text-ghana-black group-hover:text-ghana-red transition-colors leading-snug">{a.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-ghana-red rounded-lg p-5 text-white">
            <h3 className="font-serif font-semibold mb-2">Need Assistance?</h3>
            <p className="text-red-100 text-xs leading-relaxed mb-3">
              Contact the Consulate for all visa and consular enquiries.
            </p>
            <a href="mailto:info@ghanahc.bm" className="block text-center bg-white text-ghana-red font-semibold text-sm py-2 rounded hover:bg-ghana-cream transition-colors">
              Email Us
            </a>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
