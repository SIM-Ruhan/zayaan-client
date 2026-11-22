import Link from "next/link";
import { Snowflake, Sun } from "lucide-react";
import Reveal from "./Reveal";

const CATS = [
  { label: "Men", href: "/all-products?category=Men", img: "/banners/men.jpg", pos: "80% 20%" },
  { label: "Women", href: "/all-products?category=Women", img: "/banners/women.jpg", pos: "80% 20%" },
  { label: "Kids", href: "/all-products?category=Kids", img: "/banners/kids.jpg", pos: "80% 30%" },
  { label: "Winter", href: "/all-products?season=Winter", img: "/banners/winter.jpg", pos: "80% 30%" },
  { label: "Summer", href: "/all-products?season=Summer", img: "/banners/summer.jpg", pos: "80% 30%" },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
     <h2 className="mb-6 text-3xl font-bold">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATS.map((c, i) => (
          <div key={c.label} delay={i * 0.06}>
            <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl">
              {c.img ? (
                <img src={c.img} alt="" loading="lazy" style={{ objectPosition: c.pos }} className="size-full object-cover transition duration-500 group-hover:scale-110" />
              ) : (
                <div className={`grid size-full place-items-center bg-gradient-to-br ${c.bg}`}><c.Icon className="size-14 text-white/90 transition group-hover:scale-110" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
              <span className="absolute bottom-4 left-4 font-serif text-xl font-semibold text-white">{c.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
