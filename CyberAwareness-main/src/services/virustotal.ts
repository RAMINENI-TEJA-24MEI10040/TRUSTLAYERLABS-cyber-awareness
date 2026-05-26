const API_KEY =
  import.meta.env
    .VITE_VIRUSTOTAL_API_KEY;

const BASE_URL =
  "https://www.virustotal.com/api/v3";

export interface VirusTotalResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  reputation: number;
}

export async function scanUrl(
  url: string
): Promise<VirusTotalResult> {
  try {
    const encodedUrl = btoa(url)
      .replace(/=/g, "");

    const response =
      await fetch(
        `${BASE_URL}/urls/${encodedUrl}`,
        {
          method: "GET",
          headers: {
            "x-apikey": API_KEY,
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        "VirusTotal API Error"
      );
    }

    const data =
      await response.json();

    const stats =
      data?.data?.attributes
        ?.last_analysis_stats;

    return {
      malicious:
        stats?.malicious || 0,

      suspicious:
        stats?.suspicious || 0,

      harmless:
        stats?.harmless || 0,

      undetected:
        stats?.undetected || 0,

      reputation:
        data?.data?.attributes
          ?.reputation || 0,
    };
  } catch (error) {
    console.error(error);

    return {
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      reputation: 0,
    };
  }
}