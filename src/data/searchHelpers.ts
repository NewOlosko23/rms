import { Tenant, Unit, Location, RentRecord } from "../types";

export interface SearchResult {
  id: string;
  type: "tenant" | "unit" | "location" | "payment";
  title: string;
  subtitle: string;
  detail: string;
  status?: string;
  redirectPath: string;
}

// Normalize search query - lowercase and trim whitespace
const normalizeQuery = (query: string): string => {
  return query.toLowerCase().trim();
};

// Calculate relevance score for sorting (exact match > starts with > contains)
const getRelevanceScore = (text: string, query: string): number => {
  const normalized = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  
  if (normalized === normalizedQuery) return 3; // exact match
  if (normalized.startsWith(normalizedQuery)) return 2; // starts with
  if (normalized.includes(normalizedQuery)) return 1; // contains
  return 0; // no match
};

// Get max relevance score from multiple fields
const getMaxRelevance = (text: string, query: string, ...additionalTexts: string[]): number => {
  let maxScore = getRelevanceScore(text, query);
  for (const additionalText of additionalTexts) {
    maxScore = Math.max(maxScore, getRelevanceScore(additionalText, query));
  }
  return maxScore;
};

export function searchTenants(
  query: string,
  tenants: Tenant[],
  units: Unit[],
  locations: Location[]
): SearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];

  tenants.forEach((tenant) => {
    // Get unit and location info
    const unit = units.find(u => u.id === tenant.unitId);
    const location = locations.find(l => l.id === tenant.locationId);

    // Search across name, phone, email, unit ID
    const relevance = getMaxRelevance(
      tenant.name,
      normalizedQuery,
      tenant.phone,
      tenant.email,
      tenant.unitId
    );

    if (relevance > 0) {
      results.push({
        id: tenant.id,
        type: "tenant",
        title: tenant.name,
        subtitle: `Unit: ${unit?.unitNumber || tenant.unitId} • ${location?.name || "Unknown"}`,
        detail: `Phone: ${tenant.phone} • Email: ${tenant.email}`,
        status: unit?.status.charAt(0).toUpperCase() + unit?.status.slice(1),
        redirectPath: `/tenants/${tenant.id}`,
      });
    }
  });

  // Sort by relevance (highest first)
  return results.sort((a, b) => {
    const scoreA = getMaxRelevance(a.title + a.subtitle + a.detail, normalizedQuery);
    const scoreB = getMaxRelevance(b.title + b.subtitle + b.detail, normalizedQuery);
    return scoreB - scoreA;
  });
}

export function searchUnits(
  query: string,
  units: Unit[],
  locations: Location[]
): SearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];

  units.forEach((unit) => {
    const location = locations.find(l => l.id === unit.locationId);

    // Search across unit ID, unit number, location name, type
    const relevance = getMaxRelevance(
      unit.id,
      normalizedQuery,
      unit.unitNumber,
      location?.name || "",
      unit.type
    );

    if (relevance > 0) {
      results.push({
        id: unit.id,
        type: "unit",
        title: `${unit.unitNumber} - ${unit.type}`,
        subtitle: `${location?.name || "Unknown"} • Floor ${unit.floor}`,
        detail: `Monthly Rent: KES ${unit.monthlyRent.toLocaleString()}`,
        status: unit.status.charAt(0).toUpperCase() + unit.status.slice(1),
        redirectPath: `/units/${unit.id}`,
      });
    }
  });

  // Sort by relevance
  return results.sort((a, b) => {
    const scoreA = getMaxRelevance(a.title + a.subtitle + a.detail, normalizedQuery);
    const scoreB = getMaxRelevance(b.title + b.subtitle + b.detail, normalizedQuery);
    return scoreB - scoreA;
  });
}

export function searchLocations(
  query: string,
  locations: Location[]
): SearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];

  locations.forEach((location) => {
    // Search across name, address, type
    const relevance = getMaxRelevance(
      location.name,
      normalizedQuery,
      location.address,
      location.type
    );

    if (relevance > 0) {
      results.push({
        id: location.id,
        type: "location",
        title: location.name,
        subtitle: location.address,
        detail: `${location.totalUnits} units • ${location.type} • KES ${location.monthlyRent.toLocaleString()}/month`,
        redirectPath: `/locations/${location.id}`,
      });
    }
  });

  // Sort by relevance
  return results.sort((a, b) => {
    const scoreA = getMaxRelevance(a.title + a.subtitle + a.detail, normalizedQuery);
    const scoreB = getMaxRelevance(b.title + b.subtitle + b.detail, normalizedQuery);
    return scoreB - scoreA;
  });
}

export function searchRentRecords(
  query: string,
  rentRecords: RentRecord[],
  tenants: Tenant[],
  units: Unit[],
  locations: Location[]
): SearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>(); // Avoid duplicates

  rentRecords.forEach((record) => {
    const tenant = tenants.find(t => t.id === record.tenantId);
    const unit = units.find(u => u.id === record.unitId);
    const location = locations.find(l => l.id === record.locationId);

    // Search across tenant name, unit, receipt, status, month
    const relevance = getMaxRelevance(
      tenant?.name || "",
      normalizedQuery,
      unit?.unitNumber || "",
      record.receiptNo || "",
      record.status,
      record.month
    );

    if (relevance > 0) {
      const uniqueKey = `${record.tenantId}-${record.month}`;
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        results.push({
          id: record.id,
          type: "payment",
          title: `${tenant?.name || "Unknown"} - ${record.month}`,
          subtitle: `Unit: ${unit?.unitNumber || record.unitId} • ${location?.name || "Unknown"}`,
          detail: `Amount: KES ${record.amount.toLocaleString()} • ${record.paymentMethod || "Unpaid"}`,
          status: record.status.charAt(0).toUpperCase() + record.status.slice(1),
          redirectPath: `/tenants/${record.tenantId}`,
        });
      }
    }
  });

  // Sort by relevance
  return results.sort((a, b) => {
    const scoreA = getMaxRelevance(a.title + a.subtitle + a.detail, normalizedQuery);
    const scoreB = getMaxRelevance(b.title + b.subtitle + b.detail, normalizedQuery);
    return scoreB - scoreA;
  });
}

export function performGlobalSearch(
  query: string,
  tenants: Tenant[],
  units: Unit[],
  locations: Location[],
  rentRecords: RentRecord[]
): { all: SearchResult[]; grouped: Record<string, SearchResult[]> } {
  const tenantResults = searchTenants(query, tenants, units, locations);
  const unitResults = searchUnits(query, units, locations);
  const locationResults = searchLocations(query, locations);
  const paymentResults = searchRentRecords(query, rentRecords, tenants, units, locations);

  const all = [...tenantResults, ...unitResults, ...locationResults, ...paymentResults];

  const grouped: Record<string, SearchResult[]> = {
    tenants: tenantResults,
    units: unitResults,
    locations: locationResults,
    payments: paymentResults,
  };

  return { all, grouped };
}
