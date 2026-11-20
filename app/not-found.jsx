"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center overflow-hidden px-4 py-20 text-center">
      {/* Big faded 404 behind the text */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute select-none font-serif text-[12rem] font-bold leading-none text-maroon/[0.07] sm:text-[18rem]"
      >
        404
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="relative"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-maroon">404</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">A little off the path.</h1>
        <p className="mt-4 text-ink/65">We couldn’t find that page. It may have moved, or the link may be wrong.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/all-products" className="btn btn-primary">
            <ShoppingBag className="size-4" /> Explore the collection
          </Link>
          <Link href="/" className="btn btn-outline">
            <Home className="size-4" /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}