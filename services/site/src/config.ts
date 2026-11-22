/**
 * Application-wide constants and configuration
 */
export const config = {
  consoleMarketingEnabled: import.meta.env.VITE_CONSOLE_MARKETING_ENABLED === "true",

  // Base URL
  baseUrl: "https://xccode.ai",

  // GitHub
  github: {
    repoUrl: "https://github.com/xiaowei56/xccode",
    starsFormatted: {
      compact: "220K",
      full: "220,000",
    },
  },

  // Social links
  social: {
    twitter: "https://x.com/xccode",
    discord: "https://discord.gg/xccode",
  },

  // Static stats (used on landing page)
  stats: {
    contributors: "1,000+",
    contributorsCompact: "1K+",
    commits: "20,000",
    monthlyUsers: "22M",
  },
} as const
