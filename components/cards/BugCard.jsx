"use client"

import { useBugTracker } from "@/context/BugTrackerContext"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2 } from "lucide-react"
import { useState } from "react"
import EditBugDialog from "../dialogs/EditBugDialog"

const statusColors = {
  open: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  in_progress: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  resolved: "bg-green-500/20 text-green-700 dark:text-green-400",
  closed: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
}

const priorityColors = {
  low: "bg-green-500/20 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/20 text-red-700 dark:text-red-400",
  critical: "bg-red-600/20 text-red-800 dark:text-red-300",
}

export default function BugCard({ bug }) {
  const { deleteBug } = useBugTracker()
  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      <Card className="p-4 hover:shadow-lg transition-shadow group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{bug.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{bug.description}</p>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteBug(bug.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge className={statusColors[bug.status]}>{bug.status.replace("_", " ")}</Badge>
          <Badge className={priorityColors[bug.priority]}>{bug.priority}</Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          Assigned to: <span className="font-medium">{bug.assignee}</span>
        </div>
      </Card>

      <EditBugDialog open={showEdit} onOpenChange={setShowEdit} bug={bug} />
    </>
  )
}
