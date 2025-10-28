"use client"

import { FolderOpen } from "lucide-react"

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Project Selected</h2>
        <p className="text-muted-foreground">Select a project from the sidebar or create a new one to get started.</p>
      </div>
    </div>
  )
}
