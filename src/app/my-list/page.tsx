"use client";
import { useWatchlist } from "@/hooks/use-watchlist";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/services/tmdbApi";
import { X } from "lucide-react";

export default function MyListPage() {
  const { list, remove } = useWatchlist();

  return (
    <main className="min-h-screen pt-24 px-6 md:px-12">
      <h1 className="text-3xl font-bold text-white mb-8">My List</h1>

      {list.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-white/50 text-lg mb-4">Your list is empty.</p>
          <Link href="/" className="text-white underline underline-offset-4">
            Browse content
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {list.map((item) => (
            <div key={item.id} className="relative group">
              <Link href={`/${item.type}/${item.id}`}>
                <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-[#141414]">
                  <Image
                    src={getImageUrl(item.poster_path)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                  />
                </div>
                <p className="text-xs text-white/70 mt-1 truncate">{item.title}</p>
              </Link>
              <button
                onClick={() => remove(item.id)}
                className="absolute top-2 right-2 h-6 w-6 rounded-full
                  bg-black/60 text-white flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                aria-label="Remove from list"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
