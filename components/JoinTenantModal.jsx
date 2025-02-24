"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export function JoinTenantModal({ isOpen, onClose, onJoin }) {
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    setIsJoining(true);
    try {
      await onJoin(inviteCode);
      toast.success("Successfully joined the tenant");
      onClose();
    } catch (error) {
      toast.error("Failed to join tenant. Please check your invite code and try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <Label htmlFor="inviteCode" className="text-right">
                Invite Code
              </Label>
              <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isJoining}>
              {isJoining ? "Joining..." : "Join Tenant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}