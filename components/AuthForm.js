"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useApp } from "@/components/Providers";
import { FcGoogle } from "react-icons/fc";

export default function AuthForm({ mode }) {
  const sp = useSearchParams();
  const router = useRouter();
  const { refresh } = useApp();
  const next = sp.get("next") || "/";
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const reg = mode === "register";
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    const { error } = reg
      ? await authClient.signUp.email({ name: f.name, email: f.email, password: f.password })
      : await authClient.signIn.email({ email: f.email, password: f.password });
    if (error) { setErr(error.message || "Something went wrong"); setBusy(false); return; }
    await refresh();
    router.push(next);
  };
  const google = () => authClient.signIn.social({ provider: "google", callbackURL: next });

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <form onSubmit={submit} className="card space-y-4 p-7">
        <h1 className="text-2xl font-bold">{reg ? "Create your account" : "Welcome back"}</h1>
        <button type="button" onClick={google} className="btn btn-outline w-full"><div className="flex gap-1 items-center justify-center"><FcGoogle className="h-5 w-5"/> Continue with Google</div> </button>
        <p className="text-center text-xs text-ink/50">or use email</p>
        {reg && <div><label className="label" htmlFor="nm">Name</label><input id="nm" required className="input" value={f.name} onChange={set("name")} /></div>}
        <div><label className="label" htmlFor="em">Email</label><input id="em" type="email" required className="input" value={f.email} onChange={set("email")} /></div>
        <div><label className="label" htmlFor="pw">Password</label><input id="pw" type="password" required minLength={8} className="input" value={f.password} onChange={set("password")} /></div>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait…" : reg ? "Sign up" : "Sign in"}</button>
        <p className="text-center text-sm text-ink/60">
          {reg ? "Already have an account? " : "New here? "}
          <Link href={`${reg ? "/login" : "/register"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-maroon">{reg ? "Sign in" : "Sign up"}</Link>
        </p>
      </form>
    </div>
  );
}
