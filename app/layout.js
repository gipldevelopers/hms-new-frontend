import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata = {
  title: "GVoice HMS",
  description: "GVoice Hospital Management System - Portal",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { GlobalLoader, RootContent } from "@/components/GlobalLoader";
import { Suspense } from "react";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false} 
          enableColorScheme={false}
          disableTransitionOnChange
        >
          <RootContent>
             <Suspense fallback={<GlobalLoader />}>
                {children}
             </Suspense>
          </RootContent>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
