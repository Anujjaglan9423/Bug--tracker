"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { moduleSchema, type ModuleFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppContext } from "@/lib/context"
import { useState } from "react"

interface ModuleFormProps {
  onClose: () => void
  projectId: string
  moduleId?: string
}

export function ModuleForm({ onClose, projectId, moduleId }: ModuleFormProps) {
  const { modules, addModule, updateModule } = useAppContext()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const module = moduleId ? modules.find((m) => m.id === moduleId) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: module?.name || "",
      description: module?.description || "",
      status: module?.status || "planning",
    },
  })

  const onSubmit = async (data: ModuleFormData) => {
    setIsSubmitting(true)
    try {
      if (moduleId) {
        updateModule(moduleId, data)
      } else {
        addModule({ ...data, projectId })
      }
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Module Name</label>
        <Input {...register("name")} placeholder="Enter module name" className="w-full" disabled={isSubmitting} />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <Textarea
          {...register("description")}
          placeholder="Enter module description"
          className="w-full min-h-24"
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Status</label>
        <select
          {...register("status")}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
          disabled={isSubmitting}
        >
          <option value="planning">Planning</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : moduleId ? "Update Module" : "Create Module"}
        </Button>
      </div>
    </form>
  )
}
