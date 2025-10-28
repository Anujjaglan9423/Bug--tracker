"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/lib/context"
import { useState } from "react"

interface ProjectFormProps {
  onClose: () => void
  projectId?: string
}

export function ProjectForm({ onClose, projectId }: ProjectFormProps) {
  const { projects, addProject, updateProject } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const project = projectId ? projects.find((p) => p.id === projectId) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    try {
      if (projectId) {
        updateProject(projectId, data)
      } else {
        addProject(data)
      }
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Project Name</label>
        <Input {...register("name")} placeholder="Enter project name" className="w-full" disabled={isSubmitting} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Enter project description"
          className="w-full min-h-24"
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : projectId ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
