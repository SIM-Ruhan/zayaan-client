"use client";
import { Suspense } from "react";
import { LayoutGrid, Boxes, PlusSquare, Users, ClipboardList, Megaphone } from "lucide-react";
import DashShell from "@/components/DashShell";
import { Overview, ProductsTab, ProductForm, UsersTab, OrdersTab, LandingsTab } from "@/components/AdminTabs";
import { useState } from "react";

const ITEMS = [
  { key: "overview", label: "Overview", Icon: LayoutGrid },
  { key: "products", label: "All Products", Icon: Boxes },
  { key: "add", label: "Add Product", Icon: PlusSquare },
  { key: "users", label: "All Users", Icon: Users },
  { key: "orders", label: "Orders", Icon: ClipboardList },
  { key: "landing", label: "Landing Pages", Icon: Megaphone },
];

function Admin() {
  const [editing, setEditing] = useState(null);
  return (
    <DashShell items={ITEMS} def="overview" adminOnly>
      {(tab, setTab) => (
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold">{ITEMS.find((i) => i.key === tab)?.label}</h1>
          {tab === "overview" && <Overview />}
          {tab === "products" && <ProductsTab onEdit={(p) => { setEditing(p); setTab("add"); }} />}
          {tab === "add" && <ProductForm key={editing?._id || "new"} product={editing} onSaved={() => setEditing(null)} />}
          {tab === "users" && <UsersTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "landing" && <LandingsTab />}
        </div>
      )}
    </DashShell>
  );
}
export default function Page() { return <Suspense><Admin /></Suspense>; }
