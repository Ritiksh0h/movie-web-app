"use client";
import { genres } from "@/app/types";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function GenreFilter({ mediaType }: { mediaType: "movie" | "tv" }) {
  const router      = useRouter();
  const params      = useSearchParams();
  const activeGenre = params.get("genre");

  const select = (id: string | null) => {
    router.push(id ? `/${mediaType}?genre=${id}` : `/${mediaType}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto px-6 md:px-12 pb-2 scrollbar-hide">
      <button
        onClick={() => select(null)}
        className={cn(
          "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
          !activeGenre
            ? "bg-white text-black"
            : "bg-white/10 text-white hover:bg-white/20"
        )}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          onClick={() => select(String(g.id))}
          className={cn(
            "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            activeGenre === String(g.id)
              ? "bg-white text-black"
              : "bg-white/10 text-white hover:bg-white/20"
          )}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
