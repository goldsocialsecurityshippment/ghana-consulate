import PageLayout from '@/components/PageLayout';
import { getJsonContent } from '@/lib/content';
import Link from 'next/link';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}
interface NewsData { articles: Article[] }

export const metadata = { title: 'News | Honourary Consulate of Ghana, Bermuda' };

export default function NewsPage() {
  const { articles } = getJsonContent<NewsData>('news.json');
  return (
    <PageLayout
      title="News"
      subtitle="Latest news and announcements from the Consulate and Ghana"
      breadcrumbs={[{ name: 'News' }]}
      accent="red"
    >
      <div className="max-w-3xl">
        <div className="space-y-6">
          {articles.map((article) => (
            <article key={article.slug} className="card p-6 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs bg-ghana-red/10 text-ghana-red font-medium px-2.5 py-1 rounded-full">
                  <Tag className="w-3 h-3" />{article.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />{article.date}
                </span>
              </div>
              <h2 className="font-serif font-semibold text-ghana-black text-xl leading-snug">
                <Link href={`/news/${article.slug}`} className="hover:text-ghana-red transition-colors">
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
              <Link
                href={`/news/${article.slug}`}
                className="inline-flex items-center gap-1.5 text-ghana-red text-sm font-medium hover:gap-2.5 transition-all"
              >
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
