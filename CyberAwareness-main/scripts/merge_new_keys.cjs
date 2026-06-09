const fs = require('fs');
const path = require('path');

const enPath = path.resolve(__dirname, '../src/i18n/locales/en/translation.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const newKeys = {
  "hero": {
    "eyebrow": "AI Cyber Intelligence",
    "commandCenter": "Command Center",
    "stayAware": "Stay Aware.",
    "stayProtected": "Stay Protected.",
    "stayInControl": "Stay in Control.",
    "subCopy": "AI-powered threat intelligence that helps you recognize phishing, deepfakes, QR scams, and social engineering — before they reach you. Real awareness. Real protection.",
    "commandCenterBtn": "Enter the Command Center",
    "learnThreatsBtn": "Learn the Threats",
    "indicatorAi": "AI-powered detection",
    "indicatorRadar": "Real-time threat mapping",
    "indicatorHuman": "Human-first awareness",
    "cycleTitle": "The Awareness Cycle",
    "cycleSteps": {
      "detect": "Detect",
      "understand": "Understand",
      "learn": "Learn",
      "protect": "Protect",
      "act": "Act"
    }
  },
  "threatTicker": {
    "title": "Threat Feed",
    "aiMonitor": "AI·Monitor",
    "live": "Live",
    "encrypted": "Encrypted",
    "alerts": {
      "T001": "Deepfake impersonation activity increasing across social platforms",
      "T002": "Phishing links targeting students detected — verify before clicking",
      "T003": "QR payment scam campaign active in metro regions",
      "T004": "AI-generated fraud calls rising — verify caller identity",
      "T005": "Suspicious UPI clone websites detected — use official apps only",
      "T006": "Cyber awareness broadcast active — threat intelligence synchronized",
      "T007": "Credential harvesting attempts detected on education portals",
      "T008": "Malicious APK files circulating via encrypted messaging apps",
      "T009": "Fake job offer campaigns targeting fresh graduates — verify recruiters",
      "T010": "SMS OTP interception vulnerability reported — enable app-based 2FA",
      "T011": "Threat intelligence channels synchronized — all nodes operational",
      "T012": "Romance scam operations using AI-generated profiles detected"
    },
    "levels": {
      "critical": "Critical",
      "high": "High",
      "medium": "Medium",
      "advisory": "Info"
    }
  },
  "coreModules": {
    "launchModule": "LAUNCH MODULE",
    "liveIntelligence": "Live Intelligence",
    "modules": {
      "scam-analyzer": {
        "title": "AI Scam Analyzer",
        "subtitle": "Neural Threat Recognition",
        "description": "Feed suspicious messages, calls, or links into our AI engine. Detects social engineering patterns, urgency manipulation, and impersonation tactics in real time.",
        "statusLabel": "ANALYZING PATTERNS",
        "tags": {
          "tag0": "Social Engineering",
          "tag1": "SMS Fraud",
          "tag2": "Voice Cloning"
        },
        "liveData": {
          "item0": "Voice scam detected — India +91",
          "item1": "SMS phishing blocked",
          "item2": "Credential harvest attempt"
        }
      },
      "url-scanner": {
        "title": "URL Safety Scanner",
        "subtitle": "Link Threat Assessment",
        "description": "Paste any suspicious link for instant deep analysis. Detects typosquatting, malware payloads, phishing pages, fake login portals, and redirect-based deception chains.",
        "statusLabel": "LINK SCANNER",
        "tags": {
          "tag0": "Typosquatting",
          "tag1": "Malware Payload",
          "tag2": "Redirect Chain"
        },
        "liveData": {
          "item0": "Phishing URL detected",
          "item1": "Typosquat identified",
          "item2": "Clean URL — safe"
        }
      },
      "deepfake-lab": {
        "title": "Deepfake Detection Lab",
        "subtitle": "Synthetic Media Analysis",
        "description": "Upload images or video clips. Our multimodal AI identifies facial synthesis artifacts, voice cloning signatures, and AI-generated content used in fraud and disinformation.",
        "statusLabel": "MODEL ACTIVE",
        "tags": {
          "tag0": "Face Swap",
          "tag1": "Voice Synthesis",
          "tag2": "Video Forensics"
        },
        "liveData": {
          "item0": "Deepfake video analyzed",
          "item1": "Synthetic audio confirmed",
          "item2": "Real face — verified"
        }
      },
      "qr-scanner": {
        "title": "QR Scam Scanner",
        "subtitle": "Malicious Code Detection",
        "description": "Scan any QR code before you pay or visit. Our engine decodes hidden redirect chains, UPI manipulation, malware distribution URLs, and payment fraud embedded in QR.",
        "statusLabel": "SCAN READY",
        "tags": {
          "tag0": "UPI Redirect",
          "tag1": "Malware Links",
          "tag2": "Fake Payments"
        },
        "liveData": {
          "item0": "Malicious UPI QR blocked",
          "item1": "Redirect chain exposed",
          "item2": "Safe QR confirmed"
        }
      },
      "phishing-sim": {
        "title": "Phishing Simulator",
        "subtitle": "Awareness Training Engine",
        "description": "Experience simulated phishing attacks in a safe environment. Learn to identify deceptive links, spoofed domains, fake login pages, and urgency-based manipulation tactics.",
        "statusLabel": "SIM ACTIVE",
        "tags": {
          "tag0": "Domain Spoofing",
          "tag1": "Credential Harvest",
          "tag2": "Urgency Baiting"
        },
        "liveData": {
          "item0": "Simulation: bank phish",
          "item1": "User caught fake login",
          "item2": "Awareness score: HIGH"
        }
      },
      "cyber-laws": {
        "title": "Legal AI Command Center",
        "subtitle": "Complaint Intelligence System",
        "description": "Transform cybercrime incident narratives into structured complaints with guided interviews, legal mapping, evidence summaries, and PDF export.",
        "statusLabel": "KNOWLEDGE BASE",
        "tags": {
          "tag0": "IT Act 2000",
          "tag1": "DPDP Bill",
          "tag2": "Cyber Rights"
        },
        "liveData": {
          "item0": "Complaint draft generated",
          "item1": "Legal sections mapped",
          "item2": "PDF export ready"
        }
      },
      "challenges": {
        "title": "Awareness Challenges",
        "subtitle": "Cyber Defense Training",
        "description": "Gamified cyber awareness missions. Identify scam screenshots, decode phishing emails, spot fake websites — build real-world recognition skills through immersive challenges.",
        "statusLabel": "MISSION ACTIVE",
        "tags": {
          "tag0": "Gamified Learning",
          "tag1": "Scam Spotting",
          "tag2": "Security IQ"
        },
        "liveData": {
          "item0": "Challenge: spot the phish",
          "item1": "Level 4 unlocked",
          "item2": "Security IQ improved"
        }
      },
      "reporting": {
        "title": "Reporting Center",
        "subtitle": "Incident Documentation",
        "description": "Structured cyber incident reporting with AI-assisted form completion. Automatically routes reports to CERT-In, Cyber Crime Portal, or RBI Ombudsman based on incident type.",
        "statusLabel": "REPORTS OPEN",
        "tags": {
          "tag0": "CERT-In",
          "tag1": "Cyber Crime Portal",
          "tag2": "RBI Ombudsman"
        },
        "liveData": {
          "item0": "Report filed to CERT-In",
          "item1": "Case number generated",
          "item2": "Escalation triggered"
        }
      },
      "upi-fraud": {
        "title": "UPI Fraud Awareness",
        "subtitle": "Payment Safety Intelligence",
        "description": "Understand how UPI scams operate — collect requests, screen share fraud, fake payment screenshots, and merchant impersonation. Interactive fraud map of common attack patterns.",
        "statusLabel": "FRAUD MAP LIVE",
        "tags": {
          "tag0": "Collect Scams",
          "tag1": "Screen Fraud",
          "tag2": "Fake Screenshots"
        },
        "liveData": {
          "item0": "Collect request scam wave",
          "item1": "New screen share attack",
          "item2": "Fake receipt pattern"
        }
      },
      "ip-scanner": {
        "title": "IP Intelligence Scanner",
        "subtitle": "Network Origin Analysis",
        "description": "Analyze IP addresses for threat reputation, geolocation, hosting provider, and blacklist status. Understand if a caller, website, or sender originates from known threat infrastructure.",
        "statusLabel": "SCANNER ONLINE",
        "tags": {
          "tag0": "Reputation Check",
          "tag1": "Blacklist Status",
          "tag2": "Geo Trace"
        },
        "liveData": {
          "item0": "IP blacklisted — flagged",
          "item1": "VPN origin detected",
          "item2": "Clean IP — verified"
        }
      },
      "threat-feed": {
        "title": "Live Threat Feed",
        "subtitle": "Global Cyber Intelligence",
        "description": "Real-time aggregation of emerging scam campaigns, ransomware spreads, and social fraud vectors from public threat intelligence sources across India and globally.",
        "statusLabel": "LIVE MONITORING",
        "tags": {
          "tag0": "Ransomware Alerts",
          "tag1": "Scam Campaigns",
          "tag2": "Dark Web Signals"
        },
        "liveData": {
          "item0": "New OTP scam wave detected",
          "item1": "Govt impersonation surge",
          "item2": "Banking fraud pattern flagged"
        }
      },
      "scam-library": {
        "title": "Scam Intelligence Archive",
        "subtitle": "Fraud Pattern Database",
        "description": "Comprehensive classified archive of documented scams, fraud schemes, and deception patterns. Search historical scam campaigns, analyze fraud tactics, and explore indexed threat intelligence from India's cyber threat landscape.",
        "statusLabel": "ARCHIVE INDEXED",
        "tags": {
          "tag0": "Fraud Patterns",
          "tag1": "Scam History",
          "tag2": "Threat Intelligence"
        },
        "liveData": {
          "item0": "Archive entries: 2,400+",
          "item1": "Scam patterns categorized",
          "item2": "Fraud threats mapped"
        }
      }
    }
  },
  "dashboardPreview": {
    "sectionLabel": "COMMAND CENTER · LIVE ENVIRONMENT",
    "title": "AI INTELLIGENCE",
    "titleColored": "OPERATIONS CORE",
    "subtitle": "Real-time threat intelligence combined with personalized guidance for every type of user.",
    "panels": {
      "threatRadar": {
        "title": "THREAT RADAR",
        "badge": "GLOBAL"
      },
      "urlScanner": {
        "title": "URL SAFETY SCANNER",
        "badge": "LINK DEFENSE"
      },
      "aiLinkScanner": {
        "title": "AI LINK SCANNER",
        "badge": "GPT-VERIFIED"
      },
      "neuralNet": {
        "title": "AI THREAT NEURAL NET",
        "badge": "LIVE INFERENCE"
      },
      "protectionIntel": {
        "title": "PROTECTION INTELLIGENCE",
        "badge": "INDIA·2025"
      },
      "deepfakeDetector": {
        "title": "DEEPFAKE DETECTOR",
        "badge": "AI VISION"
      },
      "dataSignalFeed": {
        "title": "DATA SIGNAL FEED",
        "badge": "LIVE"
      },
      "qrFraudAnalysis": {
        "title": "QR FRAUD ANALYSIS",
        "badge": "LIVE"
      }
    },
    "legend": {
      "critical": "Critical",
      "high": "High",
      "monitoring": "Monitoring",
      "resolved": "Resolved"
    },
    "accuracy": "Accuracy",
    "latency": "Latency",
    "threats": "Threats",
    "recentScans": "Recent scans",
    "manipulationScore": "Manipulation Score",
    "highManipulation": "⚠ HIGH MANIPULATION DETECTED",
    "lowRisk": "✓ LOW RISK — AUTHENTIC",
    "alerts": {
      "title": "◉ ALERT",
      "list": [
        "⚠ NEW PHISHING WAVE TARGETING UPI USERS IN MH/KA REGION",
        "🔴 DEEPFAKE VIDEO CIRCULATING — PM IMPERSONATION CONFIRMED",
        "⚡ AI SCANNER BLOCKED 18,432 MALICIOUS LINKS IN LAST HOUR",
        "🟡 QR CODE FRAUD SPIKE DETECTED — METRO CITIES AT RISK",
        "🛡 CYBER LAW UPDATE: IT ACT AMENDMENT 2025 NOW IN EFFECT",
        "🤖 VOICE CLONE SCAM WAVE REPORTED ACROSS BANKING SECTOR"
      ]
    },
    "streamActive": "█ STREAM ACTIVE · 4.2 TB/s · ENCRYPTED",
    "deltaWeek": "this week",
    "scanners": {
      "scanning": "SCANNING...",
      "complete": "ANALYSIS COMPLETE"
    }
  },
  "threatBanner": {
    "live": "Live",
    "critical": "Critical",
    "threatIntel": "Threat Intel",
    "paused": "PAUSED",
    "alerts": {
      "T001": "QR payment scam activity rising — verify before scanning",
      "T002": "Deepfake impersonation attempts detected across social platforms",
      "T003": "Phishing campaigns targeting college students — stay alert",
      "T004": "Fraudulent UPI payment links spreading via WhatsApp",
      "T005": "AI-generated scam calls impersonating bank officials increasing",
      "T006": "Fake investment app scheme flagged — do not download",
      "T007": "SMS phishing surge targeting Aadhaar-linked accounts",
      "T008": "Social engineering playbook variant detected in the wild",
      "T009": "Lottery scam wave active — awareness broadcast in progress",
      "T010": "Malicious PDF attachments posing as government notices",
      "T011": "Romance scam vector expanding on dating platforms",
      "T012": "Cyber awareness alert — verify sources before sharing links"
    }
  },
  "footer": {
    "branding": "CYBER AWARE",
    "brandTagline": "Cyber awareness is digital self-defense.",
    "brandSubtitle": "AI-powered public cyber safety — free, open, and built for everyone.",
    "emergencyTitle": "Emergency Resources",
    "modulesTitle": "Protection Modules",
    "awarenessTitle": "Awareness & Help",
    "copyright": "Stay aware · Stay protected · Threat intelligence for everyone",
    "version": "CYBERAWARE · PUBLIC SAFETY PLATFORM · v2.0",
    "statuses": {
      "threatFeed": "Threat Feed",
      "aiEngine": "AI Engine",
      "scamMonitor": "Scam Monitor"
    }
  }
};

// Deep merge utility
function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], merge(target[key], source[key]));
    }
  }
  Object.assign(target, source);
  return target;
}

merge(en, newKeys);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8');
console.log('Successfully merged new keys into en/translation.json');
