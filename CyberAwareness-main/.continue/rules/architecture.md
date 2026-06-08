# Architecture Rules

Search existing code before creating files.

Priority reusable services:

- src/services/hibp.ts
- src/services/virustotal.ts
- src/services/abuseipdb.ts

Priority reusable modules:

- src/modules/cyber-justice-ai
- src/pages/ip-scanner
- src/pages/url-scanner
- src/pages/breach-checker
- src/pages/cyber-crime-locator

Never duplicate scanner logic.

Reuse existing implementations whenever possible.