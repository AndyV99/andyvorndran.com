import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectsRootPath = fileURLToPath(
  new URL("../src/data/projects", import.meta.url),
);

const requestHeaders = {
  "user-agent": "andyvorndran.com project stats refresh",
  accept: "application/json, text/html;q=0.9,*/*;q=0.8",
};

const maxLoggedResponseLength = 12_000;

async function refreshProjectStats() {
  const projectFilePaths = await findProjectFilePaths(projectsRootPath);
  let refreshedSourceCount = 0;
  let refreshedProjectCount = 0;

  for (const projectFilePath of projectFilePaths) {
    const existingProject = JSON.parse(await readFile(projectFilePath, "utf8"));

    if (!existingProject.downloads?.sources?.length) {
      continue;
    }

    const nextSources = [];

    for (const source of existingProject.downloads.sources) {
      try {
        const count = await fetchProjectSourceCount(source);
        const previousCount = getPreviousSourceCount(
          existingProject.downloads.stat,
          source.label,
        );

        nextSources.push({
          label: source.label,
          count,
        });
        refreshedSourceCount += 1;

        console.log(
          `[project-downloads] ${existingProject.title} ${source.label}: ${formatCountForLog(previousCount)} -> ${count}`,
        );
      } catch (error) {
        const fallbackCount = getPreviousSourceCount(
          existingProject.downloads.stat,
          source.label,
        );

        if (fallbackCount === null) {
          console.warn(
            `[project-downloads] ${existingProject.title} ${source.label}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          continue;
        }

        console.warn(
          `[project-downloads] ${existingProject.title} ${source.label}: ${
            error instanceof Error ? error.message : String(error)
          }. Using cached count ${fallbackCount}.`,
        );

        nextSources.push({
          label: source.label,
          count: fallbackCount,
        });
      }
    }

    const existingStat = existingProject.downloads.stat;

    if (nextSources.length === 0 && !existingStat) {
      continue;
    }

    const nextProject = {
      ...existingProject,
      downloads: {
        ...existingProject.downloads,
        stat: {
          noun: existingProject.downloads.noun,
          total: nextSources.reduce((sum, source) => sum + source.count, 0),
          sources: nextSources,
        },
      },
    };

    await writeFile(
      projectFilePath,
      `${JSON.stringify(nextProject, null, 2)}\n`,
      "utf8",
    );
    refreshedProjectCount += 1;
  }

  console.log(
    `[project-downloads] Refreshed ${refreshedSourceCount} sources across ${refreshedProjectCount} project files in ${projectsRootPath}`,
  );
}

async function findProjectFilePaths(directoryPath) {
  const directoryEntries = await readdir(directoryPath, { withFileTypes: true });
  const discoveredPaths = [];

  for (const entry of directoryEntries) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      discoveredPaths.push(...(await findProjectFilePaths(entryPath)));
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      basename(entry.name) !== "_domain.json"
    ) {
      discoveredPaths.push(entryPath);
    }
  }

  return discoveredPaths;
}

async function fetchProjectSourceCount(source) {
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
      throw new Error(`Unsupported download provider: ${JSON.stringify(source)}`);
  }
}

async function fetchCurseForgeWidgetDownloadCount(projectId) {
  const response = await fetch(`https://api.cfwidget.com/${projectId}`, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(10_000),
  });
  const responseBody = await response.text();

  if (!response.ok) {
    logResponseBody("CFWidget request failed", response, responseBody);
    throw new Error(`CFWidget returned ${response.status}`);
  }

  let project;

  try {
    project = JSON.parse(responseBody);
  } catch (error) {
    logResponseBody("CFWidget returned invalid JSON", response, responseBody);
    throw new Error(
      `CFWidget returned invalid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  const count = project?.downloads?.total;

  if (typeof count !== "number") {
    logResponseBody(
      "CFWidget response was missing a numeric downloads.total field",
      response,
      responseBody,
    );
    throw new Error("CFWidget response did not include downloads.total");
  }

  return count;
}

async function fetchModrinthDownloadCount(projectSlug) {
  const response = await fetch(
    `https://api.modrinth.com/v2/project/${projectSlug}`,
    {
      headers: requestHeaders,
      signal: AbortSignal.timeout(10_000),
    },
  );

  const responseBody = await response.text();

  if (!response.ok) {
    logResponseBody("Modrinth API request failed", response, responseBody);
    throw new Error(`Modrinth API returned ${response.status}`);
  }

  let project;

  try {
    project = JSON.parse(responseBody);
  } catch (error) {
    logResponseBody("Modrinth API returned invalid JSON", response, responseBody);
    throw new Error(
      `Modrinth API returned invalid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (typeof project.downloads !== "number") {
    logResponseBody(
      "Modrinth API response was missing a numeric downloads field",
      response,
      responseBody,
    );
    throw new Error("Modrinth downloads were missing from the API response");
  }

  return project.downloads;
}

async function fetchCountFromPage(url, pattern) {
  const response = await fetch(url, {
    headers: requestHeaders,
    signal: AbortSignal.timeout(10_000),
  });
  const responseBody = await response.text();

  if (!response.ok) {
    logResponseBody(`Request failed for ${url}`, response, responseBody);
    throw new Error(`Request failed with status ${response.status}`);
  }

  const pageText = htmlToText(responseBody);
  const match = pageText.match(pattern);

  if (!match?.[1]) {
    logResponseBody(
      `Could not find count pattern ${pattern} for ${url}`,
      response,
      responseBody,
    );
    throw new Error(`Could not find a count with ${pattern}`);
  }

  const count = Number.parseInt(match[1].replaceAll(",", ""), 10);

  if (!Number.isFinite(count)) {
    throw new Error(`Parsed count was not numeric for ${url}`);
  }

  return count;
}

function htmlToText(html) {
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

function logResponseBody(message, response, responseBody) {
  const contentType = response.headers.get("content-type") ?? "unknown";
  const prettyBody = formatResponseBody(responseBody, contentType);

  console.error(
    [
      `[project-downloads] ${message}`,
      `status: ${response.status} ${response.statusText}`,
      `content-type: ${contentType}`,
      "response body:",
      prettyBody,
    ].join("\n"),
  );
}

function formatResponseBody(responseBody, contentType) {
  if (!responseBody) {
    return "(empty response body)";
  }

  let formattedBody = responseBody;

  if (contentType.includes("application/json")) {
    try {
      formattedBody = JSON.stringify(JSON.parse(responseBody), null, 2);
    } catch {
      formattedBody = responseBody;
    }
  } else if (contentType.includes("text/html")) {
    formattedBody = responseBody
      .replace(/></g, ">\n<")
      .replace(/\n{3,}/g, "\n\n");
  }

  if (formattedBody.length <= maxLoggedResponseLength) {
    return formattedBody;
  }

  return `${formattedBody.slice(0, maxLoggedResponseLength)}\n... [truncated]`;
}

function getPreviousSourceCount(existingStat, sourceLabel) {
  if (!existingStat?.sources) {
    return null;
  }

  const previousSource = existingStat.sources.find(
    (source) => source.label === sourceLabel,
  );

  return typeof previousSource?.count === "number"
    ? previousSource.count
    : null;
}

function formatCountForLog(count) {
  return count === null ? "no cached count" : `${count}`;
}

refreshProjectStats().catch((error) => {
  console.error(
    `[project-downloads] Failed to refresh download stats: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
  process.exitCode = 1;
});
