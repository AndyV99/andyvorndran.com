import IconLink from './IconLink'
import type { Project, ProjectLink } from '../types/content'

type ProjectCardProps = {
  project: Project
}

function ProjectCard({ project }: ProjectCardProps) {
  const linkLabelByIcon: Record<ProjectLink['icon'], string> = {
    github: `Open GitHub for ${project.title}`,
    external: `Open external site for ${project.title}`,
  }

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
      <p className="project-stack">{project.stack}</p>
    </li>
  )
}

export default ProjectCard
