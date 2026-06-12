"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SearchPopup from "./search";
import { siteConfig } from "@/config/siteConfig";

const navItems = [
  { name: "Home",          href: "/" },
  { name: "TV Shows",      href: "/tv" },
  { name: "Movies",        href: "/movie" },
  { name: "New & Popular", href: "/new-and-popular" },
  { name: "My List",       href: "/my-list" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0d0d0d]/95 backdrop-blur-sm"
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-[#e50914] font-black text-2xl tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-[13px] transition-colors hover:text-white",
                  pathname === item.href
                    ? "text-white font-medium"
                    : "text-white/70"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchPopup />
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-transparent"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white text-xs px-4"
          >
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
};
