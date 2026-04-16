"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/productos");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-cyan-400" />
    </div>
  );
}
