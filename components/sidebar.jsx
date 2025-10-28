"use client"

import { AddProjectDialog } from "@/components/dialogs/add-project-dialog"
import { AddModuleDialog } from "@/components/dialogs/add-module-dialog"
import { useAppContext } from "@/lib/context"
import { useState } from "react"
import { ChevronDown, FolderOpen, Bug, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "@/components/dialogs/settings-dialog"

export function Sidebar() {
  const { projects, modules, selectedProjectId, setSelectedProjectId, setSelectedModuleId } = useAppContext()
  const [expandedProjects, setExpandedProjects] = useState(new Set(["1"]))
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleProject = (projectId) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev)
      if (next.has(projectId)) {
        next.delete(projectId)
      } else {
        next.add(projectId)
      }
      return next
    })
  }

  const projectModules = modules.filter((m) => m.projectId === selectedProjectId)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-transparent border-gray-100 text-black"
        >
          {mobileOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto flex flex-col transition-transform duration-300 z-40 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-foreground hidden md:block">Project Manager</h1>
        </div>

        {/* Projects Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3 mt-3 md:mt-0">
              <h2 className="text-sm font-semibold text-sidebar-foreground uppercase tracking-wide">Projects</h2>
              <AddProjectDialog />
            </div>

            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id}>
                  <button
                    onClick={() => {
                      setSelectedProjectId(project.id)
                      setSelectedModuleId(null)
                      toggleProject(project.id)
                      setMobileOpen(false)
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${selectedProjectId === project.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedProjects.has(project.id) ? "" : "-rotate-90"}`}
                    />
                    <FolderOpen className="h-4 w-4" />
                    <span className="flex-1 text-left truncate">{project.name}</span>
                  </button>

                  {/* Modules */}
                  {expandedProjects.has(project.id) && (
                    <div className="ml-4 space-y-1 mt-1">
                      {projectModules.map((module) => (
                        <button
                          key={module.id}
                          onClick={() => {
                            setSelectedModuleId(module.id)
                            setMobileOpen(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                        >
                          <Bug className="h-4 w-4" />
                          <span className="flex-1 text-left truncate">{module.name}</span>
                          <span className="text-xs bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded">
                            {module.status}
                          </span>
                        </button>
                      ))}
                      <AddModuleDialog projectId={selectedProjectId} triggerClassName="w-full justify-start" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="outline" className="w-full text-sm bg-transparent text-white" onClick={() => setSettingsOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
