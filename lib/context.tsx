"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { AppContextType, Project, Module, Bug } from "./types"

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete redesign of the company website",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Mobile App",
      description: "Native mobile application for iOS and Android",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
    },
  ])

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      projectId: "1",
      name: "Homepage",
      description: "Main landing page",
      status: "in-progress",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      projectId: "1",
      name: "Product Pages",
      description: "Product listing and detail pages",
      status: "planning",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20"),
    },
  ])

  const [bugs, setBugs] = useState<Bug[]>([
    {
      id: "1",
      moduleId: "1",
      projectId: "1",
      title: "Header alignment issue",
      description: "Header elements are misaligned on mobile",
      severity: "medium",
      status: "open",
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
    },
  ])

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>("1")
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProjects((prev) => [...prev, newProject])
  }, [])

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setModules((prev) => prev.filter((m) => m.projectId !== id))
    setBugs((prev) => prev.filter((b) => b.projectId !== id))
  }, [])

  const addModule = useCallback((module: Omit<Module, "id" | "createdAt" | "updatedAt">) => {
    const newModule: Module = {
      ...module,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setModules((prev) => [...prev, newModule])
  }, [])

  const updateModule = useCallback((id: string, updates: Partial<Module>) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m)))
  }, [])

  const deleteModule = useCallback((id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id))
    setBugs((prev) => prev.filter((b) => b.moduleId !== id))
  }, [])

  const addBug = useCallback((bug: Omit<Bug, "id" | "createdAt" | "updatedAt">) => {
    const newBug: Bug = {
      ...bug,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setBugs((prev) => [...prev, newBug])
  }, [])

  const updateBug = useCallback((id: string, updates: Partial<Bug>) => {
    setBugs((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b)))
  }, [])

  const deleteBug = useCallback((id: string) => {
    setBugs((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const value: AppContextType = {
    projects,
    modules,
    bugs,
    selectedProjectId,
    selectedModuleId,
    addProject,
    updateProject,
    deleteProject,
    addModule,
    updateModule,
    deleteModule,
    addBug,
    updateBug,
    deleteBug,
    setSelectedProjectId,
    setSelectedModuleId,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
