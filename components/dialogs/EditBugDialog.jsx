"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useBugTracker } from "@/context/BugTrackerContext"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const bugSchema = z.object({
  title: z.string().min(1, "Bug title is required").min(5, "Title must be at least 5 characters"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  assignee: z.string().min(1, "Assignee is required"),
})

export default function EditBugDialog({ open, onOpenChange, bug }) {
  const { updateBug } = useBugTracker()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: bug?.title || "",
      description: bug?.description || "",
      priority: bug?.priority || "medium",
      status: bug?.status || "open",
      assignee: bug?.assignee || "",
    },
  })

  const priority = watch("priority")
  const status = watch("status")

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      updateBug(bug.id, data)
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Bug</DialogTitle>
          <DialogDescription>Update the bug details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Bug Title</label>
            <Input placeholder="Brief description of the bug" {...register("title")} className="mt-1" />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              placeholder="Detailed description of the bug..."
              {...register("description")}
              className="mt-1"
              rows={4}
            />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Priority</label>
              <Select value={priority} onValueChange={(value) => setValue("priority", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-destructive mt-1">{errors.priority.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={status} onValueChange={(value) => setValue("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Assigned To</label>
            <Input placeholder="Developer name or email" {...register("assignee")} className="mt-1" />
            {errors.assignee && <p className="text-sm text-destructive mt-1">{errors.assignee.message}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Updating..." : "Update Bug"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
