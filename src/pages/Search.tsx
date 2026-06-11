import React, { useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRentSystem } from "../context/RentSystemContext";
import { performGlobalSearch, SearchResult } from "../data/searchHelpers";
import { ArrowRight, Loader, User, Home, MapPin, CreditCard, AlertCircle } from "lucide-react";

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { tenants, units, locations, rentRecords } = useRentSystem();

  // Perform search
  const { all: allResults, grouped } = useMemo(() => {
    return performGlobalSearch(query, tenants, units, locations, rentRecords);
  }, [query, tenants, units, locations, rentRecords]);

  // Get category icon
  const getCategoryIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "tenant":
        return <User className="w-5 h-5 text-indigo-500" />;
      case "unit":
        return <Home className="w-5 h-5 text-blue-500" />;
      case "location":
        return <MapPin className="w-5 h-5 text-emerald-500" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  // Get category label
  const getCategoryLabel = (type: SearchResult["type"]): string => {
    switch (type) {
      case "tenant":
        return "Tenant";
      case "unit":
        return "Unit";
      case "location":
        return "Location";
      case "payment":
        return "Payment";
      default:
        return "Result";
    }
  };

  // Get status badge color
  const getStatusColor = (type: SearchResult["type"], status?: string) => {
    if (type === "unit") {
      return status === "Occupied"
        ? "bg-emerald-100 text-emerald-800"
        : "bg-slate-100 text-slate-800";
    }
    if (type === "payment") {
      if (status === "Paid") return "bg-emerald-100 text-emerald-800";
      if (status === "Overdue") return "bg-red-100 text-red-800";
      if (status === "Pending") return "bg-amber-100 text-amber-800";
    }
    return "bg-slate-100 text-slate-800";
  };

  // Result card component
  const ResultCard = ({ result }: { result: SearchResult }) => (
    <button
      onClick={() => navigate(result.redirectPath)}
      className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getCategoryIcon(result.type)}
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {getCategoryLabel(result.type)}
            </span>
            {result.status && (
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(result.type, result.status)}`}>
                {result.status}
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {result.title}
          </h3>

          <p className="text-xs text-slate-600 mb-2">{result.subtitle}</p>

          <p className="text-xs text-slate-500">{result.detail}</p>
        </div>

        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
      </div>
    </button>
  );

  // Grouped view component
  const GroupedResults = () => {
    const categories = [
      { key: "tenants", label: "Tenants", icon: User, color: "indigo" },
      { key: "units", label: "Units", icon: Home, color: "blue" },
      { key: "locations", label: "Locations", icon: MapPin, color: "emerald" },
      { key: "payments", label: "Payments", icon: CreditCard, color: "amber" },
    ];

    return (
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryKey = category.key as keyof typeof grouped;
          const results = grouped[categoryKey];

          if (results.length === 0) return null;

          const Icon = category.icon;
          const colorMap = {
            indigo: "text-indigo-600",
            blue: "text-blue-600",
            emerald: "text-emerald-600",
            amber: "text-amber-600",
          };

          return (
            <div key={category.key}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-5 h-5 ${colorMap[category.color as keyof typeof colorMap]}`} />
                <h2 className="text-sm font-bold text-slate-900">
                  {category.label} ({results.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-auto bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h1>
          <p className="text-slate-600">
            {query ? (
              <>
                Found <span className="font-bold text-indigo-600">{allResults.length}</span> result
                {allResults.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-slate-900">"{query}"</span>
              </>
            ) : (
              <span className="text-slate-500 italic">Enter a search term to find tenants, units, locations, or payments</span>
            )}
          </p>
        </div>

        {/* Results */}
        {!query ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
            <Loader className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-500">No search query entered</p>
            <p className="text-sm text-slate-400 mt-1">Use the search bar in the header to find what you're looking for</p>
          </div>
        ) : allResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-slate-200 rounded-xl">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-slate-600 font-semibold">No results found</p>
            <p className="text-sm text-slate-500 mt-1">Try searching with different keywords</p>
          </div>
        ) : (
          <GroupedResults />
        )}
      </div>
    </main>
  );
}
