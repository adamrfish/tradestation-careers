"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Job } from "@/lib/jobs";

// Lazy load Mapbox to reduce initial bundle size
const MapClient = dynamic(() => import("./map-client").then((mod) => mod.MapClient), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] sm:h-[500px] lg:h-[650px] rounded-lg lg:rounded-l-lg lg:rounded-r-none overflow-hidden border border-[#E6E7EA] lg:border-r-0 bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading map...</div>
    </div>
  ),
});

function PositionRow({ position }: { position: Job }) {
  return (
    <Link
      href={`/positions/${position.slug}`}
      className="block px-6 py-6 hover:bg-gray-50 transition-colors"
    >
      <h3 className="text-base font-semibold text-[#040D2E] mb-1">
        {position.title}
      </h3>
      <p className="text-sm text-[#040D2E]">
        {position.location} ({position.locationType}) | {position.type}
      </p>
    </Link>
  );
}

interface MapPageClientProps {
  jobs: Job[];
  locations: string[];
  departments: string[];
  remoteJobsCount: number;
}

export function MapPageClient({
  jobs,
  locations,
  departments,
  remoteJobsCount,
}: MapPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [includeRemote, setIncludeRemote] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedDepartment, setSelectedDepartment] = useState("All departments");
  const [mapSelectedLocation, setMapSelectedLocation] = useState<string | null>(null);

  // Handle location dropdown selection and sync remote toggle
  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);

    if (location !== "All locations") {
      if (location.includes("(Remote)")) {
        setIncludeRemote(true);
      } else if (location.includes("(Onsite)") || location.includes("(Hybrid)")) {
        setIncludeRemote(false);
      }
    }
  };

  // Handle map marker click and sync remote toggle
  const handleMapLocationSelect = (location: string | null) => {
    setMapSelectedLocation(location);

    // If selecting a physical location on the map, turn off remote toggle
    if (location !== null) {
      setIncludeRemote(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.locationType.toLowerCase().includes(query) ||
        job.type.toLowerCase().includes(query) ||
        job.jobId.toLowerCase().includes(query) ||
        job.summary.toLowerCase().includes(query);

      const matchesLocation =
        selectedLocation === "All locations" ||
        `${job.location} (${job.locationType})` === selectedLocation;

      const matchesDepartment =
        selectedDepartment === "All departments" ||
        job.department === selectedDepartment;

      return matchesSearch && matchesLocation && matchesDepartment;
    });
  }, [jobs, searchQuery, selectedLocation, selectedDepartment]);

  // Filter based on remote checkbox - if unchecked, exclude remote jobs
  const remoteFilteredJobs = includeRemote
    ? filteredJobs
    : filteredJobs.filter((job) => job.locationType !== "Remote");

  // Filter by map selection if a location is selected on the map
  const displayJobs = mapSelectedLocation
    ? remoteFilteredJobs.filter((job) => job.location === mapSelectedLocation)
    : remoteFilteredJobs;

  // For the map, always filter out remote jobs (they don't have map locations)
  const mapJobs = remoteFilteredJobs.filter((job) => job.locationType !== "Remote");

  // Count positions by type for the header
  const onsiteCount = displayJobs.filter((job) => job.locationType === "Onsite" || job.locationType === "Hybrid").length;
  const remoteCount = displayJobs.filter((job) => job.locationType === "Remote").length;

  return (
    <div>
      {/* Filters Bar */}
      <Card className="p-6 border-[#E6E7EA] shadow-none rounded-lg mb-6 lg:p-0 lg:border-0 lg:rounded-none lg:bg-transparent">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-4">
          <div className="sm:col-span-2 lg:w-64">
            <Input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-[#f5f5f5] border-0 rounded-full px-4 text-sm placeholder:text-[#666]"
            />
          </div>
          <div className="lg:w-56">
            <Select
              value={selectedLocation}
              onValueChange={handleLocationChange}
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
          <div className="lg:w-56">
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
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <Switch
              id="include-remote"
              checked={includeRemote}
              onCheckedChange={setIncludeRemote}
              className="data-[state=checked]:bg-[#0089FF]"
            />
            <label
              htmlFor="include-remote"
              className="text-sm text-[#040D2E] cursor-pointer select-none"
            >
              Remote positions
            </label>
          </div>
        </div>
      </Card>

      {/* Map and List Layout */}
      <div className="flex flex-col lg:flex-row gap-0">
        {/* Map */}
        <div className="lg:flex-1">
          <MapClient
            jobs={mapJobs}
            selectedLocation={mapSelectedLocation}
            onLocationSelect={handleMapLocationSelect}
            filterLocation={selectedLocation}
          />
        </div>

        {/* List View */}
        <div className="mt-4 lg:mt-0 lg:w-96 shrink-0 lg:h-[650px] border-0 lg:border lg:border-[#E6E7EA] lg:border-l-0 rounded-none lg:rounded-r-lg overflow-hidden bg-white">
          <div className="lg:h-full lg:overflow-y-auto">
            {/* Header - Desktop only */}
            <div className="hidden lg:block px-6 pt-6 pb-6 border-b border-[#E6E7EA] bg-gray-50">
              <div className="text-lg font-semibold text-[#0089FF]">
                {displayJobs.length} position{displayJobs.length !== 1 ? "s" : ""}
              </div>
              <div className="text-sm text-[#040D2E] mt-1">
                <span>Onsite: </span>
                <span className="font-medium">{onsiteCount}</span>
                <span> | Remote: </span>
                <span className="font-medium">{remoteCount}</span>
              </div>
            </div>
            {displayJobs.length > 0 ? (
              displayJobs.map((position, index) => (
                <div key={position.id}>
                  <PositionRow position={position} />
                  {index < displayJobs.length - 1 && (
                    <Separator className="bg-[#E6E7EA]" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-[#040D2E]">
                No positions found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
