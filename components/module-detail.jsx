"use client"

import { useAppContext } from "@/lib/context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle, ArrowLeft, Download } from "lucide-react"
import { EditModuleDialog } from "@/components/dialogs/edit-module-dialog"
import { DeleteModuleDialog } from "@/components/dialogs/delete-module-dialog"
import { AddBugDialog } from "@/components/dialogs/add-bug-dialog"
import { EditBugDialog } from "@/components/dialogs/edit-bug-dialog"
import { DeleteBugDialog } from "@/components/dialogs/delete-bug-dialog"

export function ModuleDetail() {
  const { modules, bugs, selectedProjectId, selectedModuleId, setSelectedModuleId } = useAppContext()

  const selectedModule = modules.find((m) => m.id === selectedModuleId && m.projectId === selectedProjectId)
  const moduleBugs = bugs.filter((b) => b.moduleId === selectedModuleId)

  if (!selectedModule) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a module to view details</p>
      </div>
    )
  }

  const bugStats = {
    open: moduleBugs.filter((b) => b.status === "open").length,
    inProgress: moduleBugs.filter((b) => b.status === "in-progress").length,
    resolved: moduleBugs.filter((b) => b.status === "resolved").length,
    closed: moduleBugs.filter((b) => b.status === "closed").length,
  }

  const statusIcon = {
    planning: <Clock className="h-5 w-5 text-gray-500" />,
    "in-progress": <AlertCircle className="h-5 w-5 text-blue-500" />,
    completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => setSelectedModuleId(null)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Project
      </Button>

      {/* Module Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div>{statusIcon[selectedModule.status]}</div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{selectedModule.name}</h1>
            <p className="text-muted-foreground mt-2">{selectedModule.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  selectedModule.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : selectedModule.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {selectedModule.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <EditModuleDialog
            moduleId={selectedModule.id}
            moduleName={selectedModule.name}
            moduleDescription={selectedModule.description}
            moduleStatus={selectedModule.status}
          />
          <DeleteModuleDialog moduleId={selectedModule.id} moduleName={selectedModule.name} />
        </div>
      </div>

      {/* Bug Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bugs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleBugs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{bugStats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{bugStats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{bugStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bugs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bugs & Issues</CardTitle>
              <CardDescription>All bugs associated with this module</CardDescription>
            </div>
            <AddBugDialog projectId={selectedProjectId} moduleId={selectedModuleId} />
          </div>
        </CardHeader>
        <CardContent>
          {moduleBugs.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bugs reported for this module.</p>
          ) : (
            <div className="space-y-3">
              {moduleBugs.map((bug) => (
                <div key={bug.id} className="flex flex-col p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{bug.title}</p>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
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
                      </div>
                      <p className="text-sm text-muted-foreground">{bug.description}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
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
                      <EditBugDialog
                        bugId={bug.id}
                        bugTitle={bug.title}
                        bugDescription={bug.description}
                        bugSeverity={bug.severity}
                        bugStatus={bug.status}
                        bugAssignee={bug.assignee}
                        bugAttachments={bug.attachments}
                      />
                      <DeleteBugDialog bugId={bug.id} bugTitle={bug.title} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t text-sm">
                    {bug.assignee && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">{bug.assignee}</span>
                      </div>
                    )}
                    {bug.attachments && bug.attachments.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Attachments:</span>
                        <div className="flex gap-2">
                          {bug.attachments.map((att) => (
                            <a
                              key={att.id}
                              href={att.url}
                              download={att.name}
                              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                            >
                              <Download className="h-3 w-3" />
                              {att.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Module Info</CardTitle>
          <CardDescription>Creation and update timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm font-medium">{selectedModule.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium">{selectedModule.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
