"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogOut, Home } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useApp } from "./Providers";
import { Logo } from "./Navbar";

export default function DashShell({ items, def, adminOnly, children }) {
  const { user, refresh } = useApp();
  const router = useRouter();
  const sp = useSearchParams();
  const tab = sp.get("tab") || def;
  const setTab = (k) => router.replace(`?tab=${k}`, { scroll: false });

  useEffect(() => {
    if (user === null) router.replace("/login?next=" + (adminOnly ? "/admin" : "/dashboard"));
    else if (user && adminOnly && !user.isAdmin) router.replace("/");
  }, [user]); // eslint-disable-line

  if (!user || (adminOnly && !user.isAdmin)) return <p className="p-16 text-center">Loading…</p>;
  const logout = async () => { await authClient.signOut(); await refresh(); router.push("/"); };

  return (
    <div className="min-h-screen md:flex">
      <aside className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-white p-3 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-5">
        <div className="mr-3 hidden md:mb-6 md:block"><Logo /><p className="mt-1 text-xs text-ink/50">{adminOnly ? "Admin" : "My account"}</p></div>
        {items.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)} className={`flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium transition ${tab === key ? "bg-maroon text-white" : "hover:bg-cream"}`}>
            <Icon className="size-4" /> {label}
          </button>
        ))}
        <div className="flex gap-1 md:mt-auto md:flex-col md:border-t md:border-ink/10 md:pt-4">
          <Link href="/" className="flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm hover:bg-cream"><Home className="size-4" /> Back to store</Link>
          <button onClick={logout} className="flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium text-maroon hover:bg-cream"><LogOut className="size-4" /> Logout</button>
        </div>
      </aside>
      <section className="min-w-0 flex-1 p-4 sm:p-8">{children(tab, setTab)}</section>
    </div>
  );
}

export const Badge = ({ s }) => {
  const c = { pending: "bg-amber-100 text-amber-800", confirmed: "bg-sky-100 text-sky-800", delivered: "bg-emerald-100 text-emerald-800", cancelled: "bg-red-100 text-red-800", paid: "bg-emerald-100 text-emerald-800", unpaid: "bg-stone-200 text-stone-700" };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${c[s] || ""}`}>{s}</span>;
};
export const Stat = ({ label, value }) => (
  <div className="card p-5"><p className="text-xs uppercase tracking-wide text-ink/50">{label}</p><p className="mt-1 font-serif text-3xl font-bold">{value}</p></div>
);
