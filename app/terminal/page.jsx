"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TerminalRedirect() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const tab          = searchParams.get("tab");

  useEffect(() => {
    router.replace(tab ? `/dashboard?tab=${tab}` : "/dashboard");
  }, [router, tab]);

  return null;
}

export default function TerminalPage() {
  return (
    <Suspense>
      <TerminalRedirect />
    </Suspense>
  );
}
