# TRUSTLAYERLABS Cyber Awareness Platform
## Production-Grade Architecture Blueprint v2.0
##work for upcoming days
> *India's AI-Powered Cyber Awareness & Legal Intelligence Ecosystem*

---

## Table of Contents

1. [Architecture Philosophy](#1-architecture-philosophy)
2. [Scalable Folder Structure](#2-scalable-folder-structure)
3. [Module Dependency Map](#3-module-dependency-map)
4. [AI Assistant Architecture](#4-ai-assistant-architecture)
5. [RAG Architecture](#5-rag-architecture)
6. [Multilingual Architecture (22 Languages)](#6-multilingual-architecture-22-languages)
7. [Scam Intelligence Database Architecture](#7-scam-intelligence-database-architecture)
8. [Cyber Law Intelligence Engine](#8-cyber-law-intelligence-engine)
9. [Backend Proxy & API Architecture](#9-backend-proxy--api-architecture)
10. [Reusable Component System](#10-reusable-component-system)
11. [Crypto Scam Command Center](#11-crypto-scam-command-center)
12. [Search & Filter Architecture](#12-search--filter-architecture)
13. [Case Study Engine](#13-case-study-engine)
14. [Sentinel AI Layer](#14-sentinel-ai-layer)
15. [Admin Command Center Improvements](#15-admin-command-center-improvements)
16. [Animation System](#16-animation-system)
17. [Performance Optimizations](#17-performance-optimizations)
18. [Security Architecture](#18-security-architecture)
19. [Mobile Responsiveness](#19-mobile-responsiveness)
20. [Deployment Architecture](#20-deployment-architecture)
21. [TypeScript Interfaces](#21-typescript-interfaces)
22. [Scalable Data Schemas](#22-scalable-data-schemas)
23. [Branch & GitHub Strategy](#23-branch--github-strategy)
24. [Implementation Roadmap](#24-implementation-roadmap)
25. [Improved README Structure](#25-improved-readme-structure)

---

## 1. Architecture Philosophy

### Core Principles

**Modularity over Monolith** — Every feature is a self-contained module with its own data, components, routes, and types. No cross-module state bleeding.

**Intelligence First** — Every module feeds into the Sentinel AI layer. The AI is not a chatbot bolted on; it's the operational brain of the ecosystem.

**India-Context Native** — Language, law, scam types, and emergency numbers are all India-first, not bolted-on localization.

**Cinematic by Default** — The design system enforces the futuristic aesthetic. Generic component libraries are never used directly.

**Edge-Cacheable** — All awareness/education content is static-friendly. Dynamic intelligence (scanners, AI) uses edge functions.

---

## 2. Scalable Folder Structure

```
trustlayerlabs/
│
├── apps/
│   └── web/                          # Main React app (Vite)
│       ├── public/
│       │   ├── fonts/
│       │   ├── locales/              # Static i18n JSON (22 languages)
│       │   └── assets/
│       │
│       ├── src/
│       │   │
│       │   ├── core/                 # SYSTEM CORE — never feature-specific
│       │   │   ├── auth/
│       │   │   │   ├── AuthContext.tsx
│       │   │   │   ├── ProtectedRoute.tsx
│       │   │   │   ├── adminAccess.ts
│       │   │   │   └── postAuthRedirect.ts
│       │   │   │
│       │   │   ├── firebase/
│       │   │   │   ├── config.ts
│       │   │   │   ├── firestore.ts
│       │   │   │   └── storage.ts
│       │   │   │
│       │   │   ├── i18n/
│       │   │   │   ├── index.ts
│       │   │   │   ├── detector.ts       # Language auto-detect
│       │   │   │   ├── fallback.ts       # Fallback chains
│       │   │   │   └── languageMap.ts    # All 22 language configs
│       │   │   │
│       │   │   ├── router/
│       │   │   │   ├── AppRouter.tsx
│       │   │   │   ├── routes.ts         # Centralized route registry
│       │   │   │   └── redirects.ts      # Legacy redirect map
│       │   │   │
│       │   │   └── store/
│       │   │       ├── globalStore.ts    # Zustand global state
│       │   │       └── threatStore.ts    # Live threat state
│       │   │
│       │   ├── sentinel/             # SENTINEL AI LAYER
│       │   │   ├── SentinelCore.tsx
│       │   │   ├── SentinelContext.tsx
│       │   │   ├── orchestrator.ts       # Multi-model routing
│       │   │   ├── groqClient.ts
│       │   │   ├── promptEngine.ts       # India-aware prompt builder
│       │   │   ├── rag/
│       │   │   │   ├── ragPipeline.ts
│       │   │   │   ├── embeddings.ts
│       │   │   │   ├── vectorStore.ts    # Local HNSW or remote Pinecone
│       │   │   │   └── retriever.ts
│       │   │   ├── heuristics/
│       │   │   │   ├── scamHeuristics.ts
│       │   │   │   ├── legalHeuristics.ts
│       │   │   │   └── threatScoring.ts
│       │   │   ├── knowledge/
│       │   │   │   ├── base/
│       │   │   │   │   ├── cyberLaws.ts
│       │   │   │   │   ├── scamTypes.ts
│       │   │   │   │   ├── cryptoScams.ts
│       │   │   │   │   ├── reportingProcedures.ts
│       │   │   │   │   └── emergencyContacts.ts
│       │   │   │   └── india/
│       │   │   │       ├── ipcSections.ts
│       │   │   │       ├── bnsProvisions.ts
│       │   │   │       ├── itActSections.ts
│       │   │   │       └── stateLaws.ts
│       │   │   └── widgets/
│       │   │       ├── ChatWidget.tsx
│       │   │       ├── FloatingAssistant.tsx
│       │   │       └── ContextualPrompts.tsx
│       │   │
│       │   ├── modules/              # FEATURE MODULES (self-contained)
│       │   │   │
│       │   │   ├── awareness/
│       │   │   │   ├── index.tsx         # Hub page
│       │   │   │   ├── types.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── phishing.ts
│       │   │   │   │   ├── upiScams.ts
│       │   │   │   │   ├── qrScams.ts
│       │   │   │   │   ├── deepfake.ts
│       │   │   │   │   ├── identityTheft.ts
│       │   │   │   │   ├── socialMedia.ts
│       │   │   │   │   └── passwordMfa.ts
│       │   │   │   └── topics/
│       │   │   │       ├── Phishing/
│       │   │   │       │   ├── index.tsx
│       │   │   │       │   ├── Simulator.tsx
│       │   │   │       │   └── components/
│       │   │   │       └── [other topics]/
│       │   │   │
│       │   │   ├── crypto-scam/          # NEW MODULE
│       │   │   │   ├── index.tsx
│       │   │   │   ├── CommandCenter.tsx
│       │   │   │   ├── types.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── rugPulls.ts
│       │   │   │   │   ├── walletDrainers.ts
│       │   │   │   │   ├── fakeExchanges.ts
│       │   │   │   │   ├── seedPhraseScams.ts
│       │   │   │   │   ├── nftScams.ts
│       │   │   │   │   ├── aiTradingScams.ts
│       │   │   │   │   └── cryptoRomanceScams.ts
│       │   │   │   └── components/
│       │   │   │       ├── ScamTypeGrid.tsx
│       │   │   │       ├── ThreatMeter.tsx
│       │   │   │       ├── WalletChecker.tsx
│       │   │   │       └── ScamTimeline.tsx
│       │   │   │
│       │   │   ├── cyber-law/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── CommandCenter.tsx
│       │   │   │   ├── LegalIntelligenceGrid.tsx
│       │   │   │   ├── types.ts
│       │   │   │   ├── engine/
│       │   │   │   │   ├── lawMapper.ts      # IPC/BNS/IT Act mapper
│       │   │   │   │   ├── sectionSearch.ts
│       │   │   │   │   ├── penaltyCalculator.ts
│       │   │   │   │   └── caseRelevance.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── ipc.ts
│       │   │   │   │   ├── bns.ts
│       │   │   │   │   ├── itAct.ts
│       │   │   │   │   ├── penalties.ts
│       │   │   │   │   └── rights.ts
│       │   │   │   └── components/
│       │   │   │       ├── LawCard.tsx
│       │   │   │       ├── SectionBrowser.tsx
│       │   │   │       ├── PenaltyMatrix.tsx
│       │   │   │       └── LawSearchBar.tsx
│       │   │   │
│       │   │   ├── deepfake/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── CommandCenter.tsx
│       │   │   │   └── components/
│       │   │   │
│       │   │   ├── reporting/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── CommandCenter.tsx
│       │   │   │   ├── StationLocator.tsx    # NEW — PIN code locator
│       │   │   │   └── components/
│       │   │   │
│       │   │   ├── scanners/
│       │   │   │   ├── url/
│       │   │   │   ├── ip/
│       │   │   │   └── breach/
│       │   │   │
│       │   │   ├── threat-intel/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── feed/
│       │   │   │   └── components/
│       │   │   │
│       │   │   ├── case-studies/         # NEW MODULE
│       │   │   │   ├── index.tsx
│       │   │   │   ├── types.ts
│       │   │   │   ├── engine/
│       │   │   │   │   ├── caseSearch.ts
│       │   │   │   │   ├── caseTagger.ts
│       │   │   │   │   └── caseRecommender.ts
│       │   │   │   ├── data/
│       │   │   │   │   ├── phishingCases.ts
│       │   │   │   │   ├── cryptoCases.ts
│       │   │   │   │   └── upiCases.ts
│       │   │   │   └── components/
│       │   │   │       ├── CaseCard.tsx
│       │   │   │       ├── CaseDetail.tsx
│       │   │   │       └── CaseTimeline.tsx
│       │   │   │
│       │   │   └── quiz/
│       │   │       ├── index.tsx
│       │   │       └── CommandCenter.tsx
│       │   │
│       │   ├── design-system/        # CINEMATIC DESIGN SYSTEM
│       │   │   ├── tokens/
│       │   │   │   ├── colors.ts
│       │   │   │   ├── typography.ts
│       │   │   │   ├── spacing.ts
│       │   │   │   ├── animation.ts
│       │   │   │   └── breakpoints.ts
│       │   │   ├── primitives/
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Badge.tsx
│       │   │   │   ├── Modal.tsx
│       │   │   │   ├── Tooltip.tsx
│       │   │   │   └── index.ts
│       │   │   ├── cinema/           # Cinematic-specific components
│       │   │   │   ├── CommandHeader.tsx
│       │   │   │   ├── HolographicPanel.tsx
│       │   │   │   ├── ScannerBeam.tsx
│       │   │   │   ├── ThreatMeter.tsx
│       │   │   │   ├── NeuralGrid.tsx
│       │   │   │   ├── GlitchText.tsx
│       │   │   │   ├── CyberBorder.tsx
│       │   │   │   └── index.ts
│       │   │   └── layouts/
│       │   │       ├── MainLayout.tsx
│       │   │       ├── CommandLayout.tsx     # Full-screen command centers
│       │   │       ├── ModuleLayout.tsx      # Standard module layout
│       │   │       └── MobileLayout.tsx
│       │   │
│       │   ├── services/             # EXTERNAL API SERVICES
│       │   │   ├── proxy/
│       │   │   │   ├── proxyClient.ts        # All calls go through proxy
│       │   │   │   └── rateLimiter.ts
│       │   │   ├── virustotal.ts
│       │   │   ├── abuseipdb.ts
│       │   │   ├── hibp.ts
│       │   │   ├── urlscan.ts
│       │   │   ├── safeBrowsing.ts
│       │   │   └── certin.ts
│       │   │
│       │   ├── hooks/                # SHARED HOOKS
│       │   │   ├── useSearch.ts
│       │   │   ├── useFilter.ts
│       │   │   ├── usePagination.ts
│       │   │   ├── useThreatFeed.ts
│       │   │   ├── useLanguage.ts
│       │   │   ├── useSentinel.ts
│       │   │   ├── usePrefersReducedMotion.ts
│       │   │   └── useBreakpoint.ts
│       │   │
│       │   ├── utils/                # SHARED UTILITIES
│       │   │   ├── threatScoring.ts
│       │   │   ├── lawMapper.ts
│       │   │   ├── scamClassifier.ts
│       │   │   ├── pinCodeResolver.ts    # Cybercrime station locator
│       │   │   ├── formatters.ts
│       │   │   └── validators.ts
│       │   │
│       │   ├── types/                # GLOBAL TYPE DEFINITIONS
│       │   │   ├── threat.ts
│       │   │   ├── scam.ts
│       │   │   ├── law.ts
│       │   │   ├── user.ts
│       │   │   ├── ai.ts
│       │   │   ├── caseStudy.ts
│       │   │   └── index.ts
│       │   │
│       │   ├── pages/                # ROUTE ENTRY POINTS (thin wrappers)
│       │   │   ├── admin/
│       │   │   ├── auth/
│       │   │   └── index.tsx
│       │   │
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   └── index.css
│       │
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.js
│       └── tsconfig.json
│
├── packages/                         # SHARED PACKAGES (future monorepo)
│   ├── types/                        # Shared TypeScript types
│   ├── ui/                           # Shared UI components
│   └── config/                       # Shared config (ESLint, TS, Tailwind)
│
├── backend/                          # BACKEND PROXY (Node.js/Edge)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── proxy.ts              # API proxy endpoints
│   │   │   ├── sentinel.ts           # AI orchestration
│   │   │   └── intelligence.ts       # Threat feed
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── cors.ts
│   │   └── services/
│   │       ├── groq.ts
│   │       ├── virustotal.ts
│   │       └── abuseipdb.ts
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   ├── security.md
│   ├── api.md
│   ├── ai-strategy.md
│   └── multilingual.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── preview.yml
│   │   └── deploy.yml
│   └── PULL_REQUEST_TEMPLATE.md
│
└── README.md
```

---

## 3. Module Dependency Map

```
App Core
├── core/auth           → all protected modules
├── core/i18n           → all UI components
├── core/router         → all pages
└── core/store          → threat-intel, sentinel

Sentinel AI Layer
├── knowledge/base      → all modules (context injection)
├── knowledge/india     → cyber-law, reporting
├── rag/ragPipeline     → knowledge base
├── heuristics/         → analyzer, scanners
└── widgets/            → all pages (floating assistant)

Feature Modules
├── awareness           → sentinel, design-system
├── crypto-scam         → sentinel, threat-intel, design-system
├── cyber-law           → sentinel, knowledge/india, design-system
├── deepfake            → sentinel, design-system
├── reporting           → sentinel, knowledge/india, utils/pinCode
├── scanners            → services/proxy, sentinel
├── threat-intel        → core/store, sentinel
├── case-studies        → sentinel, all module data
└── quiz                → awareness, case-studies

Design System
├── cinema/             → all command centers
├── primitives/         → all modules
└── layouts/            → all pages
```

---

## 4. AI Assistant Architecture

### Multi-Layer Intelligence Stack

```
User Input
    ↓
Context Detection Layer
    │ ├── Page context (which module is active)
    │ ├── Language detection
    │ ├── Intent classifier (legal/scam/report/explain)
    │ └── Severity assessment
    ↓
Prompt Engineering Layer
    │ ├── India-aware system prompt builder
    │ ├── Law context injector (IPC/BNS/IT Act)
    │ ├── Scam taxonomy injector
    │ └── Language-specific response formatter
    ↓
RAG Retrieval Layer
    │ ├── Vector similarity search
    │ ├── Keyword fallback
    │ └── Context window assembly
    ↓
Model Router
    │ ├── Groq (speed) → awareness queries
    │ ├── Groq (complex) → legal analysis
    │ └── Heuristic fallback → offline mode
    ↓
Response Post-Processing
    │ ├── Legal disclaimer injection
    │ ├── Emergency number injection (if crisis)
    │ ├── Language normalization
    │ └── Source attribution
    ↓
Rendered Response
```

### Sentinel Context System

```typescript
// sentinel/promptEngine.ts
interface SentinelContext {
  pageModule: ModuleId;           // which page triggered this
  userLanguage: IndianLanguage;   // one of 22 official languages
  detectedIntent: IntentType;     // LEGAL | SCAM | REPORT | EXPLAIN | EMERGENCY
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  relevantLaws: LawSection[];     // pre-fetched relevant sections
  relatedCases: CaseStudy[];      // pre-fetched related cases
  userProfile?: UserContext;      // if authenticated
}

type IntentType =
  | 'LEGAL_QUERY'
  | 'SCAM_IDENTIFICATION'
  | 'REPORTING_GUIDANCE'
  | 'EDUCATIONAL'
  | 'CRYPTO_SCAM'
  | 'DEEPFAKE_CONCERN'
  | 'EMERGENCY_RESPONSE';
```

---

## 5. RAG Architecture

### Pipeline Design

```
Offline Phase (Build Time)
├── Document Ingestion
│   ├── IPC/BNS/IT Act full text → chunked
│   ├── Scam case studies → structured
│   ├── Awareness content → paragraphs
│   └── Emergency procedures → atomic facts
│
├── Embedding Generation
│   ├── Provider: Xenova/transformers.js (client-side)
│   │   or: Groq embeddings API (server-side)
│   └── Model: multilingual-e5-large (22-language support)
│
└── Vector Index
    ├── Local: HNSW via hnswlib-node
    └── Remote (production): Pinecone / Supabase pgvector

Online Phase (Query Time)
├── Query embedding
├── ANN search (top-k=5, threshold=0.75)
├── Metadata filtering (module, language, severity)
├── Context assembly (max 2000 tokens)
└── Prompt injection → Groq
```

### Chunking Strategy

```typescript
interface KnowledgeChunk {
  id: string;
  content: string;               // 200-500 token chunks
  contentHi?: string;            // Hindi translation
  metadata: {
    source: 'IPC' | 'BNS' | 'IT_ACT' | 'CASE_STUDY' | 'AWARENESS';
    section?: string;            // e.g. "Section 66C"
    module: ModuleId;
    severity?: ThreatSeverity;
    tags: string[];
    language: IndianLanguage;
  };
  embedding: number[];           // 768-dim vector
}
```

---

## 6. Multilingual Architecture (22 Languages)

### Supported Languages

```typescript
// core/i18n/languageMap.ts
export const INDIAN_LANGUAGES = {
  en:    { name: 'English',    script: 'Latin',    rtl: false },
  hi:    { name: 'हिन्दी',      script: 'Devanagari', rtl: false },
  bn:    { name: 'বাংলা',       script: 'Bengali',  rtl: false },
  te:    { name: 'తెలుగు',      script: 'Telugu',   rtl: false },
  mr:    { name: 'मराठी',       script: 'Devanagari', rtl: false },
  ta:    { name: 'தமிழ்',       script: 'Tamil',    rtl: false },
  gu:    { name: 'ગુજરાતી',     script: 'Gujarati', rtl: false },
  kn:    { name: 'ಕನ್ನಡ',       script: 'Kannada',  rtl: false },
  ml:    { name: 'മലയാളം',      script: 'Malayalam', rtl: false },
  pa:    { name: 'ਪੰਜਾਬੀ',      script: 'Gurmukhi', rtl: false },
  or:    { name: 'ଓଡ଼ିଆ',        script: 'Odia',     rtl: false },
  as:    { name: 'অসমীয়া',     script: 'Bengali',  rtl: false },
  ur:    { name: 'اردو',        script: 'Arabic',   rtl: true  },
  mai:   { name: 'मैथिली',      script: 'Devanagari', rtl: false },
  sat:   { name: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Ol Chiki', rtl: false },
  kok:   { name: 'कोंकणी',      script: 'Devanagari', rtl: false },
  doi:   { name: 'डोगरी',       script: 'Devanagari', rtl: false },
  mni:   { name: 'মৈতৈলোন্',   script: 'Meitei',   rtl: false },
  sd:    { name: 'سنڌي',        script: 'Arabic',   rtl: true  },
  ks:    { name: 'كٲشُر',       script: 'Arabic',   rtl: true  },
  ne:    { name: 'नेपाली',      script: 'Devanagari', rtl: false },
  bo:    { name: 'བོད་སྐད།',     script: 'Tibetan',  rtl: false },
} as const;

export type IndianLanguage = keyof typeof INDIAN_LANGUAGES;
```

### Translation Architecture

```
Phase 1 — Core UI (en + hi): Already exists
Phase 2 — High Priority (+ bn, te, mr, ta, gu, kn, ml, pa)
Phase 3 — Complete 22 languages

Translation File Structure:
public/locales/
├── en/
│   ├── common.json         # Navigation, buttons, labels
│   ├── awareness.json      # Awareness module strings
│   ├── laws.json           # Legal terminology
│   ├── scams.json          # Scam type descriptions
│   └── emergency.json      # Emergency guidance (PRIORITY)
├── hi/
│   └── [same structure]
└── [20 more language folders]

AI Translation Strategy:
1. Machine-translate via Groq → Llama 3.1 (multilingual)
2. Flag legal/emergency strings for human review
3. Community review program for regional accuracy
4. Glossary management for technical terms
```

### RTL Support

```typescript
// For Urdu, Sindhi, Kashmiri
const RTL_LANGS = ['ur', 'sd', 'ks'];

// App.tsx
const { language } = useLanguage();
const isRTL = RTL_LANGS.includes(language);

return (
  <div dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
    {children}
  </div>
);
```

---

## 7. Scam Intelligence Database Architecture

### Centralized Schema

```typescript
// types/scam.ts

interface ScamRecord {
  id: string;                       // UUID
  slug: string;                     // URL-friendly
  title: string;
  titleHi?: string;                 // Hindi title
  
  classification: {
    category: ScamCategory;
    subcategory: string;
    vector: AttackVector;           // SMS | EMAIL | CALL | APP | SOCIAL | CRYPTO | QR
    severity: ThreatSeverity;       // LOW | MEDIUM | HIGH | CRITICAL
    india_specific: boolean;
    state_specific?: IndianState[];
  };
  
  indicators: {
    keywords: string[];             // red flag keywords (multilingual)
    patterns: RegExp[];             // pattern matchers
    phonePatterns?: string[];       // suspicious number patterns
    urlPatterns?: string[];         // suspicious URL patterns
    walletPatterns?: string[];      // crypto wallet red flags
  };
  
  laws: {
    ipc?: string[];                 // e.g. ["420", "468"]
    bns?: string[];                 // BNS sections
    it_act?: string[];              // e.g. ["66C", "66D"]
    penalties: PenaltySummary;
  };
  
  reporting: {
    primary_portal: string;         // cybercrime.gov.in
    helpline: string;               // 1930
    evidence_checklist: string[];
    time_sensitivity: string;
  };
  
  awareness: {
    howItWorks: string;
    redFlags: string[];
    prevention: string[];
    caseStudyIds: string[];
  };
  
  metadata: {
    created: Date;
    updated: Date;
    sources: string[];
    confidence: number;             // 0-1
    reportCount?: number;           // from community
  };
}

type ScamCategory =
  | 'UPI_FRAUD'
  | 'PHISHING'
  | 'QR_SCAM'
  | 'CRYPTO_SCAM'
  | 'IDENTITY_THEFT'
  | 'SOCIAL_ENGINEERING'
  | 'DEEPFAKE'
  | 'ROMANCE_SCAM'
  | 'JOB_FRAUD'
  | 'LOAN_FRAUD'
  | 'INVESTMENT_FRAUD';

type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type AttackVector = 'SMS' | 'EMAIL' | 'CALL' | 'APP' | 'SOCIAL' | 'CRYPTO' | 'QR' | 'PHYSICAL';
```

### Threat Severity Engine

```typescript
// utils/threatScoring.ts

interface ThreatScoreInput {
  text: string;
  url?: string;
  phoneNumber?: string;
  walletAddress?: string;
  context: ModuleId;
}

interface ThreatScoreResult {
  score: number;                    // 0-100
  severity: ThreatSeverity;
  confidence: number;               // 0-1
  matchedIndicators: string[];
  suggestedScamTypes: ScamCategory[];
  recommendedActions: string[];
  relevantLaws: LawSection[];
}

// Scoring algorithm:
// 1. Keyword match score (0-30)
// 2. Pattern match score (0-30)  
// 3. URL/phone reputation score (0-20) — via API
// 4. Behavioral pattern score (0-20) — heuristics
// Total: 0-100 → mapped to severity
```

---

## 8. Cyber Law Intelligence Engine

### Law Mapping System

```typescript
// modules/cyber-law/engine/lawMapper.ts

interface LawSection {
  id: string;                       // "IPC-420" | "BNS-318" | "ITA-66C"
  act: 'IPC' | 'BNS' | 'IT_ACT' | 'POCSO' | 'CRPC';
  section: string;                  // "420" | "66C"
  title: string;
  description: string;
  punishment: {
    imprisonment?: string;          // "up to 3 years"
    fine?: string;                  // "up to ₹1 lakh"
    both?: boolean;
  };
  cognizable: boolean;
  bailable: boolean;
  applicableScams: ScamCategory[];  // which scams this applies to
  supersededBy?: string;            // IPC sections superseded by BNS
  bnsMapped?: string;               // BNS equivalent of IPC section
  tags: string[];
}

// Smart mapper: given a scam type → return relevant sections
function getRelevantLaws(scamType: ScamCategory): LawSection[] {
  return LAW_DATABASE.filter(law =>
    law.applicableScams.includes(scamType)
  ).sort((a, b) => LAW_PRIORITY[a.act] - LAW_PRIORITY[b.act]);
}

// IPC → BNS transition mapper (critical for 2023 BNS introduction)
function mapIPCtoBNS(ipcSection: string): LawSection | null {
  return IPC_TO_BNS_MAP[ipcSection] ?? null;
}
```

### Law Search Architecture

```typescript
interface LawSearchQuery {
  text?: string;                    // free text search
  act?: ('IPC' | 'BNS' | 'IT_ACT')[];
  scamType?: ScamCategory[];
  severity?: ThreatSeverity;
  cognizable?: boolean;
  language?: IndianLanguage;
}

// Uses: Fuse.js for fuzzy search + metadata filters
// Index built from: section text + title + tags + scam categories
```

---

## 9. Backend Proxy & API Architecture

### Why a Backend Proxy

- Never expose API keys in frontend bundles
- Rate limiting per user/IP
- Request caching (reduce API costs)
- Response normalization across providers
- Logging and monitoring

### Architecture Options (ranked)

**Option A — Vercel Edge Functions** (recommended for current stack)
```
Frontend (Vite) → Vercel Edge → External APIs
                              ├── VirusTotal
                              ├── AbuseIPDB
                              ├── HIBP
                              ├── URLScan
                              └── Groq
```

**Option B — Cloudflare Workers**
```
Frontend → CF Worker → External APIs
           CF KV Cache (reduce API calls)
```

**Option C — Dedicated Express/Fastify** (for future scaling)
```
Frontend → Express API → Redis Cache → External APIs
                      → PostgreSQL (scam DB)
                      → Pinecone (vector store)
```

### Proxy Endpoint Design

```typescript
// backend/src/routes/proxy.ts

// All scan requests go through: /api/proxy/{service}
// Rate limits: 10 req/min per IP for free, 100/min for authenticated

GET  /api/proxy/virustotal?url={url}
GET  /api/proxy/abuseipdb?ip={ip}
GET  /api/proxy/hibp?email={email}
GET  /api/proxy/urlscan?url={url}

POST /api/proxy/groq          (body: { messages, model, context })
POST /api/proxy/analyze       (body: { text, type, language })

// Admin only:
GET  /api/admin/stats
GET  /api/admin/threat-feed
```

### Caching Strategy

```typescript
// Cache layers:
// 1. CDN cache (1hr) — static threat feed
// 2. Redis cache (15min) — scan results
// 3. Browser cache (5min) — non-sensitive data

const CACHE_TTL = {
  virusTotalScan: 900,       // 15 minutes
  abuseIPDB: 3600,           // 1 hour
  hibpCheck: 86400,          // 24 hours (HIBP data is batch-updated)
  threatFeed: 300,           // 5 minutes
  lawData: Infinity,         // Static, bust on deploy
};
```

---

## 10. Reusable Component System

### Cinema Design System Primitives

```tsx
// design-system/cinema/CommandHeader.tsx
interface CommandHeaderProps {
  title: string;
  subtitle?: string;
  threatLevel?: ThreatSeverity;
  operationalStatus?: 'ACTIVE' | 'STANDBY' | 'ALERT';
  actions?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

// design-system/cinema/HolographicPanel.tsx
interface HolographicPanelProps {
  children: React.ReactNode;
  glowColor?: 'cyan' | 'red' | 'green' | 'amber';
  scanlines?: boolean;
  animated?: boolean;
  className?: string;
}

// design-system/cinema/ThreatMeter.tsx
interface ThreatMeterProps {
  score: number;           // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
}

// design-system/cinema/NeuralGrid.tsx
// The animated background grid seen throughout the platform
interface NeuralGridProps {
  density?: 'sparse' | 'medium' | 'dense';
  color?: string;
  animated?: boolean;
  opacity?: number;
}
```

### Page Layout Patterns

```tsx
// All command centers follow this exact pattern:
<CommandLayout>
  <CommandHeader title="..." threatLevel="HIGH" />
  <NeuralGrid density="sparse" />
  
  <div className="command-body">
    <LeftPanel>       {/* stats, filters, navigation */}
    <MainContent>     {/* primary content area */}
    <RightPanel>      {/* AI assistant, related info */}
  </div>
  
  <FloatingAssistant module="crypto-scam" />
</CommandLayout>
```

---

## 11. Crypto Scam Command Center

### Module Architecture

```
modules/crypto-scam/
├── CommandCenter.tsx         # Main hub
├── types.ts
├── data/
│   ├── rugPulls.ts           # Token rug pull patterns
│   ├── walletDrainers.ts     # Malicious contract patterns
│   ├── fakeExchanges.ts      # Known fake exchange list
│   ├── seedPhraseScams.ts    # Seed phrase attack vectors
│   ├── nftScams.ts           # NFT fraud patterns
│   ├── aiTradingScams.ts     # AI/bot trading scam patterns
│   └── cryptoRomanceScams.ts # Pig butchering & romance scams
└── components/
    ├── ScamTypeGrid.tsx       # Interactive 7-type grid
    ├── WalletChecker.tsx      # Paste wallet → check reputation
    ├── ThreatMeter.tsx        # Real-time threat score
    ├── ScamTimeline.tsx       # How a scam unfolds step by step
    └── RedFlagDetector.tsx    # Paste text → detect red flags
```

### Crypto Scam Schema

```typescript
interface CryptoScam extends ScamRecord {
  crypto_specific: {
    type: CryptoScamType;
    blockchain?: string[];          // 'ETH' | 'BNB' | 'SOL' | 'TRON'
    walletPatterns?: string[];      // Address patterns
    contractRisks?: ContractRisk[]; // Smart contract red flags
    platformsTargeted: string[];    // WhatsApp, Telegram, Instagram
    averageLoss?: number;           // INR
    recovery_possible: boolean;
    india_reported_cases?: number;
  };
}

type CryptoScamType =
  | 'RUG_PULL'
  | 'WALLET_DRAINER'
  | 'FAKE_EXCHANGE'
  | 'SEED_PHRASE'
  | 'NFT_SCAM'
  | 'AI_TRADING'
  | 'CRYPTO_ROMANCE'
  | 'PUMP_AND_DUMP'
  | 'FAKE_AIRDROP';
```

---

## 12. Search & Filter Architecture

### Universal Search System

```typescript
// hooks/useSearch.ts

interface SearchConfig<T> {
  data: T[];
  searchFields: (keyof T)[];       // Fields to search
  fuseOptions?: Fuse.IFuseOptions<T>;
  debounceMs?: number;             // Default: 300ms
}

interface SearchResult<T> {
  results: T[];
  query: string;
  totalCount: number;
  searchTime: number;
}

// Powered by Fuse.js for fuzzy search
// Supports: multilingual queries, typo tolerance
```

### Filter Architecture

```typescript
// hooks/useFilter.ts

interface FilterConfig<T> {
  filters: FilterDefinition<T>[];
  defaultValues?: Partial<FilterState>;
  persist?: boolean;               // Save to URL params
}

interface FilterDefinition<T> {
  key: string;
  type: 'select' | 'multiselect' | 'range' | 'toggle' | 'date';
  field: keyof T | ((item: T) => unknown);
  options?: FilterOption[];
  label: string;
}

// URL persistence: ?severity=HIGH&category=CRYPTO_SCAM&lang=hi
// Makes filtered views shareable and bookmarkable
```

### Global Search Command Palette

```
Ctrl+K → Command palette opens
         ├── Search across: laws, scam types, case studies, modules
         ├── Recent searches
         ├── Quick actions (Report cybercrime, Emergency contacts)
         └── Language switcher
```

---

## 13. Case Study Engine

### Schema

```typescript
interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  
  incident: {
    type: ScamCategory;
    date: string;                  // "2023-Q4" (anonymized)
    location?: IndianState;
    financialLoss?: {
      amount: number;
      currency: 'INR';
      recovered?: number;
    };
    victims?: number;
  };
  
  narrative: {
    summary: string;
    howItHappened: TimelineEvent[];
    redFlagsPresent: string[];
    whatVictimDid: string;
    whatShouldHaveDone: string;
  };
  
  legal: {
    sections: LawSection[];
    outcome?: string;
    duration?: string;
    wasResolved?: boolean;
  };
  
  lessons: string[];
  preventionTips: string[];
  
  metadata: {
    source: 'NEWS' | 'CERT_IN' | 'POLICE_REPORT' | 'COMMUNITY' | 'SYNTHETIC';
    verified: boolean;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    tags: string[];
    views?: number;
    helpfulCount?: number;
  };
}

interface TimelineEvent {
  step: number;
  title: string;
  description: string;
  attackerAction?: string;
  victimReaction?: string;
  redFlag?: string;              // what should have been noticed
}
```

### Case Study Recommendation Engine

```typescript
// modules/case-studies/engine/caseRecommender.ts

// Given: current module + user's apparent concern
// Returns: ranked list of relevant case studies

function recommendCases(context: {
  module: ModuleId;
  scamType?: ScamCategory;
  userQuery?: string;
  language: IndianLanguage;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}): CaseStudy[] {
  // 1. Filter by scam type relevance
  // 2. Score by Fuse.js text similarity to userQuery
  // 3. Apply difficulty filter
  // 4. Translate metadata labels to user language
  // 5. Return top-5
}
```

---

## 14. Sentinel AI Layer

### Operational Design

Sentinel is not a chatbot. It is the **intelligence nervous system** of the platform — context-aware, law-aware, scam-aware, India-aware.

**Sentinel operates in 3 modes:**

1. **Ambient** — Always listening, detects context shifts, proactively surfaces relevant info
2. **Interactive** — User explicitly engages the chat widget
3. **Emergency** — Detects crisis signals, overrides to emergency response mode

### Emergency Protocol

```typescript
const EMERGENCY_TRIGGERS = [
  'account hacked',
  'money transferred',
  'otp shared',
  'link clicked',
  'blackmail',
  'nude photo',
  'ransom',
  'paise gaye',      // Hindi: money gone
  'khata band karo', // Hindi: close account
];

// If triggered:
// 1. Switch to emergency mode UI (red overlay)
// 2. Surface 1930 helpline prominently
// 3. Provide immediate step-by-step response
// 4. Suggest evidence preservation
// 5. Auto-generate nearest cybercrime station via PIN code
```

### Prompt Engineering Strategy

```typescript
// sentinel/promptEngine.ts

function buildSystemPrompt(context: SentinelContext): string {
  return `
You are Sentinel, an AI cyber awareness assistant for India.

## Your Identity
- India-focused cybercrime and cyber law expert
- NOT a generic AI assistant
- Speak in ${context.userLanguage === 'hi' ? 'Hindi' : 'English'} (or mix if natural)
- Always cite specific Indian laws (IPC/BNS/IT Act sections)
- Always provide the 1930 cyber helpline for serious issues

## Current Context
- User is viewing: ${context.pageModule} module
- Detected intent: ${context.detectedIntent}
- Urgency: ${context.urgencyLevel}

## Relevant Laws for This Query
${context.relevantLaws.map(l => `- ${l.id}: ${l.title}`).join('\n')}

## Related Cases
${context.relatedCases.map(c => `- ${c.title} (${c.incident.type})`).join('\n')}

## Rules
- NEVER give generic "be careful online" advice
- ALWAYS cite specific sections when discussing law
- If emergency detected, lead with 1930 helpline
- For crypto scams: remind that crypto transactions are mostly irreversible
- For UPI fraud: always mention 30-minute chargeback window via bank
- End with next actionable step

## Retrieved Knowledge
{RAG_CONTEXT}
  `;
}
```

---

## 15. Admin Command Center Improvements

### Sentinel Core Architecture

```
/admin (Sentinel Core)
├── Overview Dashboard
│   ├── Real-time threat map (India)
│   ├── Active alerts ticker
│   ├── Module usage analytics
│   └── AI conversation insights
│
├── Threat Intelligence
│   ├── Live CERT-In feed integration
│   ├── Manual threat addition
│   ├── Threat severity management
│   └── Geo-distribution map
│
├── Scam Database Management
│   ├── Add/edit/delete scam records
│   ├── Approve community submissions
│   ├── Bulk import from CSV/JSON
│   └── Translation management
│
├── Case Study Management
│   ├── CMS for case studies
│   ├── Verification workflow
│   └── Publishing controls
│
├── User Analytics
│   ├── Module engagement heatmap
│   ├── Language distribution
│   ├── Geographic usage
│   └── AI query analytics
│
└── System Health
    ├── API quota monitoring
    ├── Error rate tracking
    ├── Performance metrics
    └── Cache hit rates
```

---

## 16. Animation System

### Framer Motion Token System

```typescript
// design-system/tokens/animation.ts

export const MOTION = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
  
  // Card reveals (stagger)
  cardGrid: {
    container: { animate: { transition: { staggerChildren: 0.08 } } },
    item: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  },
  
  // Threat alert pulse
  threatPulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 2, repeat: Infinity }
    }
  },
  
  // Scanner beam
  scanBeam: {
    animate: {
      y: ['0%', '100%', '0%'],
      transition: { duration: 3, repeat: Infinity, ease: 'linear' }
    }
  },
  
  // Holographic flicker
  holographicFlicker: {
    animate: {
      opacity: [1, 0.97, 1, 0.95, 1],
      transition: { duration: 0.15, repeat: Infinity, repeatDelay: 4 }
    }
  }
};

// Reduced motion: all animations disabled via CSS prefers-reduced-motion
// usePrefersReducedMotion() hook gates all Framer Motion usage
```

### CSS Animation Classes (Tailwind custom)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'scan-beam': 'scanBeam 3s linear infinite',
        'threat-pulse': 'threatPulse 2s ease-in-out infinite',
        'cyber-glow': 'cyberGlow 1.5s ease-in-out infinite alternate',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'glitch': 'glitch 2s linear infinite',
        'neural-pulse': 'neuralPulse 4s ease-in-out infinite',
      }
    }
  }
}
```

---

## 17. Performance Optimizations

### Bundle Strategy

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-ai': ['./src/sentinel/groqClient'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'module-laws': ['./src/modules/cyber-law/data/ipc', ...],
          'module-crypto': ['./src/modules/crypto-scam/data/...'],
        }
      }
    }
  }
});
```

### Lazy Loading Strategy

```typescript
// core/router/AppRouter.tsx
const CryptoScamCenter = lazy(() => import('../modules/crypto-scam'));
const CyberLawCenter = lazy(() => import('../modules/cyber-law'));
const DeepfakeCenter = lazy(() => import('../modules/deepfake'));
const SentinelAdmin = lazy(() => import('../pages/admin'));

// Preload on hover for instant navigation feel:
const preloadModule = (module: string) => {
  import(`../modules/${module}`);
};

<Link
  to="/crypto-scam"
  onMouseEnter={() => preloadModule('crypto-scam')}
>
  Crypto Scam Center
</Link>
```

### Content Strategy

- Static awareness/law data → compiled into JS at build time (no runtime fetch)
- Dynamic threat feed → SWR with 5-min revalidation
- Scan results → React Query with cache
- AI responses → streaming (no loading states)
- Images → WebP + lazy loading + blur-up placeholder

---

## 18. Security Architecture

### Frontend Security

```typescript
// Content Security Policy (via Vercel headers)
const CSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'nonce-{NONCE}'"],
  'connect-src': ["'self'", "https://api.groq.com", "https://firestore.googleapis.com"],
  'img-src': ["'self'", "data:", "https:"],
  'frame-ancestors': ["'none'"],
};

// Environment variable exposure check:
// NEVER prefix sensitive keys with VITE_ (they're in the bundle)
// All API keys go through /api/proxy (backend only)

// DOMPurify on all user-provided content rendered as HTML
import DOMPurify from 'dompurify';
const safeHTML = DOMPurify.sanitize(userContent);

// Firebase security rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /admin/{document=**} {
      allow read, write: if get(/databases/.../users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### API Key Management

```
NEVER in frontend:
✗ VITE_VIRUSTOTAL_API_KEY
✗ VITE_ABUSEIPDB_KEY
✗ VITE_HIBP_KEY
✗ VITE_GROQ_API_KEY

Only in backend/.env:
✓ VIRUSTOTAL_API_KEY
✓ ABUSEIPDB_KEY
✓ HIBP_KEY
✓ GROQ_API_KEY

Frontend only needs:
✓ VITE_FIREBASE_CONFIG (public, Firebase-safe)
✓ VITE_API_BASE_URL (your proxy URL)
```

---

## 19. Mobile Responsiveness

### Breakpoint System

```typescript
// design-system/tokens/breakpoints.ts
export const BREAKPOINTS = {
  xs: '360px',    // Small phones
  sm: '480px',    // Large phones
  md: '768px',    // Tablets
  lg: '1024px',   // Small laptops
  xl: '1280px',   // Desktops
  '2xl': '1536px' // Large monitors
};
```

### Command Center Mobile Adaptation

```
Desktop: 3-column layout (Left Panel | Main | Right Panel)
Tablet:  2-column layout (Main | Collapsed Right)
Mobile:  Single column, bottom sheet for panels

Mobile-specific:
├── Bottom navigation bar (replaces sidebar)
├── Swipe gestures for panel navigation
├── Collapsible command headers
├── Touch-optimized threat meters
├── Simplified NeuralGrid (reduced particle count)
└── Floating AI button (fixed bottom-right)
```

### India-Specific Mobile Considerations

- Hindi/Devanagari font loading (Noto Sans Devanagari)
- Bandwidth-aware: low-data mode reduces animations
- Works on Android 8+ (India's dominant mobile OS)
- WhatsApp share integration for reporting guidance
- UPI deep links for donation/reporting flows

---

## 20. Deployment Architecture

### Recommended Stack

```
Frontend:  Vercel (automatic from GitHub)
Backend:   Vercel Edge Functions (co-located)
Database:  Firestore (existing) + Supabase (future scam DB)
AI:        Groq API (via backend proxy)
Vector DB: Pinecone (RAG) or Supabase pgvector
CDN:       Vercel Edge Network
DNS:       Cloudflare (DDoS protection)
Monitoring: Vercel Analytics + Sentry
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build
      - run: npm run test

  preview:
    if: github.event_name == 'pull_request'
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - run: npx vercel --token ${{ secrets.VERCEL_TOKEN }}
    # Auto-posts preview URL to PR comment
```

### Environment Strategy

```
main branch    → production (trustlayerlabs.in)
develop branch → staging (staging.trustlayerlabs.in)
feature/*      → preview (per-PR URL via Vercel)
```

---

## 21. TypeScript Interfaces

### Core Types

```typescript
// types/threat.ts
interface ThreatFeedItem {
  id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  category: ScamCategory;
  source: string;
  timestamp: Date;
  affectedRegions?: IndianState[];
  indicators: string[];
  mitigation: string[];
  certInRef?: string;
}

// types/user.ts
interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  language: IndianLanguage;
  state?: IndianState;
  createdAt: Date;
  lastActive: Date;
  quizScores?: QuizScore[];
  reportedCases?: string[];
}

// types/ai.ts
interface SentinelMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: SentinelContext;
  retrievedChunks?: KnowledgeChunk[];
  emergencyTriggered?: boolean;
  lawsReferenced?: LawSection[];
}
```

---

## 22. Scalable Data Schemas

### Scam Record (Firestore)

```
Collection: scams
Document: {scamId}
├── id, slug, title, titleHi
├── classification: { category, subcategory, vector, severity, india_specific }
├── indicators: { keywords[], patterns[], phonePatterns[], urlPatterns[] }
├── laws: { ipc[], bns[], it_act[], penalties }
├── reporting: { primary_portal, helpline, evidence_checklist[] }
├── awareness: { howItWorks, redFlags[], prevention[], caseStudyIds[] }
└── metadata: { created, updated, sources[], confidence, reportCount }

Collection: case_studies
Document: {caseId}
├── id, slug, title
├── incident: { type, date, location, financialLoss, victims }
├── narrative: { summary, howItHappened[], redFlags[], lessons[] }
├── legal: { sections[], outcome, wasResolved }
└── metadata: { source, verified, difficulty, tags[], views }

Collection: threat_feed
Document: {threatId}
├── id, title, description, severity
├── source, timestamp, certInRef
├── affectedRegions[], indicators[], mitigation[]
└── expiresAt (auto-archive)
```

---

## 23. Branch & GitHub Strategy

### Branch Model

```
main                    ← Production-only. Protected. Requires PR + CI pass.
  └── develop           ← Integration branch. All features merge here first.
        ├── feature/*   ← New features: feature/crypto-scam-center
        ├── fix/*       ← Bug fixes: fix/auth-redirect-loop
        ├── refactor/*  ← Refactoring: refactor/folder-restructure
        └── chore/*     ← Tooling: chore/upgrade-dependencies
```

### Commit Convention

```
feat(crypto-scam): add wallet drainer detection engine
fix(auth): resolve redirect loop on admin login
refactor(sentinel): migrate to new prompt engine
docs(rag): add RAG pipeline architecture diagram
chore(deps): upgrade framer-motion to v11
i18n(hi): add Hindi translations for crypto scam module
```

### PR Template

```markdown
## Summary
Brief description of what changed and why.

## Module Affected
- [ ] awareness
- [ ] crypto-scam
- [ ] cyber-law
- [ ] sentinel-ai
- [ ] design-system
- [ ] backend-proxy

## Checklist
- [ ] TypeScript passes (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build passes (`npm run build`)
- [ ] Mobile responsive tested
- [ ] Hindi/multilingual strings added (if UI text)
- [ ] No API keys in frontend code
- [ ] Animation respects `prefers-reduced-motion`
```

---

## 24. Implementation Roadmap

### Phase 0 — Foundation Cleanup (2 weeks)
**Goal**: Establish clean architecture before adding features

- [ ] Migrate to new folder structure (apps/web/src/)
- [ ] Centralize route registry (eliminate scattered routes)
- [ ] Implement Zustand global store (replace scattered state)
- [ ] Set up backend proxy (Vercel Edge Functions)
- [ ] Move all API keys to backend
- [ ] Establish design-system/cinema component library
- [ ] TypeScript strict mode across all modules

### Phase 1 — Sentinel AI Core (3 weeks)
**Goal**: Make AI the intelligence soul of the platform

- [ ] Build SentinelContext system
- [ ] Implement India-aware prompt engine
- [ ] Set up RAG pipeline (transformers.js embeddings)
- [ ] Integrate Groq streaming responses
- [ ] Build emergency detection protocol
- [ ] Implement floating AI widget (all pages)
- [ ] Add 1930 helpline auto-surfacing

### Phase 2 — Multilingual Expansion (2 weeks)
**Goal**: Support 9 priority languages

- [ ] Set up machine translation pipeline (Groq)
- [ ] Add: bn, te, mr, ta, gu, kn, ml, pa
- [ ] RTL support for Urdu
- [ ] Language auto-detection
- [ ] Per-module translation (not just UI labels)

### Phase 3 — Crypto Scam Command Center (2 weeks)
**Goal**: India's most comprehensive crypto scam resource

- [ ] Build all 7 crypto scam type data files
- [ ] Implement wallet reputation checker
- [ ] Build scam timeline visualizer
- [ ] Add red flag detector (text paste)
- [ ] Connect to Sentinel AI context
- [ ] Case studies (10 real India crypto cases)

### Phase 4 — Law Intelligence Engine (2 weeks)
**Goal**: Functional IPC/BNS/IT Act mapper

- [ ] Complete all law section data (IPC, BNS, IT Act)
- [ ] Build law search (Fuse.js)
- [ ] IPC → BNS transition mapper
- [ ] Penalty calculator
- [ ] Connect to Sentinel (auto-inject relevant laws)
- [ ] Case study ↔ law linkage

### Phase 5 — Case Study Engine (2 weeks)
**Goal**: Real India cybercrime case database

- [ ] Build 50+ verified case studies
- [ ] Implement recommendation engine
- [ ] Search and filter system
- [ ] Link to relevant laws and scam types
- [ ] Timeline visualization component

### Phase 6 — Station Locator & Reporting (1 week)
**Goal**: Help victims find the right reporting path

- [ ] Integrate PIN code → cybercrime station lookup
- [ ] Build station locator UI
- [ ] 30-minute UPI chargeback workflow guide
- [ ] Evidence checklist generator

### Phase 7 — Performance & Deployment (1 week)
**Goal**: Production-ready

- [ ] Bundle optimization
- [ ] CDN configuration
- [ ] Monitoring setup (Sentry)
- [ ] Security audit
- [ ] Lighthouse score: 90+ on all metrics

**Total estimated timeline**: ~15 weeks (with 1 developer)

---

## 25. Improved README Structure

```markdown
# TRUSTLAYERLABS — Cyber Awareness Platform

> India's AI-Powered Cyber Awareness & Legal Intelligence Ecosystem

## What This Is

A cinematic, AI-driven cyber awareness operating system focused on:
- Cybercrime awareness for Indian users
- Indian cyber law intelligence (IPC, BNS, IT Act)
- AI-guided scam identification and reporting
- Crypto scam intelligence
- Multilingual support (22 Indian languages)
- Emergency cyber response guidance

## Architecture

See [docs/architecture.md](docs/architecture.md) for the full system design.

### Module Map
- `/awareness` — Core awareness hub (phishing, UPI, QR, deepfake)
- `/crypto-scam` — Crypto scam command center
- `/cyber-law` — Law intelligence grid (IPC/BNS/IT Act)
- `/reporting` — Cyber emergency response + station locator
- `/scanners` — URL, IP, breach intelligence tools
- `/threat-feed` — Live threat intelligence
- `/case-studies` — Real India cybercrime cases
- `/admin` — Sentinel Core (protected)

## Quick Start
[Installation instructions]

## Environment Setup
[.env guide — never put API keys in VITE_ vars]

## Contributing
[Link to CONTRIBUTING.md]

## Security
[Link to SECURITY.md — report vulnerabilities]

## License
MIT
```

---

*Document generated for TRUSTLAYERLABS Cyber Awareness Platform*
*Architecture Version: 2.0 | Classification: Internal*
