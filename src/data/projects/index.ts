import type {
  DomainProjects,
  ProjectDefinition,
  ProjectDomainDefinition,
} from "../../types/content";

type DomainAccumulator = {
  meta: ProjectDomainDefinition | null;
  projects: ProjectDefinition[];
};

const projectFiles = import.meta.glob("./**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const domainAccumulators = new Map<string, DomainAccumulator>();

for (const [path, rawFile] of Object.entries(projectFiles)) {
  const pathMatch = path.match(/^\.\/([^/]+)\/([^/]+)\.json$/);

  if (!pathMatch) {
    continue;
  }

  const domainSlug = pathMatch[1];
  const fileName = pathMatch[2];

  if (!domainSlug || !fileName) {
    continue;
  }

  const accumulator = domainAccumulators.get(domainSlug) ?? {
    meta: null,
    projects: [],
  };

  if (fileName === "_domain") {
    accumulator.meta = rawFile as ProjectDomainDefinition;
  } else {
    accumulator.projects.push(rawFile as ProjectDefinition);
  }

  domainAccumulators.set(domainSlug, accumulator);
}

const orderedDomains = [...domainAccumulators.entries()]
  .map(([domainSlug, accumulator]) => {
    if (!accumulator.meta) {
      throw new Error(`Missing domain metadata for ${domainSlug}`);
    }

    return {
      slug: domainSlug,
      meta: accumulator.meta,
      projects: accumulator.projects.sort(compareOrderedItems),
    };
  })
  .sort((left, right) => compareOrderedItems(left.meta, right.meta));

export const domainProjects: DomainProjects = Object.fromEntries(
  orderedDomains.map(({ meta, projects }) => [
    meta.name,
    {
      note: meta.note,
      projects,
    },
  ]),
);

export const domainNames = orderedDomains.map(({ meta }) => meta.name) as Array<
  keyof typeof domainProjects
>;

export const allProjects = orderedDomains.flatMap(({ projects }) => projects);

function compareOrderedItems(
  left: { order?: number; title?: string; name?: string },
  right: { order?: number; title?: string; name?: string },
): number {
  const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const leftLabel = left.title ?? left.name ?? "";
  const rightLabel = right.title ?? right.name ?? "";

  return leftLabel.localeCompare(rightLabel);
}
