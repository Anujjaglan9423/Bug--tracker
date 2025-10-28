"use client"

import { useState } from "react"
import { useBugTracker } from "@/context/BugTrackerContext"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import BugCard from "../cards/BugCard"
import AddBugDialog from "../dialogs/AddBugDialog"

export default function ModuleView() {
  const { currentProject, currentModule, setCurrentModule, getProjectBugs } = useBugTracker()
  const [showAddBug, setShowAddBug] = useState(false)

  if (!currentProject || !currentModule) return null

  const moduleBugs = getProjectBugs(currentProject.id, currentModule.id)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentModule(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{currentModule.name}</h1>
            <p className="text-muted-foreground mt-1">
              {currentProject.name} / {currentModule.name}
            </p>
          </div>
          <Button
            onClick={() => setShowAddBug(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Report Bug
          </Button>
        </div>
      </div>

      {/* Bugs List */}
      <div className="flex-1 overflow-auto p-6">
        {moduleBugs.length > 0 ? (
          <div className="space-y-4">
            {moduleBugs.map((bug) => (
              <BugCard key={bug.id} bug={bug} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No bugs reported yet</p>
              <Button onClick={() => setShowAddBug(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Report First Bug
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddBugDialog
        open={showAddBug}
        onOpenChange={setShowAddBug}
        projectId={currentProject.id}
        moduleId={currentModule.id}
      />
    </div>
  )
}
