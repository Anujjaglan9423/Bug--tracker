"use client"

import { useAppContext } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, AlertCircle } from "lucide-react"

export function Dashboard() {
  const { projects, modules, bugs, setSelectedProjectId, setSelectedModuleId } = useAppContext()

  const totalBugs = bugs.length
  const openBugs = bugs.filter((b) => b.status === "open").length
  const inProgressBugs = bugs.filter((b) => b.status === "in-progress").length
  const resolvedBugs = bugs.filter((b) => b.status === "resolved").length
  const closedBugs = bugs.filter((b) => b.status === "closed").length

  const totalModules = modules.length
  const completedModules = modules.filter((m) => m.status === "completed").length
  const inProgressModules = modules.filter((m) => m.status === "in-progress").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of all projects and their status</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModules}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBugs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{openBugs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedBugs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bug Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bug Status Breakdown</CardTitle>
            <CardDescription>Distribution of bugs by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Open</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${totalBugs > 0 ? (openBugs / totalBugs) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{openBugs}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${totalBugs > 0 ? (inProgressBugs / totalBugs) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{inProgressBugs}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Resolved</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full"
                    style={{ width: `${totalBugs > 0 ? (resolvedBugs / totalBugs) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{resolvedBugs}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Closed</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${totalBugs > 0 ? (closedBugs / totalBugs) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{closedBugs}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Status</CardTitle>
            <CardDescription>Distribution of modules by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">In Progress</span>
              <span className="text-sm font-semibold">{inProgressModules}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-semibold">{completedModules}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Planning</span>
              <span className="text-sm font-semibold">{totalModules - inProgressModules - completedModules}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Summary</CardTitle>
          <CardDescription>Overview of all projects</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">No projects yet. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => {
                const projectModules = modules.filter((m) => m.projectId === project.id)
                const projectBugs = bugs.filter((b) => b.projectId === project.id)
                const projectOpenBugs = projectBugs.filter((b) => b.status === "open").length

                return (
                  <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{project.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">{project.description}</CardDescription>
                        </div>
                        <FolderOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Modules</p>
                          <p className="font-semibold">{projectModules.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Bugs</p>
                          <p className="font-semibold">{projectBugs.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-muted-foreground">{projectOpenBugs} open issues</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedProjectId(project.id)
                          setSelectedModuleId(null)
                        }}
                      >
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
