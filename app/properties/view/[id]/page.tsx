"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CategoryService } from "@/services/category-service"
import { SavedScheduleService } from "@/services/saved-schedule-service"
import { ScheduleService } from "@/services/schedule-service"
import { ArrowLeft, Bookmark, Edit, Trash } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ViewPropertyPage() {
  const router = useRouter()
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [category, setCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch property data
        const propertyData = await ScheduleService.getScheduleById(id)
        setProperty(propertyData)

        // Fetch category data if available
        if (propertyData.category) {
          try {
            const categoryData = await CategoryService.getCategoryById(propertyData.category)
            setCategory(categoryData)
          } catch (error) {
            console.error("Error fetching category:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching property data:", error)
        toast({
          title: "Error",
          description: "Failed to load property data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await ScheduleService.deleteSchedule(id)

        toast({
          title: "Success",
          description: "Property deleted successfully.",
        })

        // Redirect to properties list
        router.push("/properties")
      } catch (error) {
        console.error("Error deleting property:", error)
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await SavedScheduleService.createSavedSchedule(id)

      toast({
        title: "Success",
        description: "Property saved successfully.",
      })
    } catch (error) {
      console.error("Error saving property:", error)
      toast({
        title: "Error",
        description: "Failed to save property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  if (!property) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
          <p className="mt-2 text-gray-500">The property you're looking for doesn't exist or has been removed.</p>
          <Link href="/properties" className="mt-6 inline-block">
            <Button>Back to Properties</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/properties" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{property.title}</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Bookmark className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Link href={`/properties/edit/${id}`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              {property.image1 && (
                <div className="mb-6 rounded-lg overflow-hidden">
                  <img
                    src={property.image1 || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 mb-6">{property.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1 text-gray-900">{property.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1 text-gray-900">${property.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-gray-900">{category ? category.name : `Category ${property.category}`}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${property.status === "active"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}
                    >
                      {property.status}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Property Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">ID</h3>
                  <p className="mt-1 text-gray-900">{property.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-gray-900">
                    {property.created_at ? new Date(property.created_at).toLocaleString() : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Updated At</h3>
                  <p className="mt-1 text-gray-900">
                    {property.updated_at ? new Date(property.updated_at).toLocaleString() : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

