"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CareersHeader } from "@/components/careers-header";
import { LatestNews } from "@/components/latest-news";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Job } from "@/lib/jobs";

interface PositionsClientProps {
  positions: Job[];
  locations: string[];
  departments: string[];
}

function PositionRow({ position }: { position: Job }) {
  return (
    <Link
      href={`/positions/${position.slug}`}
      className="block px-6 py-6 hover:bg-gray-50 transition-colors"
    >
      <h3 className="text-base font-semibold text-[#040D2E] mb-1">
        {position.title}
      </h3>
      <p className="text-sm text-[#666]">
        {position.location} ({position.locationType}) | {position.type}
      </p>
    </Link>
  );
}

export function PositionsClient({
  positions,
  locations,
  departments,
}: PositionsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedDepartment, setSelectedDepartment] = useState("All departments");

  const filteredPositions = useMemo(() => {
    return positions.filter((position) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        position.title.toLowerCase().includes(query) ||
        position.department.toLowerCase().includes(query) ||
        position.location.toLowerCase().includes(query) ||
        position.locationType.toLowerCase().includes(query) ||
        position.type.toLowerCase().includes(query) ||
        position.jobId.toLowerCase().includes(query) ||
        position.summary.toLowerCase().includes(query);

      const matchesLocation =
        selectedLocation === "All locations" ||
        `${position.location} (${position.locationType})` === selectedLocation;

      const matchesDepartment =
        selectedDepartment === "All departments" ||
        position.department === selectedDepartment;

      return matchesSearch && matchesLocation && matchesDepartment;
    });
  }, [positions, searchQuery, selectedLocation, selectedDepartment]);

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
                href="/"
                className="inline-flex items-center text-sm font-semibold text-[#0089FF] hover:text-[#005bef] transition-colors"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back to Careers
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-[89%] max-w-[1200px] mx-auto py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Filters Sidebar */}
            <Card className="lg:w-72 shrink-0 p-6 h-fit border-[#E6E7EA] shadow-none rounded-lg">
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <Input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 bg-[#f5f5f5] border-0 rounded-full px-4 text-sm placeholder:text-[#666]"
                  />
                </div>

                {/* Filter by location */}
                <div>
                  <label className="block text-sm font-semibold text-[#040D2E] mb-2">
                    Filter by location
                  </label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger className="w-full h-11 border-[#E6E7EA] rounded-md text-sm">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by department */}
                <div>
                  <label className="block text-sm font-semibold text-[#040D2E] mb-2">
                    Filter by department
                  </label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-full h-11 border-[#E6E7EA] rounded-md text-sm">
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Positions List */}
            <div className="flex-1">
              <div className="flex flex-col">
                {filteredPositions.length > 0 ? (
                  filteredPositions.map((position, index) => (
                    <div key={position.id}>
                      <PositionRow position={position} />
                      {index < filteredPositions.length - 1 && (
                        <Separator className="bg-[#E6E7EA]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-sm text-[#666]">
                    No positions found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
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
