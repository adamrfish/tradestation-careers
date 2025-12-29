"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Job } from "@/lib/jobs";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapClientProps {
  jobs: Job[];
  selectedLocation: string | null;
  onLocationSelect: (location: string | null) => void;
  filterLocation?: string; // Location from dropdown filter
}

// Office location data with coordinates and addresses
interface OfficeLocation {
  coordinates: [number, number];
  officeName: string;
  address: string[];
}

const locationData: Record<string, OfficeLocation> = {
  // US Locations
  "Plantation, FL": {
    coordinates: [-80.2528, 26.1276],
    officeName: "Corporate Headquarters",
    address: ["8050 SW 10th Street, Suite 2000", "Plantation, FL 33324"],
  },
  "Chicago, IL": {
    coordinates: [-87.6298, 41.8781],
    officeName: "TradeStation Securities",
    address: ["120 S Riverside Plaza, Suite 1650", "Chicago, IL 60606"],
  },
  "New York, NY": {
    coordinates: [-74.0094, 40.7061],
    officeName: "TradeStation Securities",
    address: ["2 Wall Street #730", "New York, NY 10005"],
  },
  // International
  "Heredia, Costa Rica": {
    coordinates: [-84.1165, 9.9981],
    officeName: "TradeStation Global Services",
    address: ["Ultra Park 1, Edificio 7B, Segundo Piso", "Aurora de Heredia, Costa Rica"],
  },
  "London, England": {
    coordinates: [-0.2662, 51.4668],
    officeName: "TradeStation International",
    address: ["P03 The Old PowerStation", "121 Mortlake High Street", "London, SW14 8SN"],
  },
  "Amsterdam, Netherlands": {
    coordinates: [4.8807, 52.3509],
    officeName: "TradeStation Europe B.V.",
    address: ["Apollolaan 151", "1077 AR, Amsterdam", "The Netherlands"],
  },
};

function getLocationInfo(location: string): OfficeLocation | null {
  // Check for exact match first
  if (locationData[location]) {
    return locationData[location];
  }

  // Check if location contains any known city
  for (const [key, data] of Object.entries(locationData)) {
    if (location.includes(key.split(",")[0])) {
      return data;
    }
  }

  // Log unknown locations for debugging
  console.log("Unknown location:", location);
  return null;
}

function getCoordinates(location: string): [number, number] | null {
  const info = getLocationInfo(location);
  return info?.coordinates ?? null;
}

export function MapClient({ jobs, selectedLocation, onLocationSelect, filterLocation }: MapClientProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const mapLoaded = useRef(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  // Keep the callback ref updated
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Function to update markers
  const updateMarkers = (jobList: Job[], selected: string | null) => {
    if (!map.current || !mapLoaded.current) return;

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Group jobs by location
    const jobsByLocation: Record<string, Job[]> = {};
    jobList.forEach((job) => {
      const key = job.location;
      if (!jobsByLocation[key]) {
        jobsByLocation[key] = [];
      }
      jobsByLocation[key].push(job);
    });

    // Add markers for each location
    Object.entries(jobsByLocation).forEach(([location, locationJobs]) => {
      const locationInfo = getLocationInfo(location);
      if (!locationInfo) return;

      const isSelected = selected === location;

      // Create marker element
      const el = document.createElement("div");
      el.className = "mapbox-marker";
      el.style.width = isSelected ? "40px" : "32px";
      el.style.height = isSelected ? "40px" : "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = "#0089FF";
      el.style.border = isSelected ? "4px solid #040D2E" : "3px solid white";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "white";
      el.style.fontSize = isSelected ? "14px" : "12px";
      el.style.fontWeight = "600";
      el.style.transition = "all 0.15s ease";
      el.innerHTML = `${locationJobs.length}`;

      // Create popup with address info
      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <div style="font-weight: 600; font-size: 14px; color: #040D2E; margin-bottom: 4px;">${locationInfo.officeName}</div>
          <div style="font-size: 13px; color: #666; line-height: 1.4;">
            ${locationInfo.address.join("<br>")}
          </div>
          <div style="font-size: 12px; color: #0089FF; margin-top: 8px; font-weight: 500;">
            ${locationJobs.length} open position${locationJobs.length !== 1 ? "s" : ""}
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: "280px",
      }).setHTML(popupContent);

      // Add click handler to filter list
      el.addEventListener("click", () => {
        if (selected === location) {
          // Clicking same location clears the filter
          onLocationSelectRef.current(null);
        } else {
          onLocationSelectRef.current(location);
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat(locationInfo.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });
  };

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-95, 38], // Center on North America
      zoom: 3,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.current.on("load", () => {
      mapLoaded.current = true;
      updateMarkers(jobs, selectedLocation);
    });

    return () => {
      map.current?.remove();
      map.current = null;
      mapLoaded.current = false;
    };
  }, []);

  // Update markers when jobs or selection change
  useEffect(() => {
    updateMarkers(jobs, selectedLocation);
  }, [jobs, selectedLocation]);

  // Fly to location when dropdown filter changes
  useEffect(() => {
    if (!map.current || !mapLoaded.current) return;

    // Region coordinates for remote/country-level locations
    const regionCoordinates: Record<string, { center: [number, number]; zoom: number }> = {
      "USA": { center: [-95, 38], zoom: 3 },
      "Costa Rica": { center: [-84.0, 9.9], zoom: 7 },
      "Netherlands": { center: [5.2, 52.2], zoom: 7 },
      "England": { center: [-1.5, 52.5], zoom: 5.5 },
    };

    if (filterLocation && filterLocation !== "All locations") {
      // Extract location name from "Location (Type)" format
      const locationName = filterLocation.split(" (")[0];
      const coords = getCoordinates(locationName);

      if (coords) {
        // Specific city location
        map.current.flyTo({
          center: coords,
          zoom: 10,
          duration: 10000,
          essential: true,
        });
      } else {
        // Check if it's a region/country (e.g., "USA" from "USA (Remote)")
        const region = Object.keys(regionCoordinates).find(r => locationName.includes(r));
        if (region) {
          map.current.flyTo({
            center: regionCoordinates[region].center,
            zoom: regionCoordinates[region].zoom,
            duration: 10000,
            essential: true,
          });
        }
      }
    } else {
      // Reset to default view
      map.current.flyTo({
        center: [-95, 38],
        zoom: 1.5,
        duration: 10000,
        essential: true,
      });
    }
  }, [filterLocation]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] sm:h-[500px] lg:h-[650px] rounded-none lg:rounded-l-lg overflow-hidden border border-[#E6E7EA] lg:border-r-0 [&_.mapboxgl-ctrl-bottom-right]:mr-3 [&_.mapboxgl-ctrl-bottom-right]:mb-3"
    />
  );
}
