import type { Metadata } from "next";
import { fetchJobs, type Job } from "@/lib/jobs";
import { PositionsClient } from "./positions-client";

export const metadata: Metadata = {
  title: "Open Positions",
  description: "Browse all open positions at TradeStation. Find your next career opportunity in trading technology, finance, engineering, and more.",
  openGraph: {
    title: "Open Positions at TradeStation",
    description: "Browse all open positions at TradeStation. Find your next career opportunity in trading technology, finance, engineering, and more.",
  },
};

export default async function PositionsPage() {
  const jobs = await fetchJobs();

  // Transform to simpler format for the list and sort by posting date (newest first)
  const positions: Job[] = jobs
    .map((job) => ({
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
    }))
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

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
    <PositionsClient
      positions={positions}
      locations={locations}
      departments={departments}
    />
  );
}
