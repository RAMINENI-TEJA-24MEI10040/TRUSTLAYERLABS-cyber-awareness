export interface ThreatItem {
  title: string;
  severity: string;
  source: string;
  type: string;
}

export async function getLiveThreats(): Promise<ThreatItem[]> {

  try {

    // CORS-safe proxy
    const response = await fetch(
      "https://corsproxy.io/?https://openphish.com/feed.txt"
    );

    const text =
      await response.text();

    const urls = text
      .split("\n")
      .filter(Boolean)
      .slice(0, 8);

    const threats: ThreatItem[] =
      urls.map((url) => ({

        title:
          url.length > 70
            ? url.slice(0, 70) + "..."
            : url,

        severity: "HIGH",

        source: "OpenPhish",

        type: "Phishing",
      }));

    return threats;

  } catch (error) {

    console.error(
      "Threat Feed Error:",
      error
    );

    return [];
  }
}