import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface NewsItem {
  title: string;
  description: string;
  image: string;
  href: string;
}

const newsItems: NewsItem[] = [
  {
    title: "'Main Street' Rebounds as AI Pauses",
    description:
      "Airlines, banks, retailers and metals are coming to life as AI megacaps pause. The post 'Main Street' Rebounds as AI…",
    image: "/images/Market-trends-thumbnail-Feb-2025.jpg",
    href: "https://www.tradestation.com/insights/2025/12/04/market-trends-december-4/",
  },
  {
    title: "Traders Face Choices After Pullbacks in Big Tech",
    description:
      "Tesla, Nvidia and Palantir may be stabilizing after a bout of volatility, and active traders face big choices. The post…",
    image: "/images/woman-BTT-1540828013.jpg",
    href: "https://www.tradestation.com/insights/2025/12/03/traders-choices-tech-pullbacks/",
  },
  {
    title: "Chart of the Day: Apple May Be Accelerating",
    description:
      "Apple spent November quietly consolidating, and it may be accelerating in December. The post Chart of the Day: Apple May…",
    image: "/images/woman_smartphone_357813442_BTT.jpg",
    href: "https://www.tradestation.com/insights/2025/12/02/chart-apple-accelerating/",
  },
];

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden border border-[#E6E7EA] shadow-sm rounded-lg py-0 gap-0 hover:shadow-md transition-shadow">
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-52 overflow-hidden shrink-0"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </Link>
      <CardContent className="flex flex-1 flex-col p-5">
        <h4 className="mb-2 text-lg font-semibold leading-snug">
          <Link
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#333] hover:text-[#0089FF] transition-colors"
          >
            {item.title}
          </Link>
        </h4>
        <p className="text-sm text-[#666] leading-relaxed">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function LatestNews() {
  return (
    <section className="mb-20 bg-transparent">
      <div className="w-[89%] max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-semibold text-center text-[#000730] leading-tight">
            Learn more about our industry.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index}>
              <NewsCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
