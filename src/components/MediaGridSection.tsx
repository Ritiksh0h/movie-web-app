// "use client"

// import { Movie, Tv } from "@/services/tmdbApi"
// import MediaCard from "./media-card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
// } from "@/components/ui/carousel"

// interface MediaGridSectionProps {
//   title: string
//   media: (Movie | Tv)[]
//   mediaType: "movie" | "tv"
// }

// export const MediaGridSection: React.FC<MediaGridSectionProps> = ({
//   title,
//   media,
//   mediaType,
// }) => {
//   return (
//     <section className="py-8 container mx-auto px-4">
//       <h2 className="text-2xl font-bold mb-4">{title}</h2>
//       <div className="relative">
//         <Carousel
//           opts={{
//             align: "start",
//             loop: true,
//             slidesToScroll: 1,
//           }}
//         >
//           <CarouselContent>
//             {media && media.length > 0 ? (
//               media.map((item) => (
//                 <CarouselItem
//                   key={item.id}
//                   className="pl-2 md:basis-1/3 lg:basis-1/5"
//                 >
//                   <MediaCard item={item} type={mediaType} />
//                 </CarouselItem>
//               ))
//             ) : (
//               <p className="col-span-full text-center text-muted-foreground">
//                 No {mediaType === "movie" ? "movies" : "TV shows"} available.
//               </p>
//             )}
//           </CarouselContent>
//           <CarouselPrevious className="hidden md:flex" />
//           <CarouselNext className="hidden md:flex" />
//         </Carousel>
//       </div>
//     </section>
//   )
// }
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Movie, Tv } from "@/services/tmdbApi";
import MediaCard from "./media-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaGridSectionProps {
  title: string;
  media: (Movie | Tv)[];
  mediaType: "movie" | "tv";
}

export const MediaGridSection: React.FC<MediaGridSectionProps> = ({
  title,
  media,
  mediaType,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerGroup = 5;

  useEffect(() => {
    if (containerRef.current) {
      const itemWidth = containerRef.current.offsetWidth / itemsPerGroup;
      setTranslateX(-currentIndex * itemWidth);
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerGroup, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + itemsPerGroup,
        Math.max(media.length - itemsPerGroup, 0)
      )
    );
  };

  return (
    <section className="py-4 container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold ">{title}</h2>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handleNext}
            disabled={currentIndex + itemsPerGroup >= media.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden" ref={containerRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out gap-2"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {media && media.length > 0 ? (
            media.map((item) => (
              <div key={item.id} className="w-1/5 flex-shrink-0 px-2">
                <MediaCard item={item} type={mediaType} />
              </div>
            ))
          ) : (
            <p className="w-full text-center text-muted-foreground">
              No {mediaType === "movie" ? "movies" : "TV shows"} available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
