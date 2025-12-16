import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CareersHeader } from "@/components/careers-header";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { fetchJobs, getJobBySlug } from "@/lib/jobs";

export async function generateStaticParams() {
  const jobs = await fetchJobs();
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const position = await getJobBySlug(slug);

  if (!position) {
    return {
      title: "Position Not Found",
    };
  }

  const description = `Apply for ${position.title} at TradeStation in ${position.location}. ${position.type} position in ${position.department}.`;

  return {
    title: position.title,
    description,
    openGraph: {
      title: `${position.title} - TradeStation Careers`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${position.title} - TradeStation Careers`,
      description,
    },
  };
}

const defaultBenefits = [
  "Collaborative work environment",
  "Competitive Salaries",
  "Yearly bonus",
  "Comprehensive benefits for you and your family starting Day 1",
  "Unlimited Paid Time Off",
  "Flexible working environment",
  "TradeStation Account employee benefits, as well as full access to trading education materials",
];

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const position = await getJobBySlug(slug);

  if (!position) {
    notFound();
  }

  const benefits = position.benefits.length > 0 ? position.benefits : defaultBenefits;

  return (
    <div className="min-h-screen flex flex-col">
      <CareersHeader />
      <main className="flex-1 bg-white">
        {/* Header Section */}
        <section className="border-b border-[#E6E7EA]">
          <div className="w-[89%] max-w-[1200px] mx-auto py-16">
            <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between gap-4">
              <h1 className="text-3xl font-semibold text-[#040D2E]">
                {position.title}
              </h1>
              <Link
                href="/positions"
                className="inline-flex items-center text-sm font-semibold text-[#0089FF] hover:text-[#005bef] transition-colors shrink-0 self-end lg:self-auto"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back to All Jobs
              </Link>
            </div>
            <div className="flex flex-wrap gap-16 text-sm mt-8">
              <div>
                <span className="text-[#666]">Employee Type</span>
                <p className="text-[#040D2E] font-medium mt-2">{position.type}</p>
              </div>
              <div>
                <span className="text-[#666]">Location</span>
                <p className="text-[#040D2E] font-medium mt-2">{position.location} ({position.locationType})</p>
              </div>
              <div>
                <span className="text-[#666]">Job Type</span>
                <p className="text-[#040D2E] font-medium mt-2">{position.department}</p>
              </div>
              <div>
                <span className="text-[#666]">Job ID</span>
                <p className="text-[#040D2E] font-medium mt-2">{position.jobId}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pt-12 pb-20">
          <div className="w-[89%] max-w-[1200px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="flex-1">
                <a
                  href="https://www.youtube.com/watch?v=58WjD5HQtAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-base text-[#0089FF] hover:text-[#005bef] transition-colors mb-8"
                >
                  #WeAreTradeStation
                </a>

                {position.whoWeAre && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      Who We Are:
                    </h2>
                    <div
                      className="text-base font-normal text-[#333] leading-loose [&>em]:italic [&>strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: position.whoWeAre }}
                    />
                  </div>
                )}

                {position.whatWeLookFor && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      What We Are Looking For:
                    </h2>
                    <div
                      className="text-base font-normal text-[#333] leading-loose [&>em]:italic [&>strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: position.whatWeLookFor }}
                    />
                  </div>
                )}

                {position.responsibilities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      What You&apos;ll Be Doing:
                    </h2>
                    <ul className="space-y-3">
                      {position.responsibilities.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start text-base font-normal text-[#333] leading-loose"
                        >
                          <span className="text-[#333] mr-3">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {position.skills.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      The Skills You Bring:
                    </h2>
                    <ul className="space-y-3">
                      {position.skills.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start text-base font-normal text-[#333] leading-loose"
                        >
                          <span className="text-[#333] mr-3">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {position.minimumQualifications.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      Minimum Qualifications:
                    </h2>
                    <ul className="space-y-3">
                      {position.minimumQualifications.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start text-base font-normal text-[#333] leading-loose"
                        >
                          <span className="text-[#333] mr-3">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {position.desiredQualifications.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-base font-bold text-[#040D2E] underline mb-4">
                      Desired Qualifications:
                    </h2>
                    <ul className="space-y-3">
                      {position.desiredQualifications.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start text-base font-normal text-[#333] leading-loose"
                        >
                          <span className="text-[#333] mr-3">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits Card - Mobile Only */}
                <div className="lg:hidden mb-8">
                  <Card className="p-6 border-[#E6E7EA] shadow-none rounded-lg">
                    <h3 className="text-lg font-semibold text-[#0089FF] mb-2">
                      Benefits at TradeStation
                    </h3>
                    <ul className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-[#333] leading-relaxed"
                        >
                          <span className="text-[#0089FF] mr-3">○</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/"
                      className="inline-block mt-2 text-sm font-medium text-[#0089FF] hover:text-[#005bef] transition-colors"
                    >
                      Learn more about our mission
                    </Link>
                  </Card>
                </div>

                {/* Apply Button */}
                <div className="mt-12">
                  <Link
                    href={position.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 text-base font-medium text-white bg-[#0089FF] rounded-lg hover:bg-[#005bef] transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </div>

              {/* Sidebar - Desktop Only */}
              <div className="hidden lg:block lg:w-80 shrink-0">
                <Card className="p-6 sticky top-32 border-[#E6E7EA] shadow-none rounded-lg">
                  <h3 className="text-lg font-semibold text-[#0089FF] mb-2">
                    Benefits at TradeStation
                  </h3>
                  <ul className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-[#333] leading-relaxed"
                      >
                        <span className="text-[#0089FF] mr-3">○</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/"
                    className="inline-block mt-2 text-sm font-medium text-[#0089FF] hover:text-[#005bef] transition-colors"
                  >
                    Learn more about our mission
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
