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

export function JoinTenantDialog({ open, onOpenChange }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Placeholder for join tenant logic
    console.log("Join tenant placeholder")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Tenant</DialogTitle>
          <DialogDescription>
            Enter the invite code provided by your admin to join an existing tenant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite-code" className="text-right">
                Invite Code
              </Label>
              <Input id="invite-code" className="col-span-3" placeholder="Enter invite code" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Join Tenant</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

