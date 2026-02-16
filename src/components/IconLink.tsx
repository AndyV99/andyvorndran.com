import type { LinkIcon } from '../types/content'

type IconLinkProps = {
  url: string
  icon: LinkIcon
  label: string
  className?: string
}

function GithubIcon() {
  return (
    <svg aria-hidden="true" className="icon-link-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58l-.01-2.02c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.73.08-.73 1.21.09 1.85 1.23 1.85 1.23 1.08 1.84 2.83 1.31 3.52 1 .11-.77.42-1.31.76-1.61-2.67-.3-5.48-1.32-5.48-5.87 0-1.3.47-2.36 1.23-3.2-.12-.3-.53-1.53.12-3.2 0 0 1-.32 3.3 1.22a11.6 11.6 0 0 1 6 0c2.3-1.54 3.3-1.22 3.3-1.22.65 1.67.24 2.9.12 3.2.76.84 1.23 1.9 1.23 3.2 0 4.56-2.82 5.57-5.51 5.87.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      className="icon-link-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v7h-7" />
      <path d="M3 10V3h7" />
      <path d="M3 21h7v-7" />
    </svg>
  )
}

function IconLink({ url, icon, label, className = '' }: IconLinkProps) {
  const iconNode = icon === 'github' ? <GithubIcon /> : <ExternalIcon />

  return (
    <a
      className={`icon-link ${className}`.trim()}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
    >
      {iconNode}
      <span className="visually-hidden">{label}</span>
    </a>
  )
}

export default IconLink
