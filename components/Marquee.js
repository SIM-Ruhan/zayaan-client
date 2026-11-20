export default function Marquee() {
  const item = "Upto FLAT 50% off on selected products";
  const row = Array.from({ length: 8 });
  return (
    <div className="mt-6 overflow-hidden bg-maroon py-2.5 text-white" aria-label={item}>
      <div className="marquee-track flex w-max gap-12 whitespace-nowrap text-sm font-semibold uppercase tracking-widest">
        {[...row, ...row].map((_, i) => <span key={i} aria-hidden={i > 0}>✦ {item}</span>)}
      </div>
    </div>
  );
}
