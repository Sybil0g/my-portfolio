export interface Project {
  id: string
  title: string
  // Short blurb shown on the project card / grid
  summary: string
  // Full write-up shown on the project's own page
  description: string
  // Main image shown on the card
  thumbnailUrl: string
  // Extra screenshots shown on the project's own page (optional)
  imageUrls: string[]
  techStack: string[]
  liveUrl?: string
  repoUrl?: string
  // Lower number = shows first in the grid
  order: number
  // Featured projects can be highlighted on the landing page
  featured: boolean
  createdAt: number
  updatedAt: number
}

export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
