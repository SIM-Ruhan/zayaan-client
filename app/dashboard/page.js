"use client";
import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { LayoutGrid, ShoppingBag, Package, Star, Trash2, Minus, Plus } from "lucide-react";
import DashShell, { Badge, Stat } from "@/components/DashShell";
import { api, money, price } from "@/lib/api";
import { useApp } from "@/components/Providers";

const ITEMS = [
  { key: "overview", label: "Overview", Icon: LayoutGrid },
  { key: "cart", label: "My Cart", Icon: ShoppingBag },
  { key: "orders", label: "My Orders", Icon: Package },
  { key: "reviews", label: "Waiting for Review", Icon: Star },
];

function OrderCard({ o }) {
  return (
    <div className="card space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-sm font-semibold">{o.orderId}</p>
        <div className="flex gap-2"><Badge s={o.status} /><Badge s={o.paymentStatus} /></div>
      </div>
      {o.items.map((i, k) => (
        <div key={k} className="flex items-center gap-3 text-sm">
          <img src={i.image} alt="" className="size-12 rounded-lg object-cover" />
          <span className="flex-1">{i.name} {i.size && `(${i.size})`} × {i.qty}</span><span>{money(i.price * i.qty)}</span>
        </div>
      ))}
      <p className="flex justify-between border-t border-ink/10 pt-2 text-sm font-bold"><span>{new Date(o.createdAt).toLocaleDateString()} · {o.paymentMethod.toUpperCase()}</span>{money(o.total)}</p>
    </div>
  );
}

function CartTab({ cart, reload }) {
  const { setCartCount } = useApp();
  const total = cart.reduce((s, r) => s + price(r.product) * r.qty, 0);
  const sync = async () => { await reload(); };
  useEffect(() => { setCartCount(cart.reduce((s, r) => s + r.qty, 0)); }, [cart]); // eslint-disable-line
  const upd = async (r, q) => { q < 1 ? await api(`/cart/${r._id}`, { method: "DELETE" }) : await api(`/cart/${r._id}`, { method: "PATCH", body: { qty: q } }); sync(); };
  if (!cart.length) return <p className="card p-10 text-center text-ink/60">Your cart is empty. <Link href="/all-products" className="font-semibold text-maroon">Start shopping</Link></p>;
  return (
    <div className="space-y-3">
      {cart.map((r) => (
        <div key={r._id} className="card flex items-center gap-4 p-3">
          <img src={r.product.image} alt="" className="size-20 rounded-xl object-cover" />
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{r.product.name}</p><p className="text-sm text-ink/60">{r.size && `Size ${r.size} · `}{money(price(r.product))}</p></div>
          <div className="flex items-center rounded-full border border-ink/15">
            <button onClick={() => upd(r, r.qty - 1)} aria-label="Decrease" className="grid size-10 place-items-center"><Minus className="size-4" /></button>
            <span className="w-6 text-center text-sm font-semibold">{r.qty}</span>
            <button onClick={() => upd(r, r.qty + 1)} aria-label="Increase" className="grid size-10 place-items-center"><Plus className="size-4" /></button>
          </div>
          <button onClick={() => upd(r, 0)} aria-label="Remove" className="grid size-10 place-items-center text-maroon"><Trash2 className="size-4" /></button>
        </div>
      ))}
      <div className="card flex items-center justify-between p-4"><p className="text-lg font-bold">Subtotal: {money(total)}</p><Link href="/checkout?cart=1" className="btn btn-primary">Checkout</Link></div>
    </div>
  );
}

function ReviewForm({ item, done }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const submit = async (e) => { e.preventDefault(); await api("/reviews", { method: "POST", body: { orderId: item.orderId, productId: item.productId, rating, comment } }); done(); };
  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <div className="flex items-center gap-3"><img src={item.image} alt="" className="size-14 rounded-lg object-cover" /><div><p className="font-semibold">{item.name}</p><p className="font-mono text-xs text-ink/50">{item.orderId}</p></div></div>
      <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className="grid size-10 place-items-center"><Star className={`size-6 ${n <= rating ? "fill-gold text-gold" : "text-ink/25"}`} /></button>))}</div>
      <textarea className="input" rows={2} placeholder="How was it?" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn btn-dark">Submit review</button>
    </form>
  );
}

function Dash() {
  const { user } = useApp();
  const [d, setD] = useState({ cart: [], orders: [], pending: [] });
  const load = useCallback(async () => {
    const [cart, orders, pending] = await Promise.all([api("/cart"), api("/orders/mine"), api("/reviews/pending")]);
    setD({ cart, orders, pending });
  }, []);
  useEffect(() => { if (user) load().catch(() => {}); }, [user, load]);

  return (
    <DashShell items={ITEMS} def="overview">
      {(tab) => (
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">{ITEMS.find((i) => i.key === tab)?.label}</h1>
          {tab === "overview" && <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="In cart" value={d.cart.reduce((s, r) => s + r.qty, 0)} /><Stat label="Orders" value={d.orders.length} /><Stat label="Waiting for review" value={d.pending.length} />
            </div>
            <h2 className="text-xl font-bold">Recent orders</h2>
            {d.orders.slice(0, 3).map((o) => <OrderCard key={o.orderId} o={o} />)}
            {!d.orders.length && <p className="text-ink/60">No orders yet.</p>}
          </>}
          {tab === "cart" && <CartTab cart={d.cart} reload={load} />}
          {tab === "orders" && (d.orders.length ? d.orders.map((o) => <OrderCard key={o.orderId} o={o} />) : <p className="card p-10 text-center text-ink/60">No orders yet.</p>)}
          {tab === "reviews" && (d.pending.length ? d.pending.map((i) => <ReviewForm key={i.orderId + i.productId} item={i} done={load} />) : <p className="card p-10 text-center text-ink/60">Nothing waiting for review. Delivered items appear here.</p>)}
        </div>
      )}
    </DashShell>
  );
}

export default function Page() { return <Suspense><Dash /></Suspense>; }
