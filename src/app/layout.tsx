import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";

import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import { Toaster } from "~/components/ui/sonner";
import ContextProvider from "~/context";
import { ChallengesProvider } from "~/context/challenges";
export const metadata = {
  title: "Smart Donna AI",
  description:
    "Automatically record, transcribe, and get actionable insights from your meetings.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersData = headers();
  const cookies = headersData.get("cookie");
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {/* <AppKitProvider> */}
        {/* WagmiProviderComp wraps the entire layout */}
        <TRPCReactProvider>
          <ContextProvider cookies={cookies}>
            <ChallengesProvider>
              <div className="bg-bg min-h-screen w-full">
                <div className="mx-auto w-full max-w-[1440px]">
                  <div className="flex w-full items-center justify-between py-4"></div>

                  {children}
                  <Toaster />
                </div>
              </div>
            </ChallengesProvider>
          </ContextProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
