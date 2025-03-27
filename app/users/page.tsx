import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  // Sample data
  const users = [
    {
      id: 1,
      username: "user123",
      email: "user123@example.com",
      registeredDate: "2023-10-15",
      status: "active",
    },
    {
      id: 2,
      username: "user456",
      email: "user456@example.com",
      registeredDate: "2023-10-20",
      status: "active",
    },
    {
      id: 3,
      username: "user789",
      email: "user789@example.com",
      registeredDate: "2023-11-05",
      status: "inactive",
    },
    {
      id: 4,
      username: "user101",
      email: "user101@example.com",
      registeredDate: "2023-11-15",
      status: "active",
    },
    {
      id: 5,
      username: "user202",
      email: "user202@example.com",
      registeredDate: "2023-12-01",
      status: "active",
    },
  ]

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/users/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.registeredDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      user.status === "active"
                        ? "bg-green-50 text-green-700 ring-green-600/20"
                        : "bg-red-50 text-red-700 ring-red-600/20"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/users/edit/${user.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

