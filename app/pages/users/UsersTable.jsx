"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical } from "lucide-react"
import toast from "react-hot-toast"

export default function UsersTable({ userRole }) {
  const [users, setUsers] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [showDemoteModal, setShowDemoteModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [selectedTenant, setSelectedTenant] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  const router = useRouter()

  useEffect(() => {
    fetchUsers()
    fetchTenants()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenants")
      if (!response.ok) throw new Error("Failed to fetch tenants")
      const data = await response.json()
      setTenants(data)
    } catch (error) {
      console.error("Error fetching tenants:", error)
      toast.error("Failed to load tenants")
    }
  }

  const handlePromote = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUser.userId}/promote`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to promote user")

      toast.success(`${selectedUser.name} promoted to Manager`)
      setShowPromoteModal(false)
      setConfirmationText("")
      await fetchUsers()
    } catch (error) {
      toast.error("Failed to promote user")
      console.error("Error promoting user:", error)
    }
  }

  const handleDemote = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUser.userId}/demote`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to demote user")

      toast.success(`${selectedUser.name} demoted to User`)
      setShowDemoteModal(false)
      setConfirmationText("")
      await fetchUsers()
    } catch (error) {
      toast.error("Failed to demote user")
      console.error("Error demoting user:", error)
    }
  }

  const handleRemove = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUser.userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove user")

      toast.success(`${selectedUser.name} removed`)
      setShowRemoveModal(false)
      setConfirmationText("")
      await fetchUsers()
    } catch (error) {
      toast.error("Failed to remove user")
      console.error("Error removing user:", error)
    }
  }

  const handleInvite = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUser.userId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenantId: selectedTenant,
          role: selectedRole,
        }),
      })

      if (!response.ok) throw new Error("Failed to invite user")

      toast.success(`Invitation sent to ${selectedUser.name}`)
      setShowInviteModal(false)
      setSelectedTenant("")
      setSelectedRole("")
      await fetchUsers()
    } catch (error) {
      toast.error("Failed to send invitation")
      console.error("Error inviting user:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Users</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.userId}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.tenant || "None"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="xl" variant="secondary" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => {
                        setSelectedUser(user)
                        setShowInviteModal(true)
                      }}
                    >
                      Invite to Tenant
                    </DropdownMenuItem>
                    {userRole === "Admin" && (
                      <>
                        {user.role === "User" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(user)
                              setShowPromoteModal(true)
                            }}
                          >
                            Promote to Manager
                          </DropdownMenuItem>
                        )}
                        {user.role === "Manager" && (
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedUser(user)
                              setShowDemoteModal(true)
                            }}
                          >
                            Demote to User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => {
                            setSelectedUser(user)
                            setShowRemoveModal(true)
                          }}
                        >
                          Remove User
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Promote Modal */}
      <Dialog open={showPromoteModal} onOpenChange={setShowPromoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote User to Manager</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            This action will promote {selectedUser?.name} to Manager role. This gives them additional permissions.
          </p>
          <p className="mb-2">Type the user's full name to confirm:</p>
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type user name here"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePromote}
              disabled={confirmationText !== selectedUser?.name}
              className={confirmationText === selectedUser?.name ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Promote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Demote Modal */}
      <Dialog open={showDemoteModal} onOpenChange={setShowDemoteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Demote Manager to User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            This action will demote {selectedUser?.name} to User role. They will lose their Manager permissions.
          </p>
          <p className="mb-2">Type the user's full name to confirm:</p>
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type user name here"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDemote}
              disabled={confirmationText !== selectedUser?.name}
              className={confirmationText === selectedUser?.name ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Demote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Modal */}
      <Dialog open={showRemoveModal} onOpenChange={setShowRemoveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            This action will permanently remove {selectedUser?.name} from the system. This cannot be undone.
          </p>
          <p className="mb-2">Type the user's full name to confirm:</p>
          <Input
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type user name here"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRemove}
              disabled={confirmationText !== selectedUser?.name}
              className={confirmationText === selectedUser?.name ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User to Tenant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label>Select Tenant</label>
              <Select onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant._id} value={tenant._id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label>Assign Role</label>
              <Select onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!selectedTenant || !selectedRole}>
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

