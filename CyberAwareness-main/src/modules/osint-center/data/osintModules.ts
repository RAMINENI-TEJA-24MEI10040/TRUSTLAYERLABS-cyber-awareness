import { OsintModule } from "../types/osint.types";

export const osintModules: OsintModule[] = [
  {
    id: "mobile",
    title: "Mobile Intelligence",
    description: "Lookup phone numbers and metadata",
    icon: "📱",
    status: "active"
  },
  {
    id: "email",
    title: "Email Intelligence",
    description: "Email reputation and breach analysis",
    icon: "📧",
    status: "active"
  },
  {
    id: "username",
    title: "Username Search",
    description: "Cross-platform username intelligence",
    icon: "👤",
    status: "active"
  },
  {
    id: "domain",
    title: "Domain & WHOIS",
    description: "Domain ownership intelligence",
    icon: "🌐",
    status: "active"
  },
  {
    id: "ip",
    title: "IP Intelligence",
    description: "IP geolocation and threat analysis",
    icon: "🛰️",
    status: "active"
  },
  {
    id: "breach",
    title: "Data Breach Exposure",
    description: "Compromised account detection",
    icon: "⚠️",
    status: "active"
  },
  {
    id: "url",
    title: "URL Reputation",
    description: "Malicious URL analysis",
    icon: "🔗",
    status: "active"
  },
  {
    id: "wallet",
    title: "Crypto Wallet Intel",
    description: "Blockchain wallet investigation",
    icon: "₿",
    status: "coming-soon"
  },
  {
    id: "reverse-image",
    title: "Reverse Image Search",
    description: "Image source investigation",
    icon: "🖼️",
    status: "coming-soon"
  },
  {
    id: "geo",
    title: "Geo Intelligence",
    description: "Map and location intelligence",
    icon: "📍",
    status: "coming-soon"
  }
];