import type { Project, ProjectCover } from '@/content/types'

/**
 * What a project shows inside: its gallery, or the card's cover on its own.
 * Empty when it has neither, which the gallery draws as a placeholder.
 */
export function projectMedia(project: Project): readonly ProjectCover[] {
  if (project.gallery && project.gallery.length > 0) return project.gallery
  return project.cover ? [project.cover] : []
}
