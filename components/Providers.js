"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export default function Providers({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [cartCount, setCartCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const me = await api("/me");
      setUser(me);
      if (me) {
        const cart = await api("/cart");
        setCartCount(cart.reduce((s, i) => s + i.qty, 0));
      } else setCartCount(0);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Smooth scrolling
  useEffect(() => {
    let lenis;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    import("lenis").then(({ default: Lenis }) => { lenis = new Lenis({ autoRaf: true, duration: 1.1 }); });
    return () => lenis?.destroy();
  }, []);

  return <Ctx.Provider value={{ user, cartCount, setCartCount, refresh }}>{children}</Ctx.Provider>;
}
