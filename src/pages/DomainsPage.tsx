import { useState } from "react";
import { domainNames, domainProjects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

type DomainName = (typeof domainNames)[number];

function DomainsPage() {
  const initialDomain: DomainName = domainNames[0] ?? "Minecraft Modding";
  const [selectedDomain, setSelectedDomain] =
    useState<DomainName>(initialDomain);
  const domainEntry = domainProjects[selectedDomain];
  const projects = domainEntry?.projects ?? [];
  const note = domainEntry?.note;

  return (
    <section className="panel">
      <h1 className="section-title">Projects by Domain</h1>
      <p className="section-copy">
        Projects on this page are organized by domain, select one from the
        dropdown to see relevant projects.
      </p>
      <select
        id="domain-select"
        className="domain-select"
        value={selectedDomain}
        onChange={(event) =>
          setSelectedDomain(event.target.value as DomainName)
        }
      >
        {domainNames.map((domain) => (
          <option key={domain} value={domain}>
            {domain}
          </option>
        ))}
      </select>
      {note && (
        <p className="domain-note" role="note">
          <strong>Note:</strong> {note}
        </p>
      )}
      <ul className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ul>
    </section>
  );
}

export default DomainsPage;
