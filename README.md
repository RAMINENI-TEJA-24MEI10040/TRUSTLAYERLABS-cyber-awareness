# TRUSTLAYERLABS Cyber Awareness

This repository contains the Cyber Awareness web app.

## Project Structure

- `package.json` (root): convenience scripts that run commands inside `CyberAwareness-main`.
- `CyberAwareness-main/`: actual Vite + React + TypeScript application.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Git

## Getting Started (Local Setup)

1. Clone the repository:

```bash
git clone <your-repo-url>
cd TRUSTLAYERLABS-cyber-awareness
```

2. Install dependencies for the app:

```bash
npm --prefix CyberAwareness-main install
```

3. Start the development server (from repo root):

```bash
npm run dev
```

4. Open the URL shown in terminal (usually `http://localhost:5173`).

## Useful Commands

Run these from the repository root:

```bash
# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint the project
npm run lint

# Type-check TypeScript
npm run typecheck
```

## Collaboration Workflow

1. Sync latest changes:

```bash
git checkout main
git pull
```


3. Make changes and verify before pushing:

```bash
npm run lint
npm run typecheck
npm run build
```

4. Commit and push:

```bash
git add .
git commit -m "feat: short description"
git push -u origin feature/short-description
```

## Troubleshooting

- If dependencies look broken, reinstall:

```bash
# PowerShell (Windows)
Remove-Item -Recurse -Force CyberAwareness-main/node_modules
Remove-Item -Force CyberAwareness-main/package-lock.json

# Reinstall
npm --prefix CyberAwareness-main install
```

- If port `5173` is busy, Vite will suggest another available port automatically.