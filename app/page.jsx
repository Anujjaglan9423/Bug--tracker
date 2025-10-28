"use client"

import React from "react"

import { AppProvider, useAppContext } from "@/lib/context"
import { Sidebar } from "@/components/sidebar"
import { ProjectOverview } from "@/components/project-overview"
import { ModuleDetail } from "@/components/module-detail"
import { Dashboard } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { useState } from "react"

function MainContent() {
  const { selectedProjectId, selectedModuleId } = useAppContext()
  const [showDashboard, setShowDashboard] = useState(true)

  const handleViewChange = () => {
    if (!showDashboard && (selectedProjectId || selectedModuleId)) {
      return
    }
    if (selectedProjectId || selectedModuleId) {
      setShowDashboard(false)
    }
  }

  React.useEffect(() => {
    handleViewChange()
  }, [selectedProjectId, selectedModuleId])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between md:hidden">
          <h2 className="font-semibold"></h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            {showDashboard ? "Projects" : "Dashboard"}
          </Button>
        </div>

        <div className="hidden md:flex sticky top-0 bg-background border-b border-border p-4 gap-2 z-10">
          <Button
            variant={showDashboard ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDashboard(true)}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={!showDashboard ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDashboard(false)}
            className="flex items-center gap-2"
          >
            Projects
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {showDashboard ? <Dashboard /> : selectedModuleId ? <ModuleDetail /> : <ProjectOverview />}
        </div>
      </main>
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}
