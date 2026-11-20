"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { api, money } from "@/lib/api";
import { useApp } from "@/components/Providers";

function Inner() {
  const sp = useSearchParams();
  const id = sp.get("orderId");
  const { refresh } = useApp();
  const [o, setO] = useState(null);
  useEffect(() => { refresh(); api(`/orders/${id}`).then(setO).catch(() => {}); }, [id]); // eslint-disable-line

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <CheckCircle2 className="mx-auto size-20 text-emerald-600" />
      </motion.div>
      <h1 className="mt-6 text-3xl font-bold">Order placed!</h1>
      <p className="mt-2 text-ink/70">Thank you for shopping with us. We'll confirm your order shortly.</p>
      <div className="card mt-8 p-6 text-left text-sm">
        <p className="flex justify-between"><span className="text-ink/60">Order ID</span><b className="font-mono">{id}</b></p>
        {o && <>
          <p className="mt-2 flex justify-between"><span className="text-ink/60">Total</span><b>{money(o.total)}</b></p>
          <p className="mt-2 flex justify-between"><span className="text-ink/60">Payment</span><b>{o.paymentMethod === "cod" ? "Cash on delivery" : `Online (${o.paymentStatus})`}</b></p>
        </>}
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard?tab=orders" className="btn btn-dark">View my orders</Link>
        <Link href="/all-products" className="btn btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}
export default function Success() { return <Suspense><Inner /></Suspense>; }
