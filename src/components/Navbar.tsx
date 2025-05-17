import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { FilePenLine, Home, BarChart2, User, MoreVertical } from "lucide-react";

export function Navbar() {
  return (
    <div className="bg-white border-b backdrop-blur-sm bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FilePenLine className="h-5 w-5 text-blue-500" />
          </div>
          <Link href="/" className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Daily Updates
          </Link>
        </div>
        <nav className="ml-auto flex gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="/statistics"
            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </Link>
          <Link
            href="/profile"
            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </Link>
        </nav>
        <button className="ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 