"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { SavedScheduleService } from "@/services/saved-schedule-service"
import type { SavedProperty } from "@/types"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const data = await SavedScheduleService.getSavedSchedules()
        setSavedProperties(data)
      } catch (error) {
        console.error("Error fetching saved properties:", error)
        toast({
          title: "Error",
          description: "Failed to load saved properties. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedProperties()
  }, [])

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this saved property?")) {
      try {
        await SavedScheduleService.deleteSavedSchedule(id)

        // Remove the deleted saved property from state
        setSavedProperties(savedProperties.filter((property) => property.id !== id))

        toast({
          title: "Success",
          description: "Saved property removed successfully.",
        })
      } catch (error) {
        console.error("Error removing saved property:", error)
        toast({
          title: "Error",
          description: "Failed to remove saved property. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Properties</h1>
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
                <TableHead>Property ID</TableHead>
                <TableHead>Property Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Saved Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No saved properties found.
                  </TableCell>
                </TableRow>
              ) : (
                savedProperties.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.schedule?.id || "N/A"}</TableCell>
                    <TableCell className="font-medium">{item.schedule?.title || "Unknown Property"}</TableCell>
                    <TableCell>{item.schedule?.location || "Unknown Location"}</TableCell>
                    <TableCell>{item.saved_at ? new Date(item.saved_at).toLocaleDateString() : "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {item.schedule?.id && (
                          <Link href={`/properties/view/${item.schedule.id}`}>
                            <Button variant="outline" size="sm">
                              View Property
                            </Button>
                          </Link>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                          Remove
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

