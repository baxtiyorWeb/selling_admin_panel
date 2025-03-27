"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CategoryService } from "@/services/category-service"
import { SavedScheduleService } from "@/services/saved-schedule-service"
import { ScheduleService } from "@/services/schedule-service"
import type { Category, Property, SavedProperty } from "@/types"
import { BookmarkCheck, Building, Tag, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardStats {
  properties: number
  savedProperties: number
  categories: number
  activeProperties: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    properties: 0,
    savedProperties: 0,
    categories: 0,
    activeProperties: 0,
  })
  const [recentProperties, setRecentProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize with empty arrays
        let properties: Property[] = []
        let savedProperties: SavedProperty[] = []
        let categories: Category[] = []

        // Fetch data with individual try/catch blocks
        try {
          const propertiesResponse = await ScheduleService.getAllSchedules()
          properties = Array.isArray(propertiesResponse) ? propertiesResponse : []
        } catch (err) {
          console.error("Error fetching properties:", err)
        }

        try {
          const savedPropertiesResponse = await SavedScheduleService.getSavedSchedules()
          savedProperties = Array.isArray(savedPropertiesResponse) ? savedPropertiesResponse : []
        } catch (err) {
          console.error("Error fetching saved properties:", err)
        }

        try {
          const categoriesResponse = await CategoryService.getAllCategories()
          categories = Array.isArray(categoriesResponse) ? categoriesResponse : []
        } catch (err) {
          console.error("Error fetching categories:", err)
        }

        // Calculate stats with null checks
        const activeProperties =
          properties.filter((p) => p && typeof p === "object" && p.status === "active").length || 0

        setStats({
          properties: properties.length,
          savedProperties: savedProperties.length,
          categories: categories.length,
          activeProperties,
        })

        // Get recent properties (last 5)
        setRecentProperties(properties.slice(0, 5))
        setError(null)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to load dashboard data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        })

        // Set default values in case of error
        setStats({
          properties: 0,
          savedProperties: 0,
          categories: 0,
          activeProperties: 0,
        })
        setRecentProperties([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties}</div>
            <p className="text-xs text-muted-foreground">{stats.activeProperties} active properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
            <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedProperties}</div>
            <p className="text-xs text-muted-foreground">Total saved properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">Available property categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.properties > 0 ? `${Math.round((stats.activeProperties / stats.properties) * 100)}%` : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Properties with active status</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Properties</h2>
          <Link href="/properties">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-medium">
              <div>Title</div>
              <div>Price</div>
              <div>Location</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
          </div>
          <div className="divide-y">
            {recentProperties.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No properties found. Add some properties to see them here.
              </div>
            ) : (
              recentProperties.map((property, index) => (
                <div key={property?.id || `property-${index}`} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="font-medium">{property?.title || "Untitled"}</div>
                    <div>${property?.price || "0"}</div>
                    <div>{property?.location || "Unknown location"}</div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${property?.status === "active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                          }`}
                      >
                        {property?.status || "unknown"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {property?.id && (
                        <>
                          <Link href={`/properties/view/${property.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link href={`/properties/edit/${property.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

