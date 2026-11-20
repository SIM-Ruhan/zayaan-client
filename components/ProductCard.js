"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { money, price, discountPct } from "@/lib/api";

export default function ProductCard({ p, index = 0 }) {
  const off = discountPct(p);
  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }} whileHover={{ y: -4 }} className="card group overflow-hidden">
      <Link href={`/products/${p._id}`} className="relative block aspect-[3/4] overflow-hidden bg-cream">
        <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-maroon px-2.5 py-1 text-xs font-bold text-white">-{off}%</span>}
        {p.stock <= 0 && <span className="absolute inset-0 grid place-items-center bg-white/70 font-semibold">Out of stock</span>}
      </Link>
      <div className="space-y-1.5 p-4">
        <p className="text-xs uppercase tracking-wide text-ink/50">{p.category} · {p.season}</p>
        <h3 className="line-clamp-1 font-sans text-base font-semibold">{p.name}</h3>
        <p className="flex items-baseline gap-2">
          <span className="font-bold text-maroon">{money(price(p))}</span>
          {off > 0 && <span className="text-sm text-ink/40 line-through">{money(p.price)}</span>}
        </p>
        <Link href={`/products/${p._id}`} className="btn btn-dark mt-2 w-full">View details</Link>
      </div>
    </motion.article>
  );
}
