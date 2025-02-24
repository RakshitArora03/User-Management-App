import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CreateTenantDialog({ open, onOpenChange }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for tenant creation logic
    console.log("Create tenant placeholder")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Add a new tenant to your organization. This will create a new workspace for users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenant-name" className="text-right">
                Name
              </Label>
              <Input id="tenant-name" className="col-span-3" placeholder="Enter tenant name" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Tenant</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

