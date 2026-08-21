"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("pudym_admin_auth_token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
}