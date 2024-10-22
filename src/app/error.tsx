'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-100 to-orange-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <Alert variant="destructive">
          <AlertTitle className="text-2xl font-bold">Oops! Something went wrong</AlertTitle>
          <AlertDescription className="mt-2 text-sm">
            We apologize for the inconvenience. An unexpected error has occurred.
          </AlertDescription>
        </Alert>
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Error details: {error.message || "Unknown error"}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}