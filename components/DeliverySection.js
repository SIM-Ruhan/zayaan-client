import { Truck, LifeBuoy, RefreshCw, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  [Truck, "Free Shipping", ["Buy BDT 3000+ & get free", "delivery"]],
  [LifeBuoy, "Support", ["WhatsApp: +880 1732287393", "Call: +880 1732287393"]],
  [RefreshCw, "7 Days Exchange", ["Exchange within 7 days", "with similar type of products"]],
  [ShieldCheck, "100% Payment Secure", ["Cash on delivery and", "secured online payment"]],
];

export default function DeliverySection() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="mb-10 flex items-center justify-center gap-5">
          <span className="h-px w-12 bg-ink sm:w-24" />
          <h2 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">Delivery &amp; Exchange</h2>
          <span className="h-px w-12 bg-ink sm:w-24" />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([Icon, title, lines], i) => (
            <Reveal key={title} delay={i * 0.08} className="flex gap-4">
              <Icon className="size-9 shrink-0 stroke-[1.2] text-ink/40" />
              <div className="text-sm uppercase">
                <h3 className="font-sans font-semibold tracking-wide">{title}</h3>
                {lines.map((l) => <p key={l} className="mt-1.5 leading-relaxed">{l}</p>)}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
