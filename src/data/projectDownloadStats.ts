import { allProjects } from "./projects";
import type {
  ProjectDefinition,
  ProjectDownloadConfig,
  ProjectDownloadSourceConfig,
  ProjectDownloadSource,
  ProjectDownloadStat,
  ProjectDownloadStatsMap,
} from "../types/content";

const requestTimeoutMs = 10_000;

const projectsWithDownloads = allProjects.filter(
  (
    project,
  ): project is ProjectDefinition & { downloads: ProjectDownloadConfig } =>
    Boolean(project.downloads),
);

export const fallbackProjectDownloadStats = Object.fromEntries(
  projectsWithDownloads.flatMap((project) =>
    project.downloads.stat
      ? [[project.id, cloneProjectDownloadStat(project.downloads.stat)]]
      : [],
  ),
) as ProjectDownloadStatsMap;

export async function loadProjectDownloadStats(): Promise<ProjectDownloadStatsMap> {
  const nextProjects = cloneProjectDownloadStats(fallbackProjectDownloadStats);

  await Promise.all(
    projectsWithDownloads.map(
      async (
        project: ProjectDefinition & { downloads: ProjectDownloadConfig },
      ) => {
        const nextProject = ensureProjectStat(nextProjects, project);

        await Promise.all(
          project.downloads.sources.map(async (source) => {
            try {
              const count = await fetchProjectSourceCount(source);
              upsertSourceCount(nextProject, source.label, count);
            } catch (error) {
              console.warn(
                `[project-downloads] ${project.title} ${source.label}: ${
                  error instanceof Error ? error.message : String(error)
                }. Keeping fallback value if present.`,
              );
            }
          }),
        );

        nextProject.total = nextProject.sources.reduce(
          (sum, source) => sum + source.count,
          0,
        );
      },
    ),
  );

  return nextProjects;
}

async function fetchProjectSourceCount(
  source: ProjectDownloadSourceConfig,
): Promise<number> {
  switch (source.provider) {
    case "cfwidget":
      return fetchCurseForgeWidgetDownloadCount(source.projectId);
    case "modrinth":
      return fetchModrinthDownloadCount(source.projectSlug);
    case "vscode-marketplace":
      return fetchCountFromPage(
        `https://marketplace.visualstudio.com/items?itemName=${source.itemName}`,
        /\b([\d,]+)\s+installs\b/i,
      );
    default:
      throw new Error(`Unsupported download provider: ${String(source)}`);
  }
}

async function fetchModrinthDownloadCount(
  projectSlug: string,
): Promise<number> {
  const response = await fetchWithTimeout(
    `https://api.modrinth.com/v2/project/${projectSlug}`,
  );

  if (!response.ok) {
    throw new Error(`Modrinth API returned ${response.status}`);
  }

  const project = await response.json();

  if (typeof project.downloads !== "number") {
    throw new Error("Modrinth API response did not include downloads");
  }

  return project.downloads;
}

async function fetchCurseForgeWidgetDownloadCount(
  projectId: number,
): Promise<number> {
  const response = await fetchWithTimeout(
    `https://api.cfwidget.com/${projectId}`,
  );

  if (!response.ok) {
    throw new Error(`CFWidget returned ${response.status}`);
  }

  const project = await response.json();
  const count = project?.downloads?.total;

  if (typeof count !== "number") {
    throw new Error("CFWidget response did not include downloads.total");
  }

  return count;
}

async function fetchCountFromPage(
  url: string,
  pattern: RegExp,
): Promise<number> {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const responseText = await response.text();
  const pageText = htmlToText(responseText);

  if (/just a moment/i.test(pageText)) {
    throw new Error("Provider returned an anti-bot challenge page");
  }

  const match = pageText.match(pattern);

  if (!match?.[1]) {
    throw new Error(`Could not find a count with ${pattern}`);
  }

  const count = Number.parseInt(match[1].replaceAll(",", ""), 10);

  if (!Number.isFinite(count)) {
    throw new Error(`Parsed count was not numeric for ${url}`);
  }

  return count;
}

async function fetchWithTimeout(input: RequestInfo | URL): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(input, {
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function cloneProjectDownloadStats(
  projects: ProjectDownloadStatsMap,
): ProjectDownloadStatsMap {
  return Object.fromEntries(
    Object.entries(projects).map(([projectId, project]) => [
      projectId,
      project ? cloneProjectDownloadStat(project) : project,
    ]),
  );
}

function cloneProjectDownloadStat(
  project: ProjectDownloadStat,
): ProjectDownloadStat {
  return {
    ...project,
    sources: project.sources.map((source) => ({ ...source })),
  };
}

function ensureProjectStat(
  projects: ProjectDownloadStatsMap,
  project: ProjectDefinition & { downloads: ProjectDownloadConfig },
): ProjectDownloadStat {
  const existingProject = projects[project.id];

  if (existingProject) {
    return existingProject;
  }

  const nextProject: ProjectDownloadStat = {
    noun: project.downloads.noun,
    total: 0,
    sources: [],
  };

  projects[project.id] = nextProject;
  return nextProject;
}

function upsertSourceCount(
  project: ProjectDownloadStat,
  label: string,
  count: number,
): void {
  const existingSource = project.sources.find(
    (source) => source.label === label,
  );

  if (existingSource) {
    existingSource.count = count;
    return;
  }

  const nextSource: ProjectDownloadSource = {
    label,
    count,
  };

  project.sources.push(nextSource);
}
