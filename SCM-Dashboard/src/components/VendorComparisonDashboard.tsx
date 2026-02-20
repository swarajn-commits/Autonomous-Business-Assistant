import { useState, useEffect } from "react";

const WEIGHTS = { delivery: 40, price: 35, rating: 25 };

interface Vendor {
  id: number;
  name: string;
  contact: string;
  material: string;
  leadTime: string;
  pricePerKg: string;
  rating: number;
  deliveryScore: number;
  priceScore: number;
  ratingScore: number;
  totalScore: number;
  pastDeliveries: number;
  onTimeRate: string;
  tags: string[];
  isTopPick: boolean;
}

const VENDOR_COMPARISONS: Vendor[] = [
  {
    id: 1,
    name: "SteelCo Ltd.",
    contact: "steelco@vendor.in",
    material: "Raw Steel",
    leadTime: "4 days",
    pricePerKg: "₹45/kg",
    rating: 4.8,
    deliveryScore: 88,
    priceScore: 82,
    ratingScore: 96,
    totalScore: 87.9,
    pastDeliveries: 142,
    onTimeRate: "97%",
    tags: ["Reliable", "Fast"],
    isTopPick: true,
  },
  {
    id: 2,
    name: "MetalHub Pvt.",
    contact: "hub@metalhub.in",
    material: "Raw Steel",
    leadTime: "5 days",
    pricePerKg: "₹39/kg",
    rating: 4.3,
    deliveryScore: 76,
    priceScore: 94,
    ratingScore: 76,
    totalScore: 82.3,
    pastDeliveries: 89,
    onTimeRate: "88%",
    tags: ["Budget Pick"],
    isTopPick: false,
  },
  {
    id: 3,
    name: "Alum Partners",
    contact: "alum@vendor.in",
    material: "Raw Steel (Alt)",
    leadTime: "6 days",
    pricePerKg: "₹52/kg",
    rating: 4.5,
    deliveryScore: 70,
    priceScore: 64,
    ratingScore: 86,
    totalScore: 71.9,
    pastDeliveries: 67,
    onTimeRate: "82%",
    tags: ["Premium"],
    isTopPick: false,
  },
];

const ALL_VENDORS = [
  { vendor: "SteelCo Ltd.", contact: "steelco@vendor.in", material: "Raw Steel", leadTime: "4 days", rating: "4.8/5", status: "Active" },
  { vendor: "Alum Partners", contact: "alum@vendor.in", material: "Aluminium", leadTime: "6 days", rating: "4.5/5", status: "Active" },
  { vendor: "CopperTrade", contact: "copper@vendor.in", material: "Copper Wire", leadTime: "3 days", rating: "4.9/5", status: "Active" },
  { vendor: "PlastiSource", contact: "plasti@vendor.in", material: "Plastic Pellets", leadTime: "7 days", rating: "4.1/5", status: "Review" },
  { vendor: "RubberWorld", contact: "rubber@vendor.in", material: "Rubber Seals", leadTime: "5 days", rating: "4.6/5", status: "Active" },
];

function ScoreBar({
  label, score, color, animated, darkMode,
}: {
  label: string; score: number; color: string; animated: boolean; darkMode: boolean;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
        <span className={`text-xs font-bold tabular-nums ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{score}</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: animated ? `${score}%` : "0%", transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>
    </div>
  );
}

function VendorCard({ vendor, animated, darkMode }: { vendor: Vendor; animated: boolean; darkMode: boolean }) {
  const textPrimary = darkMode ? "text-white" : "text-slate-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-slate-500";
  const divider = darkMode ? "border-slate-700" : "border-slate-100";

  const scoreColor =
    vendor.totalScore >= 85 ? "text-emerald-500"
    : vendor.totalScore >= 75 ? "text-amber-500"
    : "text-slate-500";

  const scoreBorder =
    vendor.totalScore >= 85
      ? darkMode ? "border-emerald-500/40 bg-emerald-500/10" : "border-emerald-300 bg-emerald-50"
      : vendor.totalScore >= 75
        ? darkMode ? "border-amber-500/40 bg-amber-500/10" : "border-amber-300 bg-amber-50"
        : darkMode ? "border-slate-600 bg-slate-700/40" : "border-slate-300 bg-slate-100";

  return (
    <div
      className={`relative flex flex-col rounded-2xl overflow-visible transition-all duration-300 ${
        vendor.isTopPick
          ? `border-2 shadow-[0_0_32px_rgba(251,191,36,0.4)] glow-amber ${darkMode ? "bg-slate-800/90 border-amber-400/70" : "bg-white border-amber-400"}`
          : `border shadow-lg hover:shadow-xl ${darkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"}`
      }`}
      style={{ marginTop: vendor.isTopPick ? "20px" : "0" }}
    >
      {/* AI Top Pick Badge */}
      {vendor.isTopPick && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-amber-400/60 whitespace-nowrap">
            🏆 AI Top Pick
          </span>
        </div>
      )}

      {/* Card Header */}
      <div className={`px-5 pt-7 pb-4 border-b ${divider}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <p className={`text-base font-bold ${textPrimary} leading-tight`}>{vendor.name}</p>
            <p className={`text-xs ${textSecondary} mt-0.5 truncate`}>{vendor.contact}</p>
            <p className={`text-xs ${textSecondary} mt-0.5`}>{vendor.material}</p>
          </div>
          {/* Score circle */}
          <div className={`shrink-0 flex flex-col items-center justify-center w-[3.5rem] h-[3.5rem] rounded-full border-2 ${scoreBorder}`}>
            <span className={`text-lg font-bold leading-none tabular-nums ${scoreColor}`}>{vendor.totalScore}</span>
            <span className={`text-[9px] font-semibold ${scoreColor} leading-none mt-0.5 tracking-tight`}>AI Score</span>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {vendor.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                darkMode ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Score Bars */}
      <div className="px-5 py-4">
        <ScoreBar
          label={`Delivery · ${WEIGHTS.delivery}% weight`}
          score={vendor.deliveryScore}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          animated={animated}
          darkMode={darkMode}
        />
        <ScoreBar
          label={`Price · ${WEIGHTS.price}% weight`}
          score={vendor.priceScore}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          animated={animated}
          darkMode={darkMode}
        />
        <ScoreBar
          label={`Rating · ${WEIGHTS.rating}% weight`}
          score={vendor.ratingScore}
          color="bg-gradient-to-r from-violet-500 to-purple-600"
          animated={animated}
          darkMode={darkMode}
        />
      </div>

      {/* Meta Row */}
      <div className={`px-5 py-3.5 border-t ${divider} grid grid-cols-3 gap-2`}>
        {[
          { label: "Lead Time", value: vendor.leadTime },
          { label: "Price", value: vendor.pricePerKg },
          { label: "On Time", value: vendor.onTimeRate },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className={`text-[10px] uppercase font-bold tracking-wider ${textSecondary} mb-0.5`}>{label}</p>
            <p className={`text-xs font-bold ${textPrimary}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Deliveries stat */}
      <div className={`px-5 py-3 border-t ${divider} flex items-center justify-between`}>
        <span className={`text-xs ${textSecondary}`}>Past deliveries</span>
        <span className={`text-xs font-bold ${textPrimary}`}>{vendor.pastDeliveries} orders</span>
      </div>
    </div>
  );
}

export default function VendorComparisonDashboard({ darkMode }: { darkMode: boolean }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const border = darkMode ? "border-slate-700" : "border-slate-200";
  const cardBg = darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200";
  const textPrimary = darkMode ? "text-white" : "text-slate-900";
  const textSecondary = darkMode ? "text-slate-400" : "text-slate-500";
  const theadBg = darkMode ? "bg-slate-900/60" : "bg-slate-50";
  const rowHover = darkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50";

  const statusColor = (status: string) => {
    const s = status.toLowerCase();
    if (["active", "preferred"].some((k) => s.includes(k)))
      return darkMode ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (["review"].some((k) => s.includes(k)))
      return darkMode ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-700 border-amber-200";
    return darkMode ? "bg-slate-700/50 text-slate-400 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="w-full p-4 lg:p-6 xl:p-8 fade-slide-up">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-2xl shadow-lg">
            ◉
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>AI Vendor Matrix</h1>
            <p className={`text-sm ${textSecondary}`}>Live comparison dashboard · Inventory Vendor</p>
          </div>
        </div>
        <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
          + Add Vendor
        </button>
      </div>

      {/* Critical Alert Banner */}
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-5 border ${darkMode ? "bg-rose-500/10 border-rose-500/30" : "bg-rose-50 border-rose-200"}`}>
        <span className="text-rose-500 text-lg shrink-0">⚠</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${darkMode ? "text-rose-400" : "text-rose-700"}`}>
            Raw Steel at 22% stock — CRITICAL LOW
          </p>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-rose-400/70" : "text-rose-500"}`}>
            AI Sourcing Agent comparing top 3 vendors · Auto-drafting RFQs on approval
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative inline-flex w-2.5 h-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-rose-500" />
          </span>
          <span className={`text-xs font-semibold ${darkMode ? "text-rose-400" : "text-rose-600"}`}>Live</span>
        </div>
      </div>

      {/* Formula Banner */}
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl mb-8 border ${darkMode ? "bg-violet-500/10 border-violet-500/30" : "bg-violet-50 border-violet-200"}`}>
        <span className="text-violet-500 shrink-0">✦</span>
        <p className={`text-xs leading-relaxed ${darkMode ? "text-violet-300" : "text-violet-700"}`}>
          <span className="font-bold">AI Scoring Formula: </span>
          Score = (<span className="font-bold text-blue-500">40%</span> × Delivery Score) + (<span className="font-bold text-emerald-500">35%</span> × Price Score) + (<span className="font-bold text-violet-500">25%</span> × Rating Score)
        </p>
      </div>

      {/* Vendor Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" style={{ paddingTop: "16px" }}>
        {VENDOR_COMPARISONS.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} animated={animated} darkMode={darkMode} />
        ))}
      </div>

      {/* All Vendors Table */}
      <div>
        <h2 className={`text-base font-bold ${textPrimary} mb-4`}>All Vendors</h2>
        <div className={`w-full ${cardBg} border rounded-2xl shadow-xl overflow-hidden`}>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className={`${theadBg} border-b ${border}`}>
                  {["Vendor", "Contact", "Material", "Lead Time", "Rating", "Status"].map((h) => (
                    <th key={h} className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider ${textSecondary} whitespace-nowrap`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_VENDORS.map((row, ri) => (
                  <tr key={ri} className={`border-b ${border} last:border-b-0 ${rowHover} transition-colors duration-150`}>
                    <td className={`px-5 py-4 text-sm font-semibold ${textPrimary} whitespace-nowrap`}>{row.vendor}</td>
                    <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} whitespace-nowrap`}>{row.contact}</td>
                    <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} whitespace-nowrap`}>{row.material}</td>
                    <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} whitespace-nowrap`}>{row.leadTime}</td>
                    <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-600"} whitespace-nowrap`}>{row.rating}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
