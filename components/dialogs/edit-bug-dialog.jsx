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
import { Edit2, Upload, X } from "lucide-react"

const DEVELOPERS = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Alex Brown", "Emma Davis"]

export function EditBugDialog({
  bugId,
  bugTitle,
  bugDescription,
  bugSeverity,
  bugStatus,
  bugAssignee,
  bugAttachments,
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(bugTitle)
  const [description, setDescription] = useState(bugDescription)
  const [severity, setSeverity] = useState(bugSeverity || "low")
  const [status, setStatus] = useState(bugStatus || "open")
  const [assignee, setAssignee] = useState(bugAssignee || "unassigned")
  const [attachments, setAttachments] = useState(bugAttachments || [])
  const { updateBug } = useAppContext()

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
    if (title.trim()) {
      updateBug(bugId, {
        title: title.trim(),
        description: description.trim(),
        severity,
        status,
        assignee: assignee !== "unassigned" ? assignee : undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Bug</DialogTitle>
          <DialogDescription>Update bug details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-bug-title">Bug Title</Label>
            <Input
              id="edit-bug-title"
              placeholder="Enter bug title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-bug-description">Description</Label>
            <Textarea
              id="edit-bug-description"
              placeholder="Describe the bug in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bug-severity">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="edit-bug-severity">
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
              <Label htmlFor="edit-bug-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="edit-bug-status">
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
            <Label htmlFor="edit-bug-assignee">Assign To Developer</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger id="edit-bug-assignee">
                <SelectValue placeholder="Select a developer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {DEVELOPERS.map((dev) => (
                  <SelectItem key={dev} value={dev}>
                    {dev}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-bug-attachments">Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                id="edit-bug-attachments"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <label htmlFor="edit-bug-attachments" className="cursor-pointer">
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
            <Button type="submit">Update Bug</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
