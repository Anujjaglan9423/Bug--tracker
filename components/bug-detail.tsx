"use client"

import { useAppContext } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react"

export function BugDetail({ bugId }: { bugId: string }) {
  const { bugs, modules, projects } = useAppContext()

  const bug = bugs.find((b) => b.id === bugId)
  const module = bug ? modules.find((m) => m.id === bug.moduleId) : null
  const project = bug ? projects.find((p) => p.id === bug.projectId) : null

  if (!bug || !module || !project) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Bug not found</p>
      </div>
    )
  }

  const severityIcon = {
    low: <AlertCircle className="h-5 w-5 text-blue-500" />,
    medium: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    high: <AlertOctagon className="h-5 w-5 text-orange-500" />,
    critical: <AlertOctagon className="h-5 w-5 text-red-500" />,
  }

  return (
    <div className="space-y-6">
      {/* Bug Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div>{severityIcon[bug.severity as keyof typeof severityIcon]}</div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{bug.title}</h1>
            <p className="text-muted-foreground mt-2">{bug.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  bug.severity === "critical"
                    ? "bg-red-100 text-red-800"
                    : bug.severity === "high"
                      ? "bg-orange-100 text-orange-800"
                      : bug.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                }`}
              >
                {bug.severity} severity
              </span>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  bug.status === "closed"
                    ? "bg-gray-100 text-gray-800"
                    : bug.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : bug.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                }`}
              >
                {bug.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Bug Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Project</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-foreground">{project.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-foreground">{module.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-foreground capitalize">{bug.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-foreground capitalize">{bug.severity}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Bug creation and update history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-sm text-muted-foreground">Reported</span>
              <span className="text-sm font-medium">{bug.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium">{bug.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Full Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{bug.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
