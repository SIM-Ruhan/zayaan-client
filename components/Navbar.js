"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingBag, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useApp } from "./Providers";
import { authClient } from "@/lib/auth-client";

const NAV = [
  ["Home", "/"],
  ["All", "/all-products"],
  ["Winter", "/all-products?season=Winter"],
  ["Summer", "/all-products?season=Summer"],
  ["Men", "/all-products?category=Men"],
  ["Women", "/all-products?category=Women"],
  ["Kids", "/all-products?category=Kids"],
  ["Best Deals", "/all-products?deals=1"],
  ["New Arrivals", "/all-products?isNew=1"],
];

export function Logo({ light }) {
  return (
    <Link href="/" className={`font-serif text-2xl font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      Zayaan<span className="text-gold">.</span>com
    </Link>
  );
}

export default function Navbar() {
  const { user, cartCount, refresh } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const search = (e) => {
    e.preventDefault();
    router.push(`/all-products?search=${encodeURIComponent(q)}`);
  };
  const logout = async () => {
    await authClient.signOut();
    setOpen(false);
    await refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Logo />
        <form onSubmit={search} className="relative mx-auto hidden max-w-xl flex-1 md:block">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search kurta, panjabi, sweater…" aria-label="Search products" className="input rounded-full pl-10" />
        </form>

        <div className="ml-auto flex items-center gap-2">
          {user === undefined ? null : user ? (
            <div className="relative" ref={ref}>
              <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 rounded-full border border-ink/15 bg-white p-1 pr-2" aria-label="Account menu">
                {user.image ? <img src={user.image} alt="" className="size-8 rounded-full object-cover" /> :
                  <span className="grid size-8 place-items-center rounded-full bg-maroon text-sm font-bold text-white">{user.name?.[0]?.toUpperCase()}</span>}
                <ChevronDown className="size-4" />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl">
                    <div className="border-b border-ink/10 px-4 py-3">
                      <p className="truncate font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-ink/60">{user.email}</p>
                    </div>
                    <Link href={user.isAdmin ? "/admin" : "/dashboard"} onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-cream">
                      <LayoutDashboard className="size-4" /> Dashboard
                    </Link>
                    <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-maroon hover:bg-cream">
                      <LogOut className="size-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline hidden sm:inline-flex">Sign in</Link>
              <Link href="/register" className="btn btn-primary">Sign up</Link>
            </>
          )}
          <Link href={user ? "/dashboard?tab=cart" : "/login?next=/dashboard?tab=cart"} className="relative grid size-11 place-items-center rounded-full border border-ink/15 bg-white" aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBag className="size-5" />
            <motion.span key={cartCount} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-maroon px-1 text-[11px] font-bold text-white">
              {cartCount}
            </motion.span>
          </Link>
        </div>
      </div>

      <form onSubmit={search} className="relative px-4 pb-3 md:hidden">
        <Search className="absolute left-7 top-1/2 size-4 -translate-y-[70%] text-ink/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" aria-label="Search products" className="input rounded-full pl-10" />
      </form>

      <nav className="border-t border-ink/10 bg-white/60">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 text-sm font-medium [scrollbar-width:none] md:justify-center md:gap-4">
          {NAV.map(([label, href]) => (
            <li key={label}>
              <Link href={href} className="block whitespace-nowrap px-3 py-3 transition hover:text-maroon">{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
