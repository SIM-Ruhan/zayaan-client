"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

const FILTER_KEYS = ["search", "category", "season", "minPrice", "maxPrice", "sort", "deals", "isNew"];

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const key = sp.toString();
  const [data, setData] = useState(null);
  const [f, setF] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // URL -> products + local filter state
  useEffect(() => {
    setF(Object.fromEntries(sp.entries()));
    setData(null);
    api(`/products?${key}&limit=12`)
      .then(setData)
      .catch(() => setData({ items: [], total: 0, pages: 1 }));
  }, [key]); // eslint-disable-line

  // Local filter state -> URL (auto-apply, debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams();
      FILTER_KEYS.forEach((k) => { if (f[k]) next.set(k, f[k]); });
      const current = new URLSearchParams(sp);
      current.delete("page");
      if (next.toString() !== current.toString()) {
        router.push(`/all-products?${next.toString()}`, { scroll: false });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [f]); // eslint-disable-line

  const set = (k) => (e) =>
    setF({ ...f, [k]: e.target.type === "checkbox" ? (e.target.checked ? "1" : "") : e.target.value });

  const page = Number(sp.get("page") || 1);
  const goPage = (n) => {
    const p = new URLSearchParams(sp);
    p.set("page", n);
    router.push(`/all-products?${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const hasFilters = FILTER_KEYS.some((k) => f[k]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-sm text-ink/60">{data ? `${data.total} items` : "Loading…"}</p>
      </div>

      {/* Filter bar (top, auto-apply) */}
      <div className="card mb-8 space-y-4 p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input
              aria-label="Search products"
              className="input pl-10"
              value={f.search || ""}
              onChange={set("search")}
              placeholder="Search products…"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline lg:hidden" aria-label="Toggle filters">
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>

        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(6,minmax(0,1fr))_auto] lg:items-end ${showFilters ? "grid" : "hidden lg:grid"}`}>
          <div>
            <label className="label" htmlFor="c">Category</label>
            <select id="c" className="input" value={f.category || ""} onChange={set("category")}>
              <option value="">All</option><option>Men</option><option>Women</option><option>Kids</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="se">Season</label>
            <select id="se" className="input" value={f.season || ""} onChange={set("season")}>
              <option value="">All</option><option>Winter</option><option>Summer</option><option>All-Season</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="mn">Min ৳</label>
            <input id="mn" type="number" min="0" className="input" value={f.minPrice || ""} onChange={set("minPrice")} />
          </div>
          <div>
            <label className="label" htmlFor="mx">Max ৳</label>
            <input id="mx" type="number" min="0" className="input" value={f.maxPrice || ""} onChange={set("maxPrice")} />
          </div>
          <div>
            <label className="label" htmlFor="so">Sort by</label>
            <select id="so" className="input" value={f.sort || ""} onChange={set("sort")}>
              <option value="">Newest</option>
              <option value="priceAsc">Price: low to high</option>
              <option value="priceDesc">Price: high to low</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-x-4">
            <label className="flex min-h-[44px] items-center gap-2 whitespace-nowrap text-sm">
              <input type="checkbox" checked={f.deals === "1"} onChange={set("deals")} /> Best deals
            </label>
            <label className="flex min-h-[44px] items-center gap-2 whitespace-nowrap text-sm">
              <input type="checkbox" checked={f.isNew === "1"} onChange={set("isNew")} /> New arrivals
            </label>
          </div>
          {hasFilters && (
            <button onClick={() => { setF({}); router.push("/all-products"); }} className="btn btn-outline">
              <X className="size-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {!data ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card aspect-[3/4] animate-pulse" />)}
        </div>
      ) : data.items.length === 0 ? (
        <p className="card p-10 text-center text-ink/60">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.items.map((p, i) => <ProductCard key={p._id} p={p} index={i} />)}
        </div>
      )}

      {data?.pages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: data.pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goPage(i + 1)}
              className={`size-11 rounded-full border text-sm font-semibold ${page === i + 1 ? "border-maroon bg-maroon text-white" : "border-ink/15 bg-white"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllProducts() {
  return <Suspense fallback={<div className="p-10">Loading…</div>}><Inner /></Suspense>;
}