import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Tv, Film } from 'lucide-react'

interface MediaNotFoundProps {
  isMovie: boolean
}

export default function MediaNotFound({ isMovie }: MediaNotFoundProps) {
  const mediaType = isMovie ? 'Movie' : 'TV Show'
  const Icon = isMovie ? Film : Tv
  const browseLink = isMovie ? '/movies' : '/tv-shows'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Icon className="h-24 w-24 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{mediaType} Not Found</h1>
          <p className="text-xl text-gray-600">
            Oops! We couldn&apos;t find the {mediaType.toLowerCase()} you&apos;re looking for.
          </p>
          <p className="text-gray-500">
            The {mediaType.toLowerCase()} might have been removed or doesn&apos;t exist in our database.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={browseLink} className="flex items-center justify-center">
              <Icon className="mr-2 h-4 w-4" />
              Browse {isMovie ? 'Movies' : 'TV Shows'}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="javascript:history.back()" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}