const FEED_URL =
  "https://recruitingbypaycor.com/career/CareerAtomFeed.action?clientId=8acda11040238c0b014035a043691733";

const CLIENT_ID = "8acda11040238c0b014035a043691733";

function generateApplyUrl(jobId: string): string {
  return `https://recruitingbypaycor.com/career/JobIntroduction.action?clientId=${CLIENT_ID}&id=${jobId}&source=&lang=en`;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  state: string;
  country: string;
  postalCode: string;
  locationType: "Onsite" | "Remote" | "Hybrid";
  type: string;
  jobId: string;
  applyUrl: string;
  publishedDate: string;
  updatedDate: string;
  summary: string;
}

export interface JobDetail extends Job {
  whoWeAre: string;
  whatWeLookFor: string;
  responsibilities: string[];
  skills: string[];
  minimumQualifications: string[];
  desiredQualifications: string[];
  benefits: string[];
}

function generateSlug(title: string, jobId: string): string {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 60); // Limit length for cleaner URLs

  return `${titleSlug}-${jobId}`;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractListItems(html: string, sectionStart: string, sectionEnd?: string): string[] {
  const decoded = decodeHtmlEntities(html);
  const startIndex = decoded.indexOf(sectionStart);
  if (startIndex === -1) return [];

  let endIndex = decoded.length;
  if (sectionEnd) {
    const foundEnd = decoded.indexOf(sectionEnd, startIndex + sectionStart.length);
    if (foundEnd !== -1) endIndex = foundEnd;
  }

  const section = decoded.substring(startIndex, endIndex);
  const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const items: string[] = [];
  let match;

  while ((match = listItemRegex.exec(section)) !== null) {
    const text = stripHtml(match[1]).trim();
    if (text) items.push(text);
  }

  return items;
}

function extractTextSection(html: string, sectionStart: string, sectionEnd: string): string {
  const decoded = decodeHtmlEntities(html);
  const startIndex = decoded.indexOf(sectionStart);
  if (startIndex === -1) return "";

  const afterStart = startIndex + sectionStart.length;
  const endIndex = decoded.indexOf(sectionEnd, afterStart);
  if (endIndex === -1) return "";

  const section = decoded.substring(afterStart, endIndex);
  // Extract text between divs, excluding the section headers
  const divRegex = /<div[^>]*>([\s\S]*?)<\/div>/gi;
  const texts: string[] = [];
  let match;

  while ((match = divRegex.exec(section)) !== null) {
    const text = stripHtml(match[1]).trim();
    if (text && !text.includes("<u>") && text.length > 20) {
      texts.push(text);
    }
  }

  return texts.join(" ").trim();
}

function determineLocationType(remoteType: string, location: string, state: string): "Onsite" | "Remote" | "Hybrid" {
  const lowerRemoteType = remoteType.toLowerCase();

  // Check the newton:remotetype field first (most accurate)
  if (lowerRemoteType.includes("remote")) {
    return "Remote";
  }
  if (lowerRemoteType.includes("hybrid")) {
    return "Hybrid";
  }

  // Fallback to checking location/state for legacy compatibility
  const lowerLocation = location.toLowerCase();
  const lowerState = state.toLowerCase();

  if (lowerLocation === "virtual" || lowerState === "virtual" || lowerLocation.includes("remote")) {
    return "Remote";
  }
  // Default to Onsite for specific locations
  return "Onsite";
}

function parseEntry(entry: string): JobDetail | null {
  try {
    // Extract basic fields using regex
    const getId = (tag: string) => {
      const match = entry.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
      return match ? match[1].trim() : "";
    };

    const getNewtonField = (field: string) => {
      const match = entry.match(new RegExp(`<newton:${field}>([^<]*)</newton:${field}>`));
      return match ? match[1].trim() : "";
    };

    const id = getId("id");
    const title = decodeHtmlEntities(getId("title"));
    const rawDepartment = getNewtonField("department") || getId("category")?.replace('term="', "").replace('"', "") || "";
    const department = decodeHtmlEntities(rawDepartment);
    const location = getNewtonField("location") || "";
    const state = getNewtonField("state") || "";
    const country = getNewtonField("country") || "";
    const postalCode = getNewtonField("postal_code") || "";
    const jobId = getNewtonField("jobId") || "";
    const remoteType = getNewtonField("remotetype") || "";
    const publishedDate = getId("published");
    const updatedDate = getId("updated");

    // Generate apply URL using the id from the feed
    const applyUrl = generateApplyUrl(id);

    // Extract summary HTML
    const summaryMatch = entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
    const summaryHtml = summaryMatch ? summaryMatch[1] : "";

    // Determine location type from newton:remotetype field
    const locationType = determineLocationType(remoteType, location, state);

    // Format location string
    let formattedLocation = location;
    if (state && state.toLowerCase() !== "virtual") {
      formattedLocation = `${location}, ${state}`;
    } else if (state.toLowerCase() === "virtual" || location.toLowerCase() === "virtual") {
      formattedLocation = "USA";
    }
    // Add country for non-US locations
    if (country && country !== "United States") {
      formattedLocation = `${location}, ${country}`;
    }

    // Parse the summary HTML for detailed content
    const whoWeAre = extractTextSection(
      summaryHtml,
      "Who We Are",
      "What We Are Looking For"
    ) || "TradeStation is the home of those born to trade. As an online brokerage firm and trading ecosystem, we are focused on delivering the ultimate trading experience for active traders and institutions. We continuously push the boundaries of what's possible, encourage out-of-the-box thinking, and relentlessly search for like-minded innovators.";

    const whatWeLookFor = extractTextSection(
      summaryHtml,
      "What We Are Looking For",
      "What You"
    );

    const responsibilities = extractListItems(
      summaryHtml,
      "What You'll Be Doing",
      "The Skills You Bring"
    );

    const skills = extractListItems(
      summaryHtml,
      "The Skills You Bring",
      "Minimum Qualifications"
    );

    const minimumQualifications = extractListItems(
      summaryHtml,
      "Minimum Qualifications",
      "Desired Qualifications"
    );

    const desiredQualifications = extractListItems(
      summaryHtml,
      "Desired Qualifications",
      "What We Offer"
    );

    const benefits = extractListItems(summaryHtml, "What We Offer");

    // Create a short summary for the list view
    const summary = whatWeLookFor.substring(0, 200) + (whatWeLookFor.length > 200 ? "..." : "");

    // Generate SEO-friendly slug
    const slug = generateSlug(title, jobId);

    return {
      id,
      slug,
      title,
      department,
      location: formattedLocation,
      state,
      country,
      postalCode,
      locationType,
      type: "Full-Time",
      jobId,
      applyUrl,
      publishedDate,
      updatedDate,
      summary,
      whoWeAre,
      whatWeLookFor,
      responsibilities,
      skills,
      minimumQualifications,
      desiredQualifications,
      benefits,
    };
  } catch (error) {
    console.error("Error parsing entry:", error);
    return null;
  }
}

export async function fetchJobs(): Promise<JobDetail[]> {
  try {
    const response = await fetch(FEED_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }

    const xml = await response.text();

    // Split into entries
    const entries = xml.split("<entry>").slice(1); // Skip the feed header

    const jobs: JobDetail[] = [];

    for (const entry of entries) {
      const job = parseEntry("<entry>" + entry);
      if (job && job.id && job.title) {
        jobs.push(job);
      }
    }

    // Sort by published date (newest first)
    jobs.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<JobDetail | null> {
  const jobs = await fetchJobs();
  return jobs.find((job) => job.slug === slug) || null;
}

export async function getAllJobSlugs(): Promise<string[]> {
  const jobs = await fetchJobs();
  return jobs.map((job) => job.slug);
}

// Get unique departments for filtering
export async function getDepartments(): Promise<string[]> {
  const jobs = await fetchJobs();
  const departments = new Set(jobs.map((job) => job.department).filter(Boolean));
  return ["All departments", ...Array.from(departments).sort()];
}

// Get unique locations for filtering
export async function getLocations(): Promise<string[]> {
  const jobs = await fetchJobs();
  const locations = new Set(
    jobs.map((job) => `${job.location} (${job.locationType})`).filter(Boolean)
  );
  return ["All locations", ...Array.from(locations).sort()];
}
