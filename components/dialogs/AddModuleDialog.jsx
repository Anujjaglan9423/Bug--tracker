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

const moduleSchema = z.object({
  name: z.string().min(1, "Module name is required").min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
})

export default function AddModuleDialog({ open, onOpenChange, projectId }) {
  const { addModule } = useBugTracker()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(moduleSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      addModule(projectId, data)
      reset()
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Module</DialogTitle>
          <DialogDescription>Create a new module within this project to organize bugs.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Module Name</label>
            <Input placeholder="e.g., Authentication, Dashboard" {...register("name")} className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea placeholder="Describe this module..." {...register("description")} className="mt-1" />
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
              {isLoading ? "Adding..." : "Add Module"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
