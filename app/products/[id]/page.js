"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Zap, Star, Minus, Plus } from "lucide-react";
import { api, money, price, discountPct } from "@/lib/api";
import { useApp } from "@/components/Providers";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { user, setCartCount } = useApp();
  const router = useRouter();
  const [p, setP] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { api(`/products/${id}`).then((d) => { setP(d); setSize(d.sizes?.[0] || ""); }).catch(() => setP(false)); }, [id]);
  if (p === false) return <p className="p-16 text-center">Product not found.</p>;
  if (!p) return <div className="mx-auto max-w-6xl animate-pulse p-10"><div className="aspect-[4/3] rounded-2xl bg-white" /></div>;

  const off = discountPct(p);
  const needLogin = () => { router.push(`/login?next=/products/${id}`); };

  const addToCart = async () => {
    if (!user) return needLogin();
    setBusy(true); setMsg("");
    try {
      const r = await api("/cart", { method: "POST", body: { productId: id, size, qty } });
      const cart = await api("/cart");
      setCartCount(cart.reduce((s, i) => s + i.qty, 0));
      setMsg("Added to cart ✓");
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  };
  const buyNow = () => {
    if (!user) return needLogin();
    router.push(`/checkout?buy=${id}&size=${encodeURIComponent(size)}&qty=${qty}`);
  };
  const avg = p.reviews?.length ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="overflow-hidden rounded-3xl bg-white">
          <img src={p.image} alt={p.name} className="aspect-[4/5] size-full object-cover" />
        </motion.div>
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-wide text-ink/50">{p.category} · {p.season}</p>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          {avg && <p className="flex items-center gap-1 text-sm"><Star className="size-4 fill-gold text-gold" /> {avg} ({p.reviews.length} reviews)</p>}
          <p className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-maroon">{money(price(p))}</span>
            {off > 0 && <><span className="text-lg text-ink/40 line-through">{money(p.price)}</span><span className="rounded-full bg-maroon/10 px-2 py-0.5 text-sm font-semibold text-maroon">{off}% off</span></>}
          </p>
          <p className="whitespace-pre-line leading-relaxed text-ink/75">{p.description}</p>

          {p.sizes?.length > 0 && (
            <div>
              <p className="label">Size</p>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button key={s} onClick={() => setSize(s)} className={`min-h-[44px] min-w-[44px] rounded-xl border px-3 text-sm font-semibold ${size === s ? "border-ink bg-ink text-white" : "border-ink/20 bg-white"}`}>{s}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className="label">Quantity</p>
            <div className="inline-flex items-center rounded-full border border-ink/20 bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="grid size-11 place-items-center"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock || 1, qty + 1))} aria-label="Increase" className="grid size-11 place-items-center"><Plus className="size-4" /></button>
            </div>
            <span className="ml-3 text-sm text-ink/60">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={addToCart} disabled={busy || p.stock <= 0} className="btn btn-outline flex-1"><ShoppingBag className="size-4" /> Add to cart</button>
            <button onClick={buyNow} disabled={p.stock <= 0} className="btn btn-primary flex-1"><Zap className="size-4" /> Buy now</button>
          </div>
          {msg && <p role="status" className="text-sm font-medium text-emerald-700">{msg}</p>}
        </div>
      </div>

      {p.reviews?.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-2xl font-bold">Customer reviews</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.reviews.map((r) => (
              <div key={r._id} className="card p-4">
                <p className="flex items-center gap-1">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="size-4 fill-gold text-gold" />)}</p>
                <p className="mt-2 text-sm">{r.comment}</p>
                <p className="mt-2 text-xs text-ink/50">— {r.userName}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
