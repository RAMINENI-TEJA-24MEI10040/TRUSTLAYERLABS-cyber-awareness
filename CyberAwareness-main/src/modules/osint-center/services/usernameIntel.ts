import { IntelligenceResult } from '../types/ciw.types';

interface GitHubUser {
  login: string;
  name?: string;
  bio?: string;
  followers?: number;
  public_repos?: number;
  html_url?: string;
  location?: string;
  blog?: string;
  [key: string]: unknown;
}

interface RedditUser {
  data: {
    name?: string;
    total_karma?: number;
    created_utc?: number;
    has_verified_email?: boolean;
    subreddit?: { title?: string; public_description?: string };
  };
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_TIMEOUT = 8000;

function withTimeout<T>(promise: Promise<T>, timeout = DEFAULT_TIMEOUT): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), timeout);
    promise.then((value) => {
      clearTimeout(id);
      resolve(value);
    }).catch((err) => {
      clearTimeout(id);
      reject(err);
    });
  });
}

async function fetchGitHubProfile(username: string): Promise<IntelligenceResult | null> {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
  const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `token ${token}`;

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
  if (!res.ok) {
    if (res.status !== 404) console.warn(`GitHub API returned ${res.status} for ${username}`);
    return null;
  }

  const data = (await res.json()) as GitHubUser;
  if (!data.login) return null;

  const followers = Number(data.followers ?? 0);
  const publicRepos = Number(data.public_repos ?? 0);
  const rawScore = Math.min(100, Math.round(Math.min(1000, followers * 1.5 + publicRepos * 2) / 10));

  return {
    id: makeId('username'),
    queryId: makeId('q'),
    source: 'username',
    title: `GitHub: ${data.login}`,
    summary: data.bio ?? data.name ?? `Found GitHub profile for ${data.login}`,
    score: rawScore,
    meta: [
      {
        sourceName: 'github',
        fetchedAt: new Date().toISOString(),
        raw: data,
      },
    ],
  };
}

async function fetchRedditProfile(username: string): Promise<IntelligenceResult | null> {
  try {
    const res = await fetch(`https://www.reddit.com/user/${encodeURIComponent(username)}/about.json`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RedditUser;
    if (!data?.data?.name) return null;

    const score = Math.min(100, Math.round(Number(data.data.total_karma ?? 0) / 10));
    const createdAt = data.data.created_utc ? new Date(data.data.created_utc * 1000) : undefined;
    const accountAge = createdAt ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : undefined;

    return {
      id: makeId('username'),
      queryId: makeId('q'),
      source: 'username',
      title: `Reddit: u/${data.data.name}`,
      summary: data.data.subreddit?.public_description ?? `Reddit profile found for ${data.data.name}`,
      score,
      meta: [
        {
          sourceName: 'reddit',
          fetchedAt: new Date().toISOString(),
          raw: { ...data, accountAge },
        },
      ],
    };
  } catch (error) {
    console.warn('usernameIntel.fetchRedditProfile failed', error);
    return null;
  }
}

async function fetchKeybaseProfile(username: string): Promise<IntelligenceResult | null> {
  try {
    const res = await fetch(
      `https://keybase.io/api/1.0/user/lookup?username=${encodeURIComponent(username)}`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return null;
    const data = await res.json() as { them?: { username: string; profile?: { full_name?: string }; created_at?: number; pgp_keys?: unknown[] } };
    if (!data?.them?.username) return null;

    const createdAt = data.them.created_at ? new Date(data.them.created_at * 1000) : undefined;
    const accountAge = createdAt ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    const pgpKeyCount = Array.isArray(data.them.pgp_keys) ? data.them.pgp_keys.length : 0;
    const score = Math.min(100, 40 + (pgpKeyCount * 15));

    return {
      id: makeId('username'),
      queryId: makeId('q'),
      source: 'username',
      title: `Keybase: ${data.them.username}`,
      summary: data.them.profile?.full_name ?? `Keybase profile found for ${data.them.username}`,
      score,
      meta: [
        {
          sourceName: 'keybase',
          fetchedAt: new Date().toISOString(),
          raw: { ...data.them, accountAge, pgpKeyCount },
        },
      ],
    };
  } catch (error) {
    console.warn('usernameIntel.fetchKeybaseProfile failed', error);
    return null;
  }
}

async function fetchMastodonProfile(username: string): Promise<IntelligenceResult | null> {
  const instances = ['mastodon.social', 'fosstodon.org', 'techhub.social', 'pixelfed.social', 'mas.to'];

  for (const instance of instances) {
    try {
      const res = await fetch(
        `https://${instance}/api/v1/accounts/search?q=${encodeURIComponent(username)}&limit=1`,
        { headers: { Accept: 'application/json' } }
      );
      if (!res.ok) continue;

      const data = await res.json() as Array<{
        username: string;
        display_name?: string;
        url: string;
        created_at: string;
        followers_count: number;
        following_count: number;
        statuses_count: number;
      }>;
      if (!data?.[0]?.username) continue;

      const userData = data[0];
      const createdAt = new Date(userData.created_at);
      const accountAge = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      const score = Math.min(100, 30 + (userData.followers_count * 0.5) + (userData.statuses_count * 0.2));

      return {
        id: makeId('username'),
        queryId: makeId('q'),
        source: 'username',
        title: `Mastodon: ${userData.username}@${instance}`,
        summary: userData.display_name ?? `Mastodon profile found on ${instance}`,
        score,
        meta: [
          {
            sourceName: 'mastodon',
            fetchedAt: new Date().toISOString(),
            raw: { ...userData, instance, accountAge },
          },
        ],
      };
    } catch {
      continue;
    }
  }

  return null;
}

async function fetchTwitterProfile(username: string): Promise<IntelligenceResult | null> {
  try {
    const response = await fetch(`https://twitter.com/${encodeURIComponent(username)}`, {
      headers: { Accept: 'text/html' },
    });
    if (!response.ok) return null;
    const html = await response.text();
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
    const title = titleMatch?.[1]?.trim() ?? `Twitter profile: ${username}`;
    const description = descriptionMatch?.[1]?.trim() ?? 'Twitter profile discovered';

    return {
      id: makeId('username'),
      queryId: makeId('q'),
      source: 'username',
      title,
      summary: description,
      score: 20,
      meta: [
        {
          sourceName: 'twitter',
          fetchedAt: new Date().toISOString(),
          raw: {
            username,
            title,
            description,
          },
        },
      ],
    };
  } catch (error) {
    console.warn('usernameIntel.fetchTwitterProfile failed', error);
    return null;
  }
}

export async function lookup(payload: string): Promise<IntelligenceResult[]> {
  const results: IntelligenceResult[] = [];
  const username = payload.trim();
  if (!username) return results;

  const tasks = [
    withTimeout(fetchGitHubProfile(username)),
    withTimeout(fetchRedditProfile(username)),
    withTimeout(fetchTwitterProfile(username)),
    withTimeout(fetchKeybaseProfile(username)),
    withTimeout(fetchMastodonProfile(username)),
  ];

  const settled = await Promise.allSettled(tasks);
  settled.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      results.push(result.value);
    }
  });

  return results;
}
