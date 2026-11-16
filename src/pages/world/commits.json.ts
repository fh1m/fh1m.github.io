// The commit sky, served as a static file so the persistent world can fetch it on any page.
import commits from "../../data/commits.json";
export const GET = () => new Response(JSON.stringify({ projects: Object.fromEntries(Object.entries(commits.projects).map(([k, p]) => [k, { repo: p.repo, commits: p.commits }])) }), { headers: { "content-type": "application/json" } });
