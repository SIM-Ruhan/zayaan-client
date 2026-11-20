"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function ProductRow({ title, subtitle, query, href }) {
  const [items, setItems] = useState(null);
  useEffect(() => { api(`/products?${query}&limit=8`).then((d) => setItems(d.items)).catch(() => setItems([])); }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <Reveal className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
        </div>
        <Link href={href} className="text-sm font-semibold text-maroon hover:underline">View all →</Link>
      </Reveal>
      {items === null ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card aspect-[3/4] animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <p className="card p-8 text-center text-ink/60">No products here yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{items.map((p, i) => <ProductCard key={p._id} p={p} index={i} />)}</div>
      )}
    </section>
  );
}
