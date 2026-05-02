import PageLayout from '@/components/PageLayout';
import { getJsonContent } from '@/lib/content';
import Link from 'next/link';
import { ArrowRight, Calendar, Tag, ExternalLink } from 'lucide-react';

interface Article {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  external: boolean;
}

interface ExternalNewsLink {
  title: string;
  url: string;
  source: string;
  date: string;
}

interface NewsData {
  articles: Article[];
  externalLinks: ExternalNewsLink[];
}

export const metadata = { title: 'News | Honourary Consulate of Ghana, Bermuda' };

export default function NewsPage() {
  const { articles, externalLinks } = getJsonContent<NewsData>('news.json');

  return (
    <PageLayout
      title="News"
      subtitle="Latest news and announcements from the Consulate and Ghana"
      breadcrumbs={[{ name: 'News' }]}
      accent="red"
    >
      <div className="max-w-4xl space-y-14">

        {/* Internal articles */}
        <div>
          <h2 className="section-heading">Consulate News</h2>
          <div className="section-divider" />
          <div className="space-y-5">
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
                <h3 className="font-serif font-semibold text-ghana-black text-xl leading-snug">
                  <Link href={`/news/${article.slug}`} className="hover:text-ghana-red transition-colors">
                    {article.title}
                  </Link>
                </h3>
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

        {/* External news links */}
        <div>
          <h2 className="section-heading">Ghana & Bermuda in the News</h2>
          <div className="section-divider" />
          <p className="text-gray-500 text-sm mb-5">
            A collection of news articles from external sources featuring Ghana, the Consulate, and the Bermudian community.
            The Consulate accepts no responsibility for the content of external links.
          </p>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {externalLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-ghana-cream transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ghana-black text-sm group-hover:text-ghana-red transition-colors leading-snug">
                    {link.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-ghana-gold font-medium">{link.source}</span>
                    <span className="text-xs text-gray-400">{link.date}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-ghana-red flex-shrink-0 mt-0.5 transition-colors" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
