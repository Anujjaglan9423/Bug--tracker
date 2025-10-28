"use client"

import { useAppContext } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, AlertTriangle, AlertCircle, AlertOctagon, Filter } from "lucide-react"
import { useState } from "react"

export function BugList() {
  const { bugs, modules, projects } = useAppContext()
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null)

  const filteredBugs = bugs.filter((bug) => {
    if (filterStatus && bug.status !== filterStatus) return false
    if (filterSeverity && bug.severity !== filterSeverity) return false
    return true
  })

  const severityIcon = {
    low: <AlertCircle className="h-4 w-4 text-blue-500" />,
    medium: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    high: <AlertOctagon className="h-4 w-4 text-orange-500" />,
    critical: <AlertOctagon className="h-4 w-4 text-red-500" />,
  }

  const getModuleName = (moduleId: string) => modules.find((m) => m.id === moduleId)?.name || "Unknown"
  const getProjectName = (projectId: string) => projects.find((p) => p.id === projectId)?.name || "Unknown"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bug Tracker</h1>
          <p className="text-muted-foreground mt-1">Manage and track all bugs across your projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(null)}
              >
                All Status
              </Button>
              <Button
                variant={filterStatus === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("open")}
              >
                Open
              </Button>
              <Button
                variant={filterStatus === "in-progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("in-progress")}
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === "resolved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("resolved")}
              >
                Resolved
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterSeverity === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeverity(null)}
              >
                All Severity
              </Button>
              <Button
                variant={filterSeverity === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeverity("critical")}
              >
                Critical
              </Button>
              <Button
                variant={filterSeverity === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterSeverity("high")}
              >
                High
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bugs List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bugs</CardTitle>
          <CardDescription>{filteredBugs.length} bugs found</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBugs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bugs match your filters.</p>
          ) : (
            <div className="space-y-3">
              {filteredBugs.map((bug) => (
                <div
                  key={bug.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{severityIcon[bug.severity as keyof typeof severityIcon]}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{bug.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{bug.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{getProjectName(bug.projectId)}</span>
                        <span>•</span>
                        <span>{getModuleName(bug.moduleId)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
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
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
