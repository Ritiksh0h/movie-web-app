import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";

const navItems = [
  { name: "Home", href: "/" },
  { name: "TV Shows", href: "/tv-shows" },
  { name: "Movies", href: "/movies" },
  { name: "New & Popular", href: "/new-and-popular" },
  { name: "My List", href: "/my-list" },
];

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/60 to-transparent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link className="text-red-600 font-bold text-2xl mr-10" href="/">
            MOVIEFLIX
          </Link>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                className="text-sm text-white hover:text-gray-300"
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <Search className="h-6 w-6 text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <Bell className="h-6 w-6 text-white" />
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
};
