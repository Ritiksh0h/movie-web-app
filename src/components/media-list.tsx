"use client"

import React, { useCallback, useMemo } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import MediaCard from "./media-card"
import { Movie, Tv } from "@/services/tmdbApi"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaListProps {
  media?: (Movie | Tv)[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  mediaType: "movie" | "tv"
  isLoading?: boolean
  error?: string
}

const MediaList: React.FC<MediaListProps> = React.memo(
  ({ media, totalPages, currentPage, onPageChange, mediaType, isLoading, error }) => {
    const handlePageChange = useCallback(
      (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          onPageChange(pageNumber)
        }
      },
      [onPageChange, totalPages]
    )

    const paginationItems = useMemo(() => {
      const items = []
      const maxVisiblePages = 5
      const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2)

      let startPage = Math.max(1, currentPage - halfMaxVisiblePages)
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      if (startPage > 1) {
        items.push(
          <PaginationItem key="first">
            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
          </PaginationItem>
        )
        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis-start">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis-end">
              <PaginationEllipsis />
            </PaginationItem>
          )
        }
        items.push(
          <PaginationItem key="last">
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }

      return items
    }, [currentPage, totalPages, handlePageChange])

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-[375px] w-[250px]" />
          ))}
        </div>
      )
    }

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>
    }

    if (!media || media.length === 0) {
      return <div className="text-center py-8">No media found.</div>
    }

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {media.map((item) => (
            <MediaCard key={item.id} item={item} type={mediaType} />
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {paginationItems}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    )
  }
)

MediaList.displayName = "MediaList"

export default MediaList