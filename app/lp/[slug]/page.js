"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Minus, Plus, RefreshCw, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { api, money, price, discountPct } from "@/lib/api";
import { useApp } from "@/components/Providers";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const WHY = [
  { Icon: RefreshCw, title: "Easy 7 days exchange", pills: [] },
  { Icon: CreditCard, title: "Buy with", pills: ["Cash on Delivery", "Online"] },
  { Icon: Truck, title: "Free delivery over ৳3000", pills: [] },
];

export default function Landing({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user, setCartCount } = useApp();
  const [l, setL] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api(`/landings/${slug}`)
      .then((d) => { setL(d); setSize(d.product?.sizes?.[0] || ""); })
      .catch(() => setL(false));
  }, [slug]);

  if (l === false || (l && !l.product)) return <p className="p-16 text-center">Page not found.</p>;
  if (!l) return <p className="p-16 text-center">Loading…</p>;

  const p = l.product;
  const images = p.images?.length ? p.images : [p.image];
  const off = discountPct(p);
  const soldOut = p.stock <= 0;

  const buy = () => router.push(`/checkout?buy=${p._id}&size=${encodeURIComponent(size)}&qty=${qty}`);
  const addToBag = async () => {
    if (!user) return router.push(`/login?next=/lp/${slug}`);
    setMsg("");
    try {
      await api("/cart", { method: "POST", body: { productId: p._id, size, qty } });
      const cart = await api("/cart");
      setCartCount(cart.reduce((s, i) => s + i.qty, 0));
      setMsg("Added to bag ✓");
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div className="min-h-screen"><Navbar/> 
      <div className="mx-auto max-w-[95%] px-4 py-8">
      

        {/* Headline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{l.headline}</h1>
          {l.subtitle && <p className="mt-3 text-lg text-ink/70">{l.subtitle}</p>}
        </motion.div>

        {/* Gallery (left) + details (right) */}
        <div className="mx-auto mt-6 grid w-full min-w-0 max-w-7xl grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8 lg:gap-12">
  {/* Gallery */}
  <div className="flex min-w-0 flex-col gap-3 md:sticky md:top-6 md:flex-row md:self-start">
    {images.length > 1 && (
      <div className="order-2 min-w-0 md:relative md:order-first md:w-16 md:shrink-0 lg:w-20">
        <div className="flex gap-2 overflow-x-auto pb-1 md:absolute md:inset-0 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:pb-0">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={active === i}
              className={`aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg border-2 md:w-full ${
                active === i
                  ? "border-ink"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt=""
                className="block h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="relative min-w-0 md:flex-1">
      <div className="relative aspect-[4/5] max-h-[70svh] w-full overflow-hidden rounded-2xl bg-neutral-50 md:max-h-[calc(100svh-3rem)]">
        <AnimatePresence mode="wait" initial={false}>
          {images[active] && (
            <motion.img
              key={images[active]}
              src={images[active]}
              alt={p.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 block h-full w-full object-contain"
            />
          )}
        </AnimatePresence>

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-maroon px-3 py-1 text-xs font-bold text-white">
            -{off}%
          </span>
        )}
      </div>
    </div>
  </div>

  {/* Product details */}
  <div className="min-w-0">
    <h2 className="break-words font-sans text-xl font-medium leading-snug">
      {p.name}
    </h2>

    <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-2xl font-bold sm:text-3xl">{money(price(p))}</span>
      {off > 0 && (
        <>
          <span className="text-base text-ink/40 line-through sm:text-lg">
            {money(p.price)}
          </span>
          <span className="text-base font-semibold text-red-600 sm:text-lg">
            -{off}% off
          </span>
        </>
      )}
    </p>

    <div className="mt-5 flex items-start gap-3 border-y border-ink/10 py-4 text-sm">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-ink/50" />
      <p>
        <b>Free delivery</b> on orders over ৳3000 — Cash on delivery available.
      </p>
    </div>

    {p.sizes?.length > 0 && (
      <div className="mt-6">
        <p className="text-lg font-semibold">Size</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-5 pb-3">
          {p.sizes.map((s) => (
            <div key={s} className="relative">
              <button
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={`min-h-12 min-w-14 rounded-lg px-4 text-sm font-semibold ${
                  size === s
                    ? "border border-ink bg-white"
                    : "border-2 border-dotted border-ink/25 text-ink/60"
                }`}
              >
                {s}
              </button>
              {size === s && p.stock > 0 && p.stock <= 10 && (
                <span className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-1.5 text-[11px] text-red-700">
                  {p.stock} left
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="mt-6">
      <p className="text-lg font-semibold">Quantity</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-xl border border-ink/20 bg-white">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Decrease quantity"
            className="grid size-12 place-items-center"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty(Math.min(p.stock || 1, qty + 1))}
            aria-label="Increase quantity"
            className="grid size-12 place-items-center"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <span className="text-sm text-ink/60">
          {soldOut ? "Out of stock" : `${p.stock} available`}
        </span>
      </div>
    </div>

    <div className="mt-7 space-y-3">
      <button
        type="button"
        onClick={addToBag}
        disabled={soldOut}
        className="btn btn-dark w-full !rounded-xl !py-4 text-base"
      >
        <ShoppingBag className="size-4" />
        Add to bag
      </button>
      <button
        type="button"
        onClick={buy}
        disabled={soldOut}
        className="btn btn-outline w-full !rounded-xl !py-4 text-base"
      >
        Buy Now
      </button>
      {msg && (
        <p role="status" className="text-center text-sm font-medium text-emerald-700">
          {msg}
        </p>
      )}
    </div>
  </div>
</div>

        {/* Description */}
        {p.description && (
          <div className="mt-10">
            <h2 className="mb-2 font-sans text-sm font-bold">Description</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/75">{p.description}</p>
          </div>
        )}

        {/* Why buy from us */}
        <div className="mt-8">
          <h2 className="mb-3 font-sans text-sm font-bold">Why buy from us?</h2>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10">
            {WHY.map(({ Icon, title, pills }) => (
              <div key={title} className="space-y-2 bg-white p-3 text-xs">
                <span className="grid size-7 place-items-center rounded-md border border-ink/15 bg-cream"><Icon className="size-4 text-ink/70" /></span>
                <p className="font-medium leading-snug">{title}</p>
                {pills.length > 0 && <div className="flex flex-wrap gap-1">{pills.map((x) => <span key={x} className="rounded-md border border-ink/20 px-1.5 py-0.5 text-[10px]">{x}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Similar products (same category) */}
        {l.similar?.length > 0 && (
          <section className="mt-12 border-t border-ink/10 pt-8">
            <h2 className="mb-4 text-2xl font-bold">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{l.similar.map((s, i) => <ProductCard key={s._id} p={s} index={i} />)}</div>
          </section>
        )}

        
      </div>
      <Footer/>
    </div>
  );
 
}