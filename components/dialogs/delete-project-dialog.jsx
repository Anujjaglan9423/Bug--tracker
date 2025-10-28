"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

export function DeleteProjectDialog({ projectId, projectName }) {
  const [open, setOpen] = useState(false)
  const { deleteProject, setSelectedProjectId, projects } = useAppContext()

  const handleDelete = () => {
    deleteProject(projectId)
    setSelectedProjectId(projects[0]?.id || null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{projectName}</strong>? All modules and bugs associated with this
            project will also be deleted.
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
