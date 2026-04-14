const BASE_URL = "https://api.imdbapi.dev";

export interface TitleImage {
  url: string;
  width?: number;
  height?: number;
}

export interface Title {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  type?: string;
  startYear?: number;
  endYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: {
    aggregateRating?: number;
    voteCount?: number;
  };
  plot?: string;
  primaryImage?: TitleImage;
  contentRating?: string;
}

export interface ListTitlesResponse {
  titles: Title[];
  nextPageToken?: string;
}

export interface SearchTitlesResponse {
  titles: Title[];
  nextPageToken?: string;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

// Simple rate limiter: queue requests with delay
let lastRequestTime = 0;
const MIN_INTERVAL = 200; // ms between requests

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Rate limiting
  const now = Date.now();
  const wait = Math.max(0, lastRequestTime + MIN_INTERVAL - now);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastRequestTime = Date.now();

  const res = await fetch(url);
  if (res.status === 429) {
    // Wait and retry once
    await new Promise(r => setTimeout(r, 2000));
    const retry = await fetch(url);
    if (!retry.ok) throw new Error(`API error: ${retry.status}`);
    const data = await retry.json();
    cache.set(url, { data, timestamp: Date.now() });
    return data as T;
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

export async function searchTitles(query: string): Promise<SearchTitlesResponse> {
  return fetchWithCache<SearchTitlesResponse>(
    `${BASE_URL}/search/titles?query=${encodeURIComponent(query)}`
  );
}

export async function getTitleById(id: string): Promise<Title> {
  return fetchWithCache<Title>(`${BASE_URL}/titles/${id}`);
}

export async function listTitles(params: {
  types?: string;
  genres?: string;
  sortBy?: string;
  sortOrder?: string;
  startYear?: number;
  endYear?: number;
  minVoteCount?: number;
  pageToken?: string;
}): Promise<ListTitlesResponse> {
  const searchParams = new URLSearchParams();
  if (params.types) searchParams.set("types", params.types);
  if (params.genres) searchParams.set("genres", params.genres);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.startYear) searchParams.set("startYear", params.startYear.toString());
  if (params.endYear) searchParams.set("endYear", params.endYear.toString());
  if (params.minVoteCount) searchParams.set("minVoteCount", params.minVoteCount.toString());
  if (params.pageToken) searchParams.set("pageToken", params.pageToken);
  return fetchWithCache<ListTitlesResponse>(`${BASE_URL}/titles?${searchParams.toString()}`);
}
