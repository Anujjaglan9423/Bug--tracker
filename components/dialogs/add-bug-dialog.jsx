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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X } from "lucide-react"

const DEVELOPERS = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Alex Brown", "Emma Davis"]

export function AddBugDialog({ projectId, moduleId, triggerClassName = "" }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState("medium")
  const [status, setStatus] = useState("open")
  const [assignee, setAssignee] = useState("Unassigned")
  const [selectedModule, setSelectedModule] = useState(moduleId || "")
  const [attachments, setAttachments] = useState([])
  const { addBug, modules } = useAppContext()

  const projectModules = modules.filter((m) => m.projectId === projectId)

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAttachments((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: file.name,
            url: event.target?.result,
            uploadedAt: new Date(),
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim() && selectedModule) {
      addBug({
        projectId,
        moduleId: selectedModule,
        title: title.trim(),
        description: description.trim(),
        severity,
        status,
        assignee: assignee || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
      setTitle("")
      setDescription("")
      setSeverity("medium")
      setStatus("open")
      setAssignee("Unassigned")
      setSelectedModule(moduleId || "")
      setAttachments([])
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName}>
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report New Bug</DialogTitle>
          <DialogDescription>Create a new bug report for this project</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bug-title">Bug Title</Label>
            <Input
              id="bug-title"
              placeholder="Enter bug title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bug-description">Description</Label>
            <Textarea
              id="bug-description"
              placeholder="Describe the bug in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {!moduleId && (
            <div className="space-y-2">
              <Label htmlFor="bug-module">Module</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger id="bug-module">
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {projectModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bug-severity">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="bug-severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="bug-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bug-assignee">Assign To Developer</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger id="bug-assignee">
                <SelectValue placeholder="Select a developer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {DEVELOPERS.map((dev) => (
                  <SelectItem key={dev} value={dev}>
                    {dev}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bug-attachments">Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                id="bug-attachments"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <label htmlFor="bug-attachments" className="cursor-pointer">
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload files or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">Images, PDFs, documents up to 10MB</p>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {attachments.map((att) => (
                  <div key={att.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate">{att.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedModule}>
              Report Bug
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
