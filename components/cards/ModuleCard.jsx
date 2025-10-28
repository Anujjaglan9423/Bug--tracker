"use client"

import { useBugTracker } from "@/context/BugTrackerContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronRight } from "lucide-react"

export default function ModuleCard({ module, onSelect }) {
  const { currentProject, deleteModule, getProjectBugs } = useBugTracker()
  const bugCount = getProjectBugs(currentProject.id, module.id).length

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{module.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            deleteModule(currentProject.id, module.id)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm text-muted-foreground">{bugCount} bugs</span>
        <Button variant="ghost" size="sm" onClick={onSelect} className="gap-1">
          View <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
