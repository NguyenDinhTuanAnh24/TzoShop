"use client";

import { SessionProvider } from "next-auth/react";
import { SkeletonTheme } from "react-loading-skeleton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SkeletonTheme 
        baseColor="#eef2f1" 
        highlightColor="#f8faf9" 
        borderRadius="1rem"
        duration={1.4}
      >
        {children}
      </SkeletonTheme>
    </SessionProvider>
  );
}
