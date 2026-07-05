import { startTransition, useEffect, useState } from "react";
import { allProjects, domainNames, domainProjects } from "../data/projects";
import {
  fallbackProjectDownloadStats,
  loadProjectDownloadStats,
} from "../data/projectDownloadStats";
import type {
  Project,
  ProjectDownloadNoun,
  ProjectDownloadStatsMap,
} from "../types/content";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatDownloadCount(count: number, noun: ProjectDownloadNoun) {
  return `${numberFormatter.format(count)} ${count === 1 ? noun : `${noun}s`}`;
}

function ProjectIndex() {
  const [downloadStats, setDownloadStats] = useState<ProjectDownloadStatsMap>(
    fallbackProjectDownloadStats,
  );

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

  let runningIndex = 0;

  return (
    <section className="index-section" id="index">
      <div className="index-head">
        <h2>Index — shipped work</h2>
        <p className="index-count">
          {String(allProjects.length).padStart(3, "0")} entries
        </p>
      </div>

      {domainNames.map((domainName) => {
        const domainEntry = domainProjects[domainName];
        const projects: Project[] = (domainEntry?.projects ?? []).map(
          (project) => ({
            ...project,
            downloadStat: downloadStats[project.id] ?? project.downloads?.stat,
          }),
        );

        return (
          <div className="domain-group" key={domainName}>
            <p className="domain-label">{domainName}</p>
            {domainEntry?.note && (
              <p className="domain-note">{domainEntry.note}</p>
            )}
            <div className="manifest">
              {projects.map((project) => {
                runningIndex += 1;
                const index = String(runningIndex).padStart(3, "0");

                return (
                  <article
                    className={`manifest-row${
                      project.id === "portfolio-site" ? " is-featured" : ""
                    }`}
                    key={project.id}
                  >
                    <span className="m-index">{index}</span>
                    <div className="m-title-wrap">
                      <h3 className="m-title">{project.title}</h3>
                      <p className="m-desc">{project.description}</p>
                      {project.downloadStat && (
                        <p className="m-stat">
                          {formatDownloadCount(
                            project.downloadStat.total,
                            project.downloadStat.noun,
                          )}
                        </p>
                      )}
                    </div>
                    <div className="m-stack">
                      {project.stack.split(",").map((tech) => (
                        <span className="chip" key={tech}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <div className="m-links">
                      {project.links.map((link) => (
                        <a
                          key={`${project.id}-${link.url}`}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          [{link.label ?? (link.icon === "github" ? "GitHub" : "Visit")}]
                        </a>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default ProjectIndex;
