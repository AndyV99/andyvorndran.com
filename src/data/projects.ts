import type { DomainProjects } from "../types/content";

export const domainProjects: DomainProjects = {
  "Web Apps & Websites": {
    projects: [
      {
        title: "Portfolio Site",
        description:
          "The site you're currently on!  Made to show off my projects and development philosiphies, as well as some fun front-end tricks.",
        stack: "React, TypeScript, Supabase",
        links: [
          {
            url: "https://github.com/andyv/budget-dashboard",
            icon: "github",
          },
          {
            url: "https://andyvorndran.com",
            icon: "external",
          },
        ],
      },
    ],
  },
  "Minecraft Modding": {
    note: "These projects are published under the alias 'ppVon' to keep my anonymity in this space.",
    projects: [
      {
        title: "Ultimate Cobblemon Progression",
        description:
          "An addon mod for Cobblemon that adds a progression system that limits level caps and spawns depending on game progression.  This project is published to multiple platforms via Github Actions.",
        stack: "Java, Fabric, Neoforge, Architectury",
        links: [
          {
            url: "https://modrinth.com/mod/ultimate-cobblemon-progression",
            icon: "external",
          },
          {
            url: "https://github.com/ppvon/ultimate-cobblemon-progression",
            icon: "github",
          },
        ],
      },
      {
        title: "Ultimate Cobblemon Progression Config Helper",
        description:
          "A website to help configure the mod listed above and its level curves and weight scaling for Cobblemon spawns.  Built and published to Cloudflare Pages via Github Actions",
        stack: "React, Typescript",
        links: [
          {
            url: "https://ucp-config-helper.pages.dev/",
            icon: "external",
          },
          {
            url: "https://github.com/ppVon/ucp-config-helper",
            icon: "github",
          },
        ],
      },
    ],
  },
};

export const domainNames = Object.keys(domainProjects) as Array<
  keyof typeof domainProjects
>;
