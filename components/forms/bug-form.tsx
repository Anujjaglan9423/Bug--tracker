"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bugSchema, type BugFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/lib/context"
import { useState } from "react"

interface BugFormProps {
  onClose: () => void
  projectId: string
  moduleId: string
  bugId?: string
}

export function BugForm({ onClose, projectId, moduleId, bugId }: BugFormProps) {
  const { bugs, addBug, updateBug } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const bug = bugId ? bugs.find((b) => b.id === bugId) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BugFormData>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: bug?.title || "",
      description: bug?.description || "",
      severity: bug?.severity || "medium",
      status: bug?.status || "open",
    },
  })

  const onSubmit = async (data: BugFormData) => {
    setIsSubmitting(true)
    try {
      if (bugId) {
        updateBug(bugId, data)
      } else {
        addBug({ ...data, projectId, moduleId })
      }
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Bug Title</label>
        <Input {...register("title")} placeholder="Enter bug title" className="w-full" disabled={isSubmitting} />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Enter bug description"
          className="w-full min-h-24"
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Severity</label>
          <select
            {...register("severity")}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.severity && <p className="text-sm text-destructive mt-1">{errors.severity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            disabled={isSubmitting}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : bugId ? "Update Bug" : "Report Bug"}
        </Button>
      </div>
    </form>
  )
}
