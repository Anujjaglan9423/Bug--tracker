"use client"

import { useState } from "react"
import { useBugTracker } from "@/context/BugTrackerContext"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import AddModuleDialog from "../dialogs/AddModuleDialog"
import ModuleCard from "../cards/ModuleCard"

export default function ProjectView() {
  const { currentProject, setCurrentProject, setCurrentModule } = useBugTracker()
  const [showAddModule, setShowAddModule] = useState(false)

  if (!currentProject) return null

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentProject(null)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{currentProject.name}</h1>
            <p className="text-muted-foreground mt-1">{currentProject.description}</p>
          </div>
          <Button
            onClick={() => setShowAddModule(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </Button>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="flex-1 overflow-auto p-6">
        {currentProject.modules && currentProject.modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProject.modules.map((module) => (
              <ModuleCard key={module.id} module={module} onSelect={() => setCurrentModule(module)} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No modules yet</p>
              <Button onClick={() => setShowAddModule(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Module
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddModuleDialog open={showAddModule} onOpenChange={setShowAddModule} projectId={currentProject.id} />
    </div>
  )
}
