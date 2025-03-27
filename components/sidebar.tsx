import { BookmarkCheck, Calendar, FolderPlus, Home, Settings, Tag, Users } from "lucide-react"
import Link from "next/link"
import type { FC } from "react"

export const Sidebar: FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r z-10">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
          <h1 className="text-xl font-bold">Uy Admin</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 bg-gray-100 group"
          >
            <Home className="mr-3 h-5 w-5 text-gray-500" />
            Dashboard
          </Link>

          <div className="pt-4">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</p>
          </div>

          <Link
            href="/properties"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <Calendar className="mr-3 h-5 w-5 text-gray-500" />
            Properties
          </Link>

          <Link
            href="/properties/create"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <FolderPlus className="mr-3 h-5 w-5 text-gray-500" />
            Add Property
          </Link>

          <Link
            href="/saved-properties"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <BookmarkCheck className="mr-3 h-5 w-5 text-gray-500" />
            Saved Properties
          </Link>

          <div className="pt-4">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
          </div>

          <Link
            href="/categories"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <Tag className="mr-3 h-5 w-5 text-gray-500" />
            Categories
          </Link>

          <Link
            href="/categories/create"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <FolderPlus className="mr-3 h-5 w-5 text-gray-500" />
            Add Category
          </Link>

          <div className="pt-4">
            <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</p>
          </div>

          <Link
            href="/users"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <Users className="mr-3 h-5 w-5 text-gray-500" />
            Users
          </Link>

          <Link
            href="/settings"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
          >
            <Settings className="mr-3 h-5 w-5 text-gray-500" />
            Settings
          </Link>
        </nav>
      </div>
    </div>
  )
}

