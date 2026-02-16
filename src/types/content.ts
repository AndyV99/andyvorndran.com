export type LinkIcon = 'github' | 'external'

export type ProjectLink = {
  url: string
  icon: LinkIcon
}

export type Project = {
  title: string
  description: string
  stack: string
  links: ProjectLink[]
}

export type DomainEntry = {
  note?: string
  projects: Project[]
}

export type DomainProjects = Record<string, DomainEntry>

export type CssDemo = {
  title: string
  description: string
  className: string
  link: string
}
