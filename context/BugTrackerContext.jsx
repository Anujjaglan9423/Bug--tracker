"use client"

import { createContext, useContext, useState, useEffect } from "react"

const BugTrackerContext = createContext()

export function BugTrackerProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [currentModule, setCurrentModule] = useState(null)
  const [bugs, setBugs] = useState([])
  const [mounted, setMounted] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects")
    const savedBugs = localStorage.getItem("bugs")
    const savedCurrentProject = localStorage.getItem("currentProject")
    const savedCurrentModule = localStorage.getItem("currentModule")

    if (savedProjects) setProjects(JSON.parse(savedProjects))
    if (savedBugs) setBugs(JSON.parse(savedBugs))
    if (savedCurrentProject) setCurrentProject(JSON.parse(savedCurrentProject))
    if (savedCurrentModule) setCurrentModule(JSON.parse(savedCurrentModule))

    setMounted(true)
  }, [])

  // Save projects to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("projects", JSON.stringify(projects))
    }
  }, [projects, mounted])

  // Save bugs to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("bugs", JSON.stringify(bugs))
    }
  }, [bugs, mounted])

  // Save current project to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("currentProject", JSON.stringify(currentProject))
    }
  }, [currentProject, mounted])

  // Save current module to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("currentModule", JSON.stringify(currentModule))
    }
  }, [currentModule, mounted])

  const addProject = (project) => {
    const newProject = {
      id: Date.now(),
      ...project,
      createdAt: new Date().toISOString(),
      modules: [],
    }
    setProjects([...projects, newProject])
    return newProject
  }

  const updateProject = (id, updates) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id))
    setBugs(bugs.filter((b) => b.projectId !== id))
    if (currentProject?.id === id) {
      setCurrentProject(null)
      setCurrentModule(null)
    }
  }

  const addModule = (projectId, module) => {
    const newModule = {
      id: Date.now(),
      ...module,
      projectId,
      createdAt: new Date().toISOString(),
    }
    setProjects(projects.map((p) => (p.id === projectId ? { ...p, modules: [...(p.modules || []), newModule] } : p)))
    return newModule
  }

  const updateModule = (projectId, moduleId, updates) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              modules: p.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
            }
          : p,
      ),
    )
  }

  const deleteModule = (projectId, moduleId) => {
    setProjects(
      projects.map((p) => (p.id === projectId ? { ...p, modules: p.modules.filter((m) => m.id !== moduleId) } : p)),
    )
    setBugs(bugs.filter((b) => !(b.projectId === projectId && b.moduleId === moduleId)))
    if (currentModule?.id === moduleId) {
      setCurrentModule(null)
    }
  }

  const addBug = (bug) => {
    const newBug = {
      id: Date.now(),
      ...bug,
      createdAt: new Date().toISOString(),
      status: bug.status || "open",
    }
    setBugs([...bugs, newBug])
    return newBug
  }

  const updateBug = (id, updates) => {
    setBugs(bugs.map((b) => (b.id === id ? { ...b, ...updates } : b)))
  }

  const deleteBug = (id) => {
    setBugs(bugs.filter((b) => b.id !== id))
  }

  const getProjectBugs = (projectId, moduleId) => {
    return bugs.filter((b) => b.projectId === projectId && (moduleId ? b.moduleId === moduleId : true))
  }

  return (
    <BugTrackerContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        currentModule,
        setCurrentModule,
        bugs,
        addProject,
        updateProject,
        deleteProject,
        addModule,
        updateModule,
        deleteModule,
        addBug,
        updateBug,
        deleteBug,
        getProjectBugs,
      }}
    >
      {children}
    </BugTrackerContext.Provider>
  )
}

export function useBugTracker() {
  const context = useContext(BugTrackerContext)
  if (!context) {
    throw new Error("useBugTracker must be used within BugTrackerProvider")
  }
  return context
}
