"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CategoryService } from "@/services/category-service"
import { ScheduleService } from "@/services/schedule-service"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditPropertyPage() {
  const router = useRouter()
  const { id } = useParams()
  console.log(id);

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any>([])
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    status: "active",
    image1: null,
  })
  const [imagePreview, setImagePreview] = useState<any>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyData = await ScheduleService.getScheduleById(id)

        const categoriesData = await CategoryService.getAllCategories()

        setCategories(categoriesData)

        setFormData({
          title: propertyData.title || "",
          description: propertyData.description || "",
          price: propertyData.price?.toString() || "",
          location: propertyData.location || "",
          category: propertyData.category?.toString() || "",
          status: propertyData.status || "active",
          image1: null,
        })

        if (propertyData.image1) {
          setOriginalImageUrl(propertyData.image1)
          setImagePreview(propertyData.image1)
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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === "file") {
      const file = files[0]
      setFormData((prev: any) => ({ ...prev, [name]: file }))

      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(originalImageUrl)
      }
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: any, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if (key === "image1" && formData[key] === null) {
          return
        }

        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key])
        }
      })

      await ScheduleService.updateSchedule(Number(id), formDataToSend)

      toast({
        title: "Success",
        description: "Property updated successfully.",
      })

      router.push("/properties")
    } catch (error) {
      console.error("Error updating property:", error)
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
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

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Link href="/properties" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter property title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter property description"
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image1">Property Image</Label>
              <div className="flex items-center justify-center border-2 border-dashed rounded-md p-4 h-[100px]">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev: any) => ({ ...prev, image1: null }))
                        setImagePreview(null)
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-1 text-sm text-gray-500">
                      <label htmlFor="file-upload" className="cursor-pointer text-primary hover:underline">
                        Upload a file
                      </label>
                      <input
                        id="file-upload"
                        name="image1"
                        type="file"
                        className="sr-only"
                        onChange={handleChange}
                        accept="image/*"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/properties">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

