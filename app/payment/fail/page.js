import Link from "next/link";
import { XCircle } from "lucide-react";

export default function Fail() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <XCircle className="mx-auto size-20 text-red-600" />
      <h1 className="mt-6 text-3xl font-bold">Payment not completed</h1>
      <p className="mt-2 text-ink/70">Your payment was cancelled or failed. No money was taken. You can try again.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard?tab=cart" className="btn btn-dark">Back to cart</Link>
        <Link href="/all-products" className="btn btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}
