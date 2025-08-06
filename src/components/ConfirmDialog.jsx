// components/ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, onConfirm, onCancel, title, description }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="bg-neutral-900 text-white border border-neutral-700">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-neutral-400">{description}</div>

        <DialogFooter className="mt-4">
          {/* ❌ Cancel button – closes the dialog */}
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>

          {/* ✅ Confirm button – triggers update */}
          <Button onClick={onConfirm}>Yes, Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
