const BASE_URL = "https://api.imdbapi.dev/v1";

export interface Title {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  titleType?: string;
  startYear?: number;
  endYear?: number;
  runtimeMinutes?: number;
  genres?: string[];
  averageRating?: number;
  numVotes?: number;
  description?: string;
  primaryImage?: string;
  contentRating?: string;
}

export interface SearchResult {
  results: Title[];
  totalResults?: number;
  hasNextPage?: boolean;
}

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data as T;
}

export async function searchTitles(query: string, page = 1): Promise<SearchResult> {
  return fetchWithCache<SearchResult>(`${BASE_URL}/search/titles?query=${encodeURIComponent(query)}&page=${page}`);
}

export async function getTitleById(id: string): Promise<Title> {
  return fetchWithCache<Title>(`${BASE_URL}/titles/${id}`);
}

export async function listTitles(params: {
  titleType?: string;
  genre?: string;
  startYear?: number;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<SearchResult> {
  const searchParams = new URLSearchParams();
  if (params.titleType) searchParams.set("titleType", params.titleType);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.startYear) searchParams.set("startYear", params.startYear.toString());
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  return fetchWithCache<SearchResult>(`${BASE_URL}/titles?${searchParams.toString()}`);
}

export function getCachedData(key: string): unknown | null {
  const cached = cache.get(key);
  return cached ? cached.data : null;
}
