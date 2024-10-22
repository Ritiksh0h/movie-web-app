"use client";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import SearchPopup from "./search";
import { siteConfig } from "@/config/siteConfig";

const navItems = [
  { name: "Home", href: "/" },
  { name: "TV Shows", href: "/tv" },
  { name: "Movies", href: "/movie" },
  { name: "New & Popular", href: "/new-and-popular" },
  { name: "My List", href: "/my-list" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link className="text-red-600 font-bold text-2xl mr-10" href="/">
            {siteConfig.name}
          </Link>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                className={cn(
                  "transition-colors text-sm text-white hover:text-gray-300",
                  pathname === item.href ? "text-white" : "text-white/70"
                )}
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <SearchPopup />
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <Bell className="h-6 w-6 text-white" />
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
};
