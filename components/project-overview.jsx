"use client"

import { useAppContext } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditProjectDialog } from "@/components/dialogs/edit-project-dialog"
import { DeleteProjectDialog } from "@/components/dialogs/delete-project-dialog"
import { AddModuleDialog } from "@/components/dialogs/add-module-dialog"
import { AddBugDialog } from "@/components/dialogs/add-bug-dialog"
import { EditModuleDialog } from "@/components/dialogs/edit-module-dialog"
import { EditBugDialog } from "@/components/dialogs/edit-bug-dialog"
import { DeleteModuleDialog } from "@/components/dialogs/delete-module-dialog"
import { DeleteBugDialog } from "@/components/dialogs/delete-bug-dialog"

export function ProjectOverview() {
  const { projects, modules, bugs, selectedProjectId, setSelectedModuleId } = useAppContext()

  const selectedProject = projects.find((p) => p.id === selectedProjectId)
  const projectModules = modules.filter((m) => m.projectId === selectedProjectId)
  const projectBugs = bugs.filter((b) => b.projectId === selectedProjectId)

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a project to view details</p>
      </div>
    )
  }

  const moduleStats = {
    planning: projectModules.filter((m) => m.status === "planning").length,
    inProgress: projectModules.filter((m) => m.status === "in-progress").length,
    completed: projectModules.filter((m) => m.status === "completed").length,
  }

  const bugStats = {
    open: projectBugs.filter((b) => b.status === "open").length,
    inProgress: projectBugs.filter((b) => b.status === "in-progress").length,
    resolved: projectBugs.filter((b) => b.status === "resolved").length,
    closed: projectBugs.filter((b) => b.status === "closed").length,
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{selectedProject.name}</h1>
          <p className="text-muted-foreground mt-2">{selectedProject.description}</p>
        </div>
        <div className="flex gap-2">
          <EditProjectDialog
            projectId={selectedProject.id}
            projectName={selectedProject.name}
            projectDescription={selectedProject.description}
          />
          <DeleteProjectDialog projectId={selectedProject.id} projectName={selectedProject.name} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectModules.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{moduleStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectBugs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bugStats.open}</div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Modules</CardTitle>
              <CardDescription>Project modules and their status</CardDescription>
            </div>
            <AddModuleDialog projectId={selectedProjectId} />
          </div>
        </CardHeader>
        <CardContent>
          {projectModules.length === 0 ? (
            <p className="text-muted-foreground text-sm">No modules yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {projectModules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div
                    className="flex-1 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    <p className="font-medium text-foreground">{module.name}</p>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        module.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : module.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {module.status}
                    </span>
                    <EditModuleDialog
                      moduleId={module.id}
                      moduleName={module.name}
                      moduleDescription={module.description}
                      moduleStatus={module.status}
                    />
                    <DeleteModuleDialog moduleId={module.id} moduleName={module.name} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bugs Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Bugs</CardTitle>
              <CardDescription>Latest issues reported in this project</CardDescription>
            </div>
            <AddBugDialog projectId={selectedProjectId} />
          </div>
        </CardHeader>
        <CardContent>
          {projectBugs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bugs reported. Great job!</p>
          ) : (
            <div className="space-y-3">
              {projectBugs.slice(0, 5).map((bug) => (
                <div key={bug.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{bug.title}</p>
                    <p className="text-sm text-muted-foreground">{bug.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        bug.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : bug.severity === "high"
                            ? "bg-orange-100 text-orange-800"
                            : bug.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {bug.severity}
                    </span>
                    <EditBugDialog
                      bugId={bug.id}
                      bugTitle={bug.title}
                      bugDescription={bug.description}
                      bugSeverity={bug.severity}
                      bugStatus={bug.status}
                    />
                    <DeleteBugDialog bugId={bug.id} bugTitle={bug.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
