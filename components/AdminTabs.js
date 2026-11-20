"use client";
import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Sparkles, Flame, Copy } from "lucide-react";
import { api, money, price } from "@/lib/api";
import { Badge, Stat } from "./DashShell";

/* ---------- Overview ---------- */
export function Overview() {
  const [d, setD] = useState(null);
  useEffect(() => { api("/admin/overview").then(setD).catch(() => {}); }, []);
  if (!d) return <p>Loading…</p>;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Revenue" value={money(d.revenue)} /><Stat label="Orders" value={d.orders} /><Stat label="Pending" value={d.pending} />
        <Stat label="Products" value={d.products} /><Stat label="Users" value={d.users} />
      </div>
      <h2 className="text-xl font-bold">Recent orders</h2>
      <div className="card divide-y divide-ink/10">
        {d.recent.map((o) => (
          <div key={o.orderId} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span className="font-mono font-semibold">{o.orderId}</span><span>{o.shipping.name}</span><span>{money(o.total)}</span><Badge s={o.status} />
          </div>
        ))}
        {!d.recent.length && <p className="p-6 text-ink/60">No orders yet.</p>}
      </div>
    </>
  );
}

/* ---------- Products list ---------- */
export function ProductsTab({ onEdit }) {
  const [items, setItems] = useState(null);
  const load = useCallback(() => api("/products?limit=60").then((d) => setItems(d.items)), []);
  useEffect(() => { load(); }, [load]);
  const flag = async (p, k) => { await api(`/products/${p._id}/flags`, { method: "PATCH", body: { [k]: !p[k] } }); load(); };
  const del = async (p) => { if (confirm(`Delete "${p.name}"?`)) { await api(`/products/${p._id}`, { method: "DELETE" }); load(); } };
  if (!items) return <p>Loading…</p>;
  if (!items.length) return <p className="card p-10 text-center text-ink/60">No products yet. Use “Add Product”.</p>;
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-ink/10 text-xs uppercase text-ink/50"><tr><th className="p-3">Product</th><th>Category</th><th>Price</th><th>Stock</th><th className="pr-3 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-ink/10">
          {items.map((p) => (
            <tr key={p._id}>
              <td className="flex items-center gap-3 p-3"><img src={p.image} alt="" className="size-12 rounded-lg object-cover" /><span className="font-medium">{p.name}</span></td>
              <td>{p.category} · {p.season}</td><td>{money(price(p))}</td><td>{p.stock}</td>
              <td className="pr-3"><div className="flex justify-end gap-1.5">
                <button onClick={() => onEdit(p)} title="Edit" className="btn btn-outline !px-3"><Pencil className="size-4" /></button>
                <button onClick={() => flag(p, "isNew")} title="Toggle new collection" className={`btn !px-3 ${p.isNew ? "btn-dark" : "btn-outline"}`}><Sparkles className="size-4" /></button>
                <button onClick={() => flag(p, "trending")} title="Toggle trending" className={`btn !px-3 ${p.trending ? "btn-primary" : "btn-outline"}`}><Flame className="size-4" /></button>
                <button onClick={() => del(p)} title="Delete" className="btn btn-outline !px-3 text-maroon"><Trash2 className="size-4" /></button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-ink/10 p-3 text-xs text-ink/50">✨ = New arrivals · 🔥 = Trending in Bangladesh (filled = active)</p>
    </div>
  );
}

/* ---------- Image upload helper (ImgBB via backend) ---------- */
function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 3 * 1024 * 1024) return setErr("Max 3MB image");
    setBusy(true); setErr("");
    const b64 = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.readAsDataURL(file); });
    try { const { url } = await api("/upload", { method: "POST", body: { image: b64 } }); onChange(url); } catch (x) { setErr(x.message); }
    setBusy(false);
  };
  return (
    <div className="space-y-2">
      <input type="file" accept="image/*" onChange={pick} className="input" aria-label="Upload image" />
      {busy && <p className="text-sm">Uploading…</p>}{err && <p className="text-sm text-red-600">{err}</p>}
      {value && <img src={value} alt="Preview" className="h-32 rounded-xl object-cover" />}
    </div>
  );
}

/* ---------- Add / edit product ---------- */
export function ProductForm({ product, onSaved }) {
  const blank = { name: "", category: "Men", season: "All-Season", image: "", description: "", price: "", discountPrice: "", stock: "", sizes: "", isNew: false };
  const [f, setF] = useState(product ? { ...product, sizes: (product.sizes || []).join(", "), discountPrice: product.discountPrice || "" } : blank);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    if (!f.image) return setMsg("Please upload an image");
    try {
      if (product) await api(`/products/${product._id}`, { method: "PUT", body: f });
      else await api("/products", { method: "POST", body: f });
      setMsg(product ? "Product updated ✓" : "Product added ✓");
      if (!product) setF(blank);
      onSaved?.();
    } catch (x) { setMsg(x.message); }
  };
  return (
    <form onSubmit={submit} className="card grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
      {product && <p className="text-sm font-semibold text-maroon sm:col-span-2">Editing: {product.name}</p>}
      <div className="sm:col-span-2"><label className="label" htmlFor="pn">Name</label><input id="pn" required className="input" value={f.name} onChange={set("name")} /></div>
      <div><label className="label" htmlFor="pc">Category</label><select id="pc" className="input" value={f.category} onChange={set("category")}><option>Men</option><option>Women</option><option>Kids</option></select></div>
      <div><label className="label" htmlFor="ps">Season</label><select id="ps" className="input" value={f.season} onChange={set("season")}><option>All-Season</option><option>Winter</option><option>Summer</option></select></div>
      <div><label className="label" htmlFor="pp">Price (৳)</label><input id="pp" required type="number" min="1" className="input" value={f.price} onChange={set("price")} /></div>
      <div><label className="label" htmlFor="pd">Discount price (৳, optional)</label><input id="pd" type="number" min="0" className="input" value={f.discountPrice} onChange={set("discountPrice")} /></div>
      <div><label className="label" htmlFor="pst">Available stock</label><input id="pst" required type="number" min="0" className="input" value={f.stock} onChange={set("stock")} /></div>
      <div><label className="label" htmlFor="psz">Sizes (optional, comma separated)</label><input id="psz" className="input" placeholder="S, M, L, XL" value={f.sizes} onChange={set("sizes")} /></div>
      <div className="sm:col-span-2"><label className="label">Image</label><ImageField value={f.image} onChange={(u) => setF({ ...f, image: u })} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="pde">Details</label><textarea id="pde" rows={4} className="input" value={f.description} onChange={set("description")} /></div>
      <label className="flex min-h-[44px] items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={!!f.isNew} onChange={set("isNew")} /> Show in New Arrivals</label>
      <div className="flex items-center gap-4 sm:col-span-2"><button className="btn btn-primary">{product ? "Save changes" : "Add product"}</button>{msg && <p role="status" className="text-sm">{msg}</p>}</div>
    </form>
  );
}

/* ---------- Users ---------- */
export function UsersTab() {
  const [u, setU] = useState(null);
  useEffect(() => { api("/admin/users").then(setU).catch(() => setU([])); }, []);
  if (!u) return <p>Loading…</p>;
  return (
    <div className="card divide-y divide-ink/10">
      {u.map((x) => (
        <div key={x._id} className="flex items-center gap-3 p-4 text-sm">
          <span className="grid size-9 place-items-center rounded-full bg-maroon font-bold text-white">{x.name?.[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1"><p className="font-semibold">{x.name}</p><p className="truncate text-ink/60">{x.email}</p></div>
          <span className="text-xs text-ink/50">{x.createdAt && new Date(x.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
      {!u.length && <p className="p-6 text-ink/60">No users yet.</p>}
    </div>
  );
}

/* ---------- Orders ---------- */
export function OrdersTab() {
  const [status, setStatus] = useState("pending");
  const [o, setO] = useState(null);
  const load = useCallback(() => { setO(null); api(`/admin/orders${status ? `?status=${status}` : ""}`).then(setO); }, [status]);
  useEffect(() => { load(); }, [load]);
  const act = async (id, s) => { await api(`/admin/orders/${id}`, { method: "PATCH", body: { status: s } }); load(); };
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[["pending", "Pending"], ["confirmed", "Confirmed"], ["delivered", "Delivered"], ["cancelled", "Cancelled"], ["", "All"]].map(([v, l]) => (
          <button key={l} onClick={() => setStatus(v)} className={`btn ${status === v ? "btn-dark" : "btn-outline"}`}>{l}</button>
        ))}
      </div>
      {!o ? <p>Loading…</p> : !o.length ? <p className="card p-10 text-center text-ink/60">No orders.</p> : o.map((x) => (
        <div key={x.orderId} className="card space-y-3 p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono font-semibold">{x.orderId}</p>
            <div className="flex gap-2"><Badge s={x.status} /><Badge s={x.paymentStatus} /><span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold">{x.paymentMethod.toUpperCase()}</span></div>
          </div>
          <p><b>{x.shipping.name}</b> · {x.shipping.phone} · {x.userEmail}<br />{x.shipping.address}, {x.shipping.city}{x.shipping.notes && <><br />Note: {x.shipping.notes}</>}</p>
          <ul className="list-disc pl-5">{x.items.map((i, k) => <li key={k}>{i.name} {i.size && `(${i.size})`} × {i.qty} — {money(i.price * i.qty)}</li>)}</ul>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-3">
            <b>Total {money(x.total)}</b>
            <div className="flex gap-2">
              {x.status === "pending" && <button onClick={() => act(x.orderId, "confirmed")} className="btn btn-primary">Confirm order</button>}
              {x.status === "confirmed" && <button onClick={() => act(x.orderId, "delivered")} className="btn btn-dark">Mark delivered</button>}
              {["pending", "confirmed"].includes(x.status) && <button onClick={() => confirm("Cancel this order?") && act(x.orderId, "cancelled")} className="btn btn-outline text-maroon">Cancel</button>}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------- Multi image upload (ImgBB via backend) ---------- */
function MultiImageField({ value = [], onChange, max = 5 }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const add = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - value.length);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true); setErr("");
    const urls = [];
    for (const file of files) {
      if (file.size > 3 * 1024 * 1024) { setErr(`${file.name} is over 3MB`); continue; }
      const b64 = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.readAsDataURL(file); });
      try { const { url } = await api("/upload", { method: "POST", body: { image: b64 } }); urls.push(url); } catch (x) { setErr(x.message); }
    }
    onChange([...value, ...urls]);
    setBusy(false);
  };
  const remove = (i) => onChange(value.filter((_, k) => k !== i));
  const makeMain = (i) => onChange([value[i], ...value.filter((_, k) => k !== i)]);

  return (
    <div className="space-y-2">
      {value.length < max && <input type="file" accept="image/*" multiple onChange={add} className="input" aria-label="Upload images" />}
      <p className="text-xs text-ink/50">Up to {max} photos ({value.length}/{max}). The first one is the main image.</p>
      {busy && <p className="text-sm">Uploading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {value.map((u, i) => (
            <div key={u} className="space-y-1">
              <div className="relative">
                <img src={u} alt={`Photo ${i + 1}`} className="aspect-[4/5] w-full rounded-lg object-cover" />
                {i === 0 && <span className="absolute left-1 top-1 rounded bg-maroon px-1.5 text-[10px] font-bold text-white">MAIN</span>}
              </div>
              <div className="flex gap-1 text-[11px]">
                {i !== 0 && <button type="button" onClick={() => makeMain(i)} className="flex-1 rounded border border-ink/20 py-1">Main</button>}
                <button type="button" onClick={() => remove(i)} className="flex-1 rounded border border-ink/20 py-1 text-maroon">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Landing pages ---------- */
const BLANK_LP = { slug: "", title: "", headline: "", subtitle: "", category: "Men", price: "", discountPrice: "", stock: "", sizes: "", images: [], description: "" };

export function LandingsTab() {
  const [list, setList] = useState([]);
  const [f, setF] = useState(BLANK_LP);
  const [msg, setMsg] = useState("");
  const load = useCallback(() => api("/admin/landings").then(setList), []);
  useEffect(() => { load(); }, [load]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    if (!f.images.length) return setMsg("Please upload at least one product image");
    try {
      await api("/admin/landings", { method: "POST", body: f });
      setMsg(f.slug ? "Landing page updated ✓" : "Landing page created ✓");
      setF(BLANK_LP); load();
    } catch (x) { setMsg(x.message); }
  };
  const edit = (l) => {
    const p = l.product || {};
    setF({
      slug: l.slug, title: l.title, headline: l.headline, subtitle: l.subtitle, category: l.category,
      price: p.price || "", discountPrice: p.discountPrice || "", stock: p.stock ?? "", sizes: (p.sizes || []).join(", "),
      images: p.images?.length ? p.images : p.image ? [p.image] : [], description: p.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const del = async (id) => { if (confirm("Delete this landing page?")) { await api(`/admin/landings/${id}`, { method: "DELETE" }); load(); } };

  return (
    <>
      <form onSubmit={submit} className="card grid max-w-3xl gap-4 p-6 sm:grid-cols-2">
        {f.slug && <p className="text-sm font-semibold text-maroon sm:col-span-2">Editing /lp/{f.slug} (the URL stays the same)</p>}
        <div><label className="label" htmlFor="lt">Title (makes the URL)</label><input id="lt" required className="input" value={f.title} onChange={set("title")} /></div>
        <div><label className="label" htmlFor="lh">Headline</label><input id="lh" className="input" value={f.headline} onChange={set("headline")} /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="ls">Sub-headline</label><input id="ls" className="input" value={f.subtitle} onChange={set("subtitle")} /></div>
        <div className="sm:col-span-2"><label className="label">Product photos (up to 5)</label><MultiImageField value={f.images} onChange={(images) => setF({ ...f, images })} /></div>
        <div><label className="label" htmlFor="lp">Price (৳)</label><input id="lp" required type="number" min="1" className="input" value={f.price} onChange={set("price")} /></div>
        <div><label className="label" htmlFor="ld">Discount price (৳, optional)</label><input id="ld" type="number" min="0" className="input" value={f.discountPrice} onChange={set("discountPrice")} /></div>
        <div><label className="label" htmlFor="lq">Quantity (available stock)</label><input id="lq" required type="number" min="0" className="input" value={f.stock} onChange={set("stock")} /></div>
        <div><label className="label" htmlFor="lz">Sizes (optional, comma separated)</label><input id="lz" className="input" placeholder="S, M, L, XL" value={f.sizes} onChange={set("sizes")} /></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="lc">Category (similar products come from here)</label>
          <select id="lc" className="input" value={f.category} onChange={set("category")}><option>Men</option><option>Women</option><option>Kids</option></select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="lde">Description</label><textarea id="lde" rows={4} className="input" value={f.description} onChange={set("description")} /></div>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button className="btn btn-primary">{f.slug ? "Save changes" : "Create landing page"}</button>
          {f.slug && <button type="button" onClick={() => setF(BLANK_LP)} className="btn btn-outline">Cancel edit</button>}
          {msg && <p role="status" className="text-sm">{msg}</p>}
        </div>
      </form>

      <div className="card divide-y divide-ink/10">
        {list.map((l) => (
          <div key={l._id} className="flex flex-wrap items-center gap-3 p-4 text-sm">
            {l.product?.image && <img src={l.product.image} alt="" className="size-12 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1"><p className="font-semibold">{l.title}</p><a href={`/lp/${l.slug}`} target="_blank" className="text-maroon underline">/lp/{l.slug}</a></div>
            <div className="flex gap-2">
              <button onClick={() => navigator.clipboard.writeText(`${location.origin}/lp/${l.slug}`)} className="btn btn-outline"><Copy className="size-4" /> Copy link</button>
              <button onClick={() => edit(l)} className="btn btn-outline" aria-label="Edit"><Pencil className="size-4" /></button>
              <button onClick={() => del(l._id)} className="btn btn-outline text-maroon" aria-label="Delete"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {!list.length && <p className="p-6 text-ink/60">No landing pages yet.</p>}
      </div>
    </>
  );
}