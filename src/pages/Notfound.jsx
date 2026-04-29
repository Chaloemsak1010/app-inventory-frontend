import { Link } from "react-router-dom";
import { FrownIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* Sad Face Icon */}
        <div className="mb-8">
          <FrownIcon className="w-24 h-24 text-gray-400 mx-auto stroke-1" />
        </div>

        {/* 404 Error Code */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-lg font-medium text-gray-600 mb-3">
          Page not found
        </h2>
        
        <p className="text-gray-500 text-sm mb-8">
          The page you are looking for doesn't exist or an other error occurred. Go back, or head over to webbly.com to choose a new direction.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            ← Back to Home
          </Link>
         
        </div>
      </div>
    </div>
  );
}
