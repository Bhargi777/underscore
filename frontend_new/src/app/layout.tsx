import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Added Outfit for a more modern tech look
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Research OS",
  description: "AI-Powered Research Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <div className="min-h-screen bg-background text-foreground flex relative overflow-hidden">
          <Sidebar />
          <main className="flex-1 relative z-10 ml-28 mr-4 my-4 rounded-3xl glass-panel overflow-hidden flex flex-col">
            {/* Main content container with glass panel look */}
            <div className="flex-1 overflow-auto p-6 scroll-smooth">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>

          {/* Background Ambient Orbs/Glows */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </body>
    </html>
  );
}
