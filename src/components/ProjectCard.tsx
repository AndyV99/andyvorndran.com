import IconLink from './IconLink'
import type { Project, ProjectDownloadNoun, ProjectLink } from '../types/content'

type ProjectCardProps = {
  project: Project
}

const numberFormatter = new Intl.NumberFormat('en-US')

const formatDownloadCount = (count: number, noun: ProjectDownloadNoun) =>
  `${numberFormatter.format(count)} ${count === 1 ? noun : `${noun}s`}`

function ProjectCard({ project }: ProjectCardProps) {
  const linkLabelByIcon: Record<ProjectLink['icon'], string> = {
    github: `Open GitHub for ${project.title}`,
    external: `Open external site for ${project.title}`,
  }
  const downloadStat = project.downloadStat

  return (
    <li className="project-card">
      <div className="project-card-header">
        <h2>{project.title}</h2>
        <div className="project-card-links">
          {project.links.map((link) => (
            <IconLink
              key={`${project.title}-${link.icon}-${link.url}`}
              url={link.url}
              icon={link.icon}
              label={linkLabelByIcon[link.icon]}
            />
          ))}
        </div>
      </div>
      <p>{project.description}</p>
      {downloadStat ? (
        <div className="project-downloads">
          <p className="project-download-total">
            {formatDownloadCount(downloadStat.total, downloadStat.noun)}
          </p>
        </div>
      ) : null}
      <p className="project-stack">{project.stack}</p>
    </li>
  )
}

export default ProjectCard
