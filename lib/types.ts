// Core data types for the project management application

export interface Project {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  projectId: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed"
  createdAt: Date
  updatedAt: Date
}

export interface Bug {
  id: string
  moduleId: string
  projectId: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "in-progress" | "resolved" | "closed"
  assignee?: string
  attachments?: Array<{
    id: string
    name: string
    url: string
    uploadedAt: Date
  }>
  createdAt: Date
  updatedAt: Date
}

export interface AppContextType {
  projects: Project[]
  modules: Module[]
  bugs: Bug[]
  selectedProjectId: string | null
  selectedModuleId: string | null
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  addModule: (module: Omit<Module, "id" | "createdAt" | "updatedAt">) => void
  updateModule: (id: string, module: Partial<Module>) => void
  deleteModule: (id: string) => void
  addBug: (bug: Omit<Bug, "id" | "createdAt" | "updatedAt">) => void
  updateBug: (id: string, bug: Partial<Bug>) => void
  deleteBug: (id: string) => void
  setSelectedProjectId: (id: string | null) => void
  setSelectedModuleId: (id: string | null) => void
}
