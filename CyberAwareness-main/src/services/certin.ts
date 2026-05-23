// CERT-In Cyber Alerts Integration Service

interface CertInAlert {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  affectedSystems: string[];
  cvssScore?: number;
  tags?: string[];
}

interface CertInResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

class CertInService {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = 'https://api.cert-in.org', timeout: number = 5000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async fetchWithTimeout<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getAlerts(filter?: { severity?: string; days?: number }): Promise<CertInResponse<CertInAlert[]>> {
    try {
      const params = new URLSearchParams();
      if (filter?.severity) params.append('severity', filter.severity);
      if (filter?.days) params.append('days', filter.days.toString());

      const url = `${this.baseUrl}/alerts?${params.toString()}`;
      const alerts = await this.fetchWithTimeout<CertInAlert[]>(url);

      return {
        success: true,
        data: alerts,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getAlertById(id: string): Promise<CertInResponse<CertInAlert>> {
    try {
      const url = `${this.baseUrl}/alerts/${id}`;
      const alert = await this.fetchWithTimeout<CertInAlert>(url);

      return {
        success: true,
        data: alert,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  formatAlertForDisplay(alert: CertInAlert): string {
    const severity = alert.severity === 'CRITICAL' ? '🔴' : 
                     alert.severity === 'HIGH' ? '🟠' : 
                     alert.severity === 'MEDIUM' ? '🟡' : '🟢';

    return `${severity} [${alert.severity}] ${alert.title}\nDate: ${alert.date}\nSystems: ${alert.affectedSystems.join(', ')}`;
  }

  filterAlertsBySeverity(alerts: CertInAlert[], severity: string): CertInAlert[] {
    return alerts.filter(alert => alert.severity === severity);
  }

  sortAlertsByDate(alerts: CertInAlert[], descending: boolean = true): CertInAlert[] {
    return [...alerts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return descending ? dateB - dateA : dateA - dateB;
    });
  }
}

export { CertInService, CertInAlert, CertInResponse };
export default new CertInService();
