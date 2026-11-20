"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Chrome({ children }) {
  const path = usePathname();
  const bare = ["/admin", "/dashboard", "/lp"].some((p) => path.startsWith(p));
  return (
    <>
      {!bare && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!bare && <Footer />}
    </>
  );
}
