import { startTransition, useEffect, useState } from "react";
import { domainNames, domainProjects } from "../data/projects";
import {
  fallbackProjectDownloadStats,
  loadProjectDownloadStats,
} from "../data/projectDownloadStats";
import ProjectCard from "../components/ProjectCard";
import type { Project, ProjectDownloadStatsMap } from "../types/content";

type DomainName = (typeof domainNames)[number];

function DomainsPage() {
  const initialDomain: DomainName = domainNames[0] ?? "Minecraft Modding";
  const [selectedDomain, setSelectedDomain] =
    useState<DomainName>(initialDomain);
  const [downloadStats, setDownloadStats] =
    useState<ProjectDownloadStatsMap>(fallbackProjectDownloadStats);

  useEffect(() => {
    let isActive = true;

    async function loadDownloadStats() {
      try {
        const payload = await loadProjectDownloadStats();

        if (isActive) {
          startTransition(() => {
            setDownloadStats(payload);
          });
        }
      } catch (error) {
        console.error(
          "[project-downloads] Failed to load project stats at page load",
          error,
        );
      }
    }

    void loadDownloadStats();

    return () => {
      isActive = false;
    };
  }, []);

  const domainEntry = domainProjects[selectedDomain];
  const projects: Project[] = (domainEntry?.projects ?? []).map((project) => ({
    ...project,
    downloadStat: downloadStats[project.id] ?? project.downloads?.stat,
  }));
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </section>
  );
}

export default DomainsPage;
