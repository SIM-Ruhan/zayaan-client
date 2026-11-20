import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Logo } from "./Navbar";

export default function Footer() {
  const social = [Facebook, Twitter, Instagram, Youtube];
  return (
    <footer className="bg-navy text-white/90">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed text-white/60">Festive, daily and seasonal wear for the whole family. Quality fabrics, honest prices, delivered across Bangladesh.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {[["Home", "/"], ["All Products", "/all-products"], ["Login", "/login"], ["Register Now", "/register"]].map(([l, h]) => (
              <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-3"><Mail className="size-4 text-emerald-400" /> support@poshak.com</li>
            <li className="flex items-center gap-3"><Phone className="size-4 text-emerald-400" /> +880 1732287393</li>
            <li className="flex items-center gap-3"><MapPin className="size-4 text-emerald-400" /> Dhaka, Bangladesh</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="mt-4 flex gap-3">
            {social.map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid size-11 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"><Icon className="size-4" /></a>
            ))}
          </div>
          <p className="mt-4 text-sm text-white/50">Join our community for festive offers!</p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-6 text-sm text-white/50">
        <p>© {new Date().getFullYear()} Poshak. All rights reserved.</p>
        <div className="flex gap-5"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
      </div>
    </footer>
  );
}
