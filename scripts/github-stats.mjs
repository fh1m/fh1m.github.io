// Build-time GitHub stats. Run before `astro build` (CI does it daily).
// Writes src/data/github.json. Nothing on the site hardcodes these numbers.
//
// Uses `gh api graphql`: GITHUB_TOKEN (CI) or the existing gh login (local).
// If the API is unreachable, the previous file is kept and the build goes on;
// the page shows the timestamp of the data it actually has.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const OUT = new URL("../src/data/github.json", import.meta.url);
const LOGIN = "fh1m";


const query = `query($login: String!, $after: String) {
  user(login: $login) {
    createdAt
    followers { totalCount }
    contributionsCollection {
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
    }
    repositories(first: 100, after: $after, privacy: PUBLIC, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      pageInfo { hasNextPage endCursor }
      nodes {
        name description url isFork isArchived stargazerCount forkCount pushedAt createdAt
        primaryLanguage { name color }
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } }
        repositoryTopics(first: 10) { nodes { topic { name } } }
        defaultBranchRef { target { ... on Commit { history { totalCount } } } }
      }
    }
  }
}`;

async function gql(variables) {
  const body = JSON.parse(execFileSync("gh", ["api", "graphql", "--input", "-"], {
    input: JSON.stringify({ query, variables }), encoding: "utf8", maxBuffer: 8 * 1024 * 1024,
  }));
  if (body.errors) throw new Error(body.errors.map((e) => e.message).join("; "));
  return body.data.user;
}

async function main() {
  let after = null, user, repos = [];
  do {
    user = await gql({ login: LOGIN, after });
    repos.push(...user.repositories.nodes);
    after = user.repositories.pageInfo.hasNextPage ? user.repositories.pageInfo.endCursor : null;
  } while (after);

  const own = repos.filter((r) => !r.isFork);
  const langBytes = {};
  for (const r of own) for (const e of r.languages.edges) {
    langBytes[e.node.name] ??= { bytes: 0, color: e.node.color };
    langBytes[e.node.name].bytes += e.size;
  }
  const total = Object.values(langBytes).reduce((s, l) => s + l.bytes, 0);
  const languages = Object.entries(langBytes)
    .map(([name, l]) => ({ name, color: l.color, bytes: l.bytes, share: l.bytes / total }))
    .sort((a, b) => b.bytes - a.bytes);

  const cc = user.contributionsCollection;
  const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays).map((d) => [d.date, d.contributionCount]);
  const now = new Date();
  const data = {
    generatedAt: now.toISOString(),
    generatedAtLabel: now.toISOString().slice(0, 10),
    login: LOGIN,
    since: user.createdAt.slice(0, 10),
    followers: user.followers.totalCount,
    publicRepos: user.repositories.totalCount,
    ownRepos: own.length,
    archivedRepos: own.filter((r) => r.isArchived).length,
    totalStars: own.reduce((s, r) => s + r.stargazerCount, 0),
    contributionsLastYear: cc.contributionCalendar.totalContributions,
    commitsLastYear: cc.totalCommitContributions,
    privateContributionsLastYear: cc.restrictedContributionsCount,
    busiestDay: days.reduce((m, d) => (d[1] > m[1] ? d : m), ["", 0]),
    days,
    languages,
    repos: repos.map((r) => ({
      name: r.name, description: r.description, url: r.url, archived: r.isArchived, isFork: r.isFork,
      stars: r.stargazerCount, forks: r.forkCount, pushedAt: r.pushedAt, createdAt: r.createdAt,
      language: r.primaryLanguage?.name ?? null, color: r.primaryLanguage?.color ?? null,
      topics: r.repositoryTopics.nodes.map((t) => t.topic.name),
      commits: r.defaultBranchRef?.target?.history?.totalCount ?? 0,
    })),
  };
  writeFileSync(OUT, JSON.stringify(data, null, 1) + "\n");
  console.log(`github.json: ${data.publicRepos} repos, ${data.contributionsLastYear} contributions, generated ${data.generatedAt}`);
}

main().catch((err) => {
  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, "utf8"));
    console.warn(`github-stats: ${err.message}. Keeping data from ${prev.generatedAt}.`);
  } else {
    console.error(`github-stats: ${err.message}, and no previous data exists.`);
    process.exit(1);
  }
});
