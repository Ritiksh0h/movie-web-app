import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserNav() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-white/20 text-white hover:bg-white/10 hover:text-white text-xs px-4"
      asChild
    >
      <Link href="#">Sign in</Link>
    </Button>
  );
}
