import { z } from "zod"

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").min(3, "Name must be at least 3 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
})

export const moduleSchema = z.object({
  name: z.string().min(1, "Module name is required").min(3, "Name must be at least 3 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  status: z.enum(["planning", "in-progress", "completed"]),
})

export const bugSchema = z.object({
  title: z.string().min(1, "Bug title is required").min(5, "Title must be at least 5 characters"),
  description: z.string().min(1, "Description is required").min(10, "Description must be at least 10 characters"),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
  assignee: z.string().optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type ModuleFormData = z.infer<typeof moduleSchema>
export type BugFormData = z.infer<typeof bugSchema>
