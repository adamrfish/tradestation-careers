import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CareersHeader } from "@/components/careers-header";
import { LatestNews } from "@/components/latest-news";
import { Footer } from "@/components/footer";
import { fetchJobs, type Job } from "@/lib/jobs";
import { MapPageClient } from "./map-page-client";

export const metadata: Metadata = {
  title: "Open Positions (Map View)",
  description: "Browse all open positions at TradeStation on a map. Find your next career opportunity in trading technology, finance, engineering, and more.",
  openGraph: {
    title: "Open Positions (Map View) at TradeStation",
    description: "Browse all open positions at TradeStation on a map. Find your next career opportunity in trading technology, finance, engineering, and more.",
  },
};

export default async function PositionsMapPage() {
  const jobs = await fetchJobs();
  const remoteJobsCount = jobs.filter((job) => job.locationType === "Remote").length;

  // Transform to simpler format for the client
  const positions: Job[] = jobs.map((job) => ({
    id: job.id,
    slug: job.slug,
    title: job.title,
    department: job.department,
    location: job.location,
    state: job.state,
    country: job.country,
    postalCode: job.postalCode,
    locationType: job.locationType,
    type: job.type,
    jobId: job.jobId,
    applyUrl: job.applyUrl,
    publishedDate: job.publishedDate,
    updatedDate: job.updatedDate,
    summary: job.summary,
  }));

  // Get unique values for filters
  const locations = [
    "All locations",
    ...Array.from(new Set(positions.map((p) => `${p.location} (${p.locationType})`))).sort(),
  ];
  const departments = [
    "All departments",
    ...Array.from(new Set(positions.map((p) => p.department).filter(Boolean))).sort(),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <CareersHeader />
      <main className="flex-1 bg-white">
        {/* Header */}
        <div className="border-b border-[#E6E7EA]">
          <div className="w-[89%] max-w-[1200px] mx-auto py-16">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-[#040D2E]">
                Open positions
              </h1>
              <Link
                href="/positions"
                className="inline-flex items-center text-sm font-semibold text-[#0089FF] hover:text-[#005bef] transition-colors"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back to list view
              </Link>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-[89%] max-w-[1200px] mx-auto py-8">
          <MapPageClient
            jobs={positions}
            locations={locations}
            departments={departments}
            remoteJobsCount={remoteJobsCount}
          />
        </div>

        {/* Latest News Section */}
        <div className="py-16">
          <LatestNews />
        </div>
      </main>
      <Footer />
    </div>
  );
}
