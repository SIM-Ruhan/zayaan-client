"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Banknote, CreditCard } from "lucide-react";
import { api, money, price } from "@/lib/api";
import { useApp } from "@/components/Providers";

function Inner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useApp();
  const [items, setItems] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [pay, setPay] = useState("cod");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const fromCart = sp.get("cart") === "1";

  useEffect(() => {
    if (user === null) router.replace("/login?next=/checkout?" + sp.toString());
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name }));
    (async () => {
      if (fromCart) {
        const c = await api("/cart");
        setItems(c.map((r) => ({ productId: r.productId, size: r.size, qty: r.qty, name: r.product.name, image: r.product.image, price: price(r.product) })));
      } else {
        const p = await api(`/products/${sp.get("buy")}`);
        setItems([{ productId: p._id, size: sp.get("size") || "", qty: Number(sp.get("qty")) || 1, name: p.name, image: p.image, price: price(p) }]);
      }
    })().catch(() => setItems([]));
  }, [user]); // eslint-disable-line

  const subtotal = (items || []).reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 100;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await api("/orders", { method: "POST", body: {
        fromCart, shipping: form, paymentMethod: pay,
        items: items.map(({ productId, size, qty }) => ({ productId, size, qty })),
      } });
      if (r.url) window.location.href = r.url;
      else router.push(`/payment/success?orderId=${r.orderId}&method=cod`);
    } catch (e2) { setErr(e2.message); setBusy(false); }
  };

  if (!items) return <p className="p-16 text-center">Loading checkout…</p>;
  if (!items.length) return <p className="p-16 text-center">Nothing to checkout.</p>;

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <div className="card grid gap-4 p-5 sm:grid-cols-2">
          <div><label className="label" htmlFor="n">Full name</label><input id="n" required className="input" value={form.name} onChange={set("name")} /></div>
          <div><label className="label" htmlFor="p">Phone</label><input id="p" required type="tel" pattern="[0-9+\- ]{10,15}" className="input" value={form.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" /></div>
          <div className="sm:col-span-2"><label className="label" htmlFor="a">Delivery address</label><input id="a" required className="input" value={form.address} onChange={set("address")} /></div>
          <div><label className="label" htmlFor="c">City / District</label><input id="c" required className="input" value={form.city} onChange={set("city")} /></div>
          <div><label className="label" htmlFor="no">Order notes (optional)</label><input id="no" className="input" value={form.notes} onChange={set("notes")} /></div>
        </div>
        <div className="card space-y-3 p-5">
          <p className="label">Payment method</p>
          {[["cod", Banknote, "Cash on Delivery", "Pay when you receive the parcel"], ["online", CreditCard, "Online Payment", "Card, bKash, Nagad & more via SSLCOMMERZ"]].map(([v, Icon, t, d]) => (
            <label key={v} className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border p-3 ${pay === v ? "border-maroon bg-maroon/5" : "border-ink/15"}`}>
              <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} />
              <Icon className="size-5" />
              <span><span className="block text-sm font-semibold">{t}</span><span className="text-xs text-ink/60">{d}</span></span>
            </label>
          ))}
        </div>
      </div>

      <aside className="card h-fit space-y-4 p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Order summary</h2>
        {items.map((i) => (
          <div key={i.productId + i.size} className="flex gap-3 text-sm">
            <img src={i.image} alt="" className="size-16 rounded-lg object-cover" />
            <div className="flex-1"><p className="font-semibold">{i.name}</p><p className="text-ink/60">{i.size && `Size ${i.size} · `}Qty {i.qty}</p></div>
            <p className="font-semibold">{money(i.price * i.qty)}</p>
          </div>
        ))}
        <div className="space-y-1 border-t border-ink/10 pt-3 text-sm">
          <p className="flex justify-between"><span>Subtotal</span>{money(subtotal)}</p>
          <p className="flex justify-between"><span>Shipping</span>{shipping ? money(shipping) : "Free"}</p>
          <p className="flex justify-between pt-2 text-lg font-bold"><span>Total</span>{money(subtotal + shipping)}</p>
        </div>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Placing order…" : pay === "online" ? "Pay now" : "Place order"}</button>
      </aside>
    </form>
  );
}

export default function Checkout() {
  return <Suspense fallback={<p className="p-16 text-center">Loading…</p>}><Inner /></Suspense>;
}
