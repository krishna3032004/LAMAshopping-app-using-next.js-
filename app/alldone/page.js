import React from 'react'
import Link from 'next/link'

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-green-500">🎉 All Done!</h1>
      <p className="mt-4 px-2 text-center text-lg text-gray-700">
        Thank you for completing the process. We appreciate your time and effort!
      </p>
      <div className="mt-6 space-x-4">
        <Link href="/">
          <button className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600">
            Go to Home
          </button>
        </Link>
        
      </div>
    </div>
  )
}

export default Page
