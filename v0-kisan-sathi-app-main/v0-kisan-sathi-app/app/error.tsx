'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Always log errors in development
    console.error('Application error:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
  }, [error])

  // Silently ignore Chrome extension errors
  if (error.message.includes('chrome-extension://') || 
      error.stack?.includes('chrome-extension://') ||
      error.message.includes('Minified React error #299')) {
    return null
  }

  // Show error UI only for actual application errors
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-900">
          Something went wrong!
        </h2>
        
        <p className="mb-6 text-center text-sm text-gray-600">
          We encountered an unexpected error. Please try again.
        </p>
        
        <button
          onClick={reset}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Try again
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}
