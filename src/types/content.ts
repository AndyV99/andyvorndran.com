export type LinkIcon = 'github' | 'external'

export type ProjectLink = {
  url: string
  icon: LinkIcon
}

export type ProjectDownloadNoun = 'download' | 'install'

export type ProjectDownloadSource = {
  label: string
  count: number
}

export type ProjectDownloadStat = {
  noun: ProjectDownloadNoun
  total: number
  sources: ProjectDownloadSource[]
}

export type ProjectDownloadSourceConfig =
  | {
      provider: 'cfwidget'
      label: string
      projectId: number
    }
  | {
      provider: 'modrinth'
      label: string
      projectSlug: string
    }
  | {
      provider: 'vscode-marketplace'
      label: string
      itemName: string
    }

export type ProjectDownloadConfig = {
  noun: ProjectDownloadNoun
  stat?: ProjectDownloadStat
  sources: ProjectDownloadSourceConfig[]
}

export type ProjectDefinition = {
  id: string
  title: string
  description: string
  stack: string
  links: ProjectLink[]
  order?: number
  downloads?: ProjectDownloadConfig
}

export type Project = ProjectDefinition & {
  downloadStat?: ProjectDownloadStat
}

export type DomainEntry = {
  note?: string
  projects: ProjectDefinition[]
}

export type DomainProjects = Record<string, DomainEntry>

export type ProjectDownloadStatsMap = Partial<Record<string, ProjectDownloadStat>>

export type ProjectDomainDefinition = {
  name: string
  note?: string
  order?: number
}

export type CssDemo = {
  title: string
  description: string
  className: string
  link: string
}
