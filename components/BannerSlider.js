"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/banners/men.jpg", href: "/all-products?category=Men", alt: "Festive collection for men" },
  { src: "/banners/women.jpg", href: "/all-products?category=Women", alt: "Free shipping across Bangladesh" },
  { src: "/banners/kids.jpg", href: "/all-products?category=Kids", alt: "Joyful celebration for kids" },
];

const SIDE = [
  { src: "banners/winter.jpg", href: "/all-products?season=Winter", alt: "Winter collection" },
  { src: "banners/summer.jpg", href: "/all-products?season=Summer", alt: "Summer collection" },
];

export default function BannerSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (d) => setI((n) => (n + d + SLIDES.length) % SLIDES.length);
  const s = SLIDES[i];

  return (
    <section className="mx-auto grid max-w-[98%] gap-2 pt-5 lg:grid-cols-3">
      {/* Main slider */}
      <div
        className="relative aspect-video overflow-hidden rounded-3xl bg-ink lg:col-span-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={s.src}
            src={s.src}
            alt={s.alt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 size-full object-cover"
          />
        </AnimatePresence>

        <Link
          href={s.href}
       className="btn-grad text-xs sm:text-[18px]  absolute bottom-[12%] left-[6%] shadow-lg px-4 py-2 rounded-full sm:px-7 sm:py-3"
        >
          Explore
        </Link>

        <button onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white hover:text-black">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-white hover:bg-white hover:text-black">
          <ChevronRight className="size-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Go to slide ${n + 1}`}
              className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Two side banners */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
        {SIDE.map((b) => (
          <Link
            key={b.src}
            href={b.href}
            className="group relative block aspect-video overflow-hidden rounded-3xl bg-ink lg:aspect-auto"
          >
            <img
              src={b.src}
              alt={b.alt}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}