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
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\u2019/g, "'")  // Right single quotation mark (curly apostrophe) to straight
    .replace(/\u2018/g, "'")  // Left single quotation mark to straight
    .replace(/\u201C/g, '"')  // Left double quotation mark to straight
    .replace(/\u201D/g, '"')  // Right double quotation mark to straight
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Sanitize HTML but preserve allowed formatting tags
function sanitizeHtml(html: string): string {
  // First, normalize line breaks - convert <br>, <br/>, <br /> to a placeholder
  let result = html.replace(/<br\s*\/?>/gi, "{{BR}}");

  // Convert block elements to line breaks
  result = result.replace(/<\/(p|div)>/gi, "{{BR}}");
  result = result.replace(/<(p|div)[^>]*>/gi, "");

  // Preserve italic/emphasis tags by converting to placeholders (handle tags with attributes)
  result = result.replace(/<(i|em)(\s[^>]*)?>/gi, "{{EM_OPEN}}");
  result = result.replace(/<\/(i|em)>/gi, "{{EM_CLOSE}}");

  // Preserve bold/strong tags by converting to placeholders (handle tags with attributes)
  result = result.replace(/<(b|strong)(\s[^>]*)?>/gi, "{{STRONG_OPEN}}");
  result = result.replace(/<\/(b|strong)>/gi, "{{STRONG_CLOSE}}");

  // Remove all other HTML tags
  result = result.replace(/<[^>]*>/g, "");

  // Convert placeholders back to actual tags
  result = result.replace(/\{\{BR\}\}/g, "<br />");
  result = result.replace(/\{\{EM_OPEN\}\}/g, "<em>");
  result = result.replace(/\{\{EM_CLOSE\}\}/g, "</em>");
  result = result.replace(/\{\{STRONG_OPEN\}\}/g, "<strong>");
  result = result.replace(/\{\{STRONG_CLOSE\}\}/g, "</strong>");

  // Clean up multiple consecutive <br> tags
  result = result.replace(/(<br \/>[\s]*){3,}/g, "<br /><br />");

  // Clean up whitespace (but preserve single spaces)
  result = result.replace(/[ \t]+/g, " ");

  // Remove leading/trailing whitespace around <br> tags
  result = result.replace(/\s*<br \/>\s*/g, "<br />");

  // Remove leading <br> tags
  result = result.replace(/^(<br \/>)+/, "");

  // Remove trailing <br> tags
  result = result.replace(/(<br \/>)+$/, "");

  return result.trim();
}

// All known section headers in the feed (used for boundary detection)
const ALL_SECTION_HEADERS = [
  "Who We Are",
  "What We Are Looking For",
  "What You'll Be Doing",
  "The Skills You Bring",
  "Skills and Training",
  "Minimum Qualifications",
  "Required Qualifications",
  "Desired Qualifications",
  "What We Offer",
];

// Find the first matching header from a list of alternatives
function findSectionStart(decoded: string, alternatives: string[]): { header: string; index: number } | null {
  for (const header of alternatives) {
    const index = decoded.indexOf(header);
    if (index !== -1) {
      return { header, index };
    }
  }
  return null;
}

// Find the next section boundary after a given position
function findNextSectionBoundary(decoded: string, afterPosition: number, excludeHeaders: string[] = []): number {
  let nextBoundary = decoded.length;

  for (const header of ALL_SECTION_HEADERS) {
    if (excludeHeaders.includes(header)) continue;
    const index = decoded.indexOf(header, afterPosition);
    if (index !== -1 && index < nextBoundary) {
      nextBoundary = index;
    }
  }

  return nextBoundary;
}

function extractListItems(html: string, sectionStartAlternatives: string[], nextSectionAlternatives?: string[]): string[] {
  const decoded = decodeHtmlEntities(html);

  // Find the section start from alternatives
  const startMatch = findSectionStart(decoded, sectionStartAlternatives);
  if (!startMatch) return [];

  const afterStart = startMatch.index + startMatch.header.length;

  // Find the section end - either from specific alternatives or next any section
  let endIndex: number;
  if (nextSectionAlternatives && nextSectionAlternatives.length > 0) {
    const endMatch = findSectionStart(decoded.substring(afterStart), nextSectionAlternatives);
    if (endMatch) {
      endIndex = afterStart + endMatch.index;
    } else {
      // If specified next section not found, find any next section boundary
      endIndex = findNextSectionBoundary(decoded, afterStart, sectionStartAlternatives);
    }
  } else {
    endIndex = findNextSectionBoundary(decoded, afterStart, sectionStartAlternatives);
  }

  const section = decoded.substring(startMatch.index, endIndex);
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
  // Extract content between divs, preserving formatting
  const divRegex = /<div[^>]*>([\s\S]*?)<\/div>/gi;
  const texts: string[] = [];
  let match;

  while ((match = divRegex.exec(section)) !== null) {
    const content = sanitizeHtml(match[1]).trim();
    // Check the stripped version for length validation
    const strippedContent = stripHtml(match[1]).trim();
    if (strippedContent && !strippedContent.includes("<u>") && strippedContent.length > 20) {
      texts.push(content);
    }
  }

  return texts.join("<br /><br />").trim();
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
      ["What You'll Be Doing"],
      ["The Skills You Bring", "Skills and Training", "Minimum Qualifications", "Required Qualifications"]
    );

    const skills = extractListItems(
      summaryHtml,
      ["The Skills You Bring", "Skills and Training"],
      ["Minimum Qualifications", "Required Qualifications"]
    );

    const minimumQualifications = extractListItems(
      summaryHtml,
      ["Minimum Qualifications", "Required Qualifications"],
      ["Desired Qualifications", "What We Offer"]
    );

    const desiredQualifications = extractListItems(
      summaryHtml,
      ["Desired Qualifications"],
      ["What We Offer"]
    );

    const benefits = extractListItems(summaryHtml, ["What We Offer"]);

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

    // Sort alphabetically by title
    jobs.sort((a, b) => a.title.localeCompare(b.title));

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
