export async function api(path, opts = {}) {
  const { body, ...rest } = opts;
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    ...rest,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

export const money = (n) => "৳" + Number(n || 0).toLocaleString("en-US");
export const price = (p) => (p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price);
export const discountPct = (p) => (p.discountPrice && p.discountPrice < p.price ? Math.round((1 - p.discountPrice / p.price) * 100) : 0);
