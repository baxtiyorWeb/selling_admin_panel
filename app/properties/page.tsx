"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { CategoryService } from "@/services/category-service"
import { ScheduleService } from "@/services/schedule-service"
import type { Category, Property } from "@/types"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface CategoryMap {
  [key: number]: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [categories, setCategories] = useState<CategoryMap>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all properties
        const propertiesData = await ScheduleService.getAllSchedules()
        setProperties(propertiesData)

        // Fetch all categories to map category IDs to names
        const categoriesData = await CategoryService.getAllCategories()
        const categoryMap: CategoryMap = {}
        categoriesData.forEach((category: Category) => {
          categoryMap[category.id] = category.name || `Category ${category.id}`
        })
        setCategories(categoryMap)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await ScheduleService.deleteSchedule(id)

        // Remove the deleted property from state
        setProperties(properties.filter((property) => property.id !== id))

        toast({
          title: "Success",
          description: "Property deleted successfully.",
        })
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

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/properties/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No properties found. Click "Add Property" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.id}</TableCell>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>${property.price}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{categories[property.category] || `Category ${property.category}`}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${property.status === "active"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                          }`}
                      >
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
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
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(property.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Layout>
  )
}

