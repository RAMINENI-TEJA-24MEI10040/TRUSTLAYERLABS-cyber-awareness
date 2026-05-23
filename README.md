
<div align="center">

# 🛡️ TRUSTLAYERLABS Cyber Awareness Platform

### Empowering Digital Safety Through AI-Powered Cybersecurity Education

![React](https://img.shields.io/badge/React-18+-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5+-646cff?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-ffca28?logo=firebase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

A modern cybersecurity awareness and scam prevention platform focused on educating users, detecting digital threats, and promoting safe online practices through AI-powered tools and interactive learning modules.

</div>

---

# 📚 Table of Contents

- Overview
- Features
- Technology Stack
- Project Structure
- Installation
- Environment Variables
- Development Commands
- Modules
- Architecture
- Contribution Workflow
- Future Improvements
- License
- Team

---

# 🌟 Overview

The **TRUSTLAYERLABS Cyber Awareness Platform** is a large-scale cybersecurity awareness ecosystem built to help users understand, identify, and defend against modern cyber threats.

The platform combines:
- AI-assisted scam analysis
- real-time threat awareness
- phishing simulations
- fraud prevention education
- cybersecurity reporting
- multilingual accessibility
- interactive learning systems

This project was developed as part of a cybersecurity internship initiative with focus on scalable architecture, modular design, and practical digital safety education.

---

# 🚀 Features

## 🔐 Core Security Modules

| Module | Description |
|--------|-------------|
| 🤖 AI Scam Analyzer | Detect suspicious text, messages, and scam patterns |
| 🧠 AI Guidance Assistant | Interactive cyber awareness assistant |
| 🌐 Threat Intelligence Feed | Live cyber threat awareness system |
| 🔗 URL Scanner | Analyze suspicious or phishing links |
| 🌍 IP Scanner | IP reputation and lookup tools |
| 💾 Breach Checker | Check exposure of credentials/data |
| 🎣 Phishing Simulator | Interactive phishing awareness training |

---

## 🇮🇳 India-Focused Awareness Modules

| Module | Description |
|--------|-------------|
| 📱 UPI Fraud Awareness | UPI scam prevention and education |
| 📜 Indian Cyber Laws | Information on Indian cyber regulations |
| 🚨 Reporting Dashboard | Cyber incident reporting guidance |
| 📲 QR Scam Awareness | QR fraud education and prevention |

---

## 🛠️ Advanced Features

- 🎭 Deepfake Awareness
- 📄 OCR/Tesseract Text Extraction
- 📑 PDF Export Support
- 🌍 English + Hindi Language Support
- 📈 Admin Analytics Dashboard
- ⚡ Real-Time Threat Ticker
- 🎨 Modern Responsive UI/UX
- 🔥 Firebase Authentication
- 📊 Threat Monitoring Dashboard

---

# 🧰 Technology Stack

| Technology | Purpose |
|------------|---------|
| React | Frontend Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Firebase | Authentication & Backend |
| React Router | Routing |
| Framer Motion | Animations |
| Recharts | Analytics Visualization |
| Tesseract.js | OCR Processing |
| jsPDF | PDF Export |
| i18next | Multilingual Support |

---

# 🏗️ Project Structure

```txt
TRUSTLAYERLABS-cyber-awareness/
│
├── CyberAwareness-main/
│   ├── src/
│   │   ├── ai-assistant/
│   │   ├── components/
│   │   ├── firebase/
│   │   ├── i18n/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── analyzer/
│   │   │   ├── auth/
│   │   │   ├── breach-checker/
│   │   │   ├── deepfake/
│   │   │   ├── phishing/
│   │   │   ├── qr/
│   │   │   ├── reporting/
│   │   │   ├── threat-feed/
│   │   │   ├── upi/
│   │   │   ├── url-scanner/
│   │   │   └── ip-scanner/
│   │   │
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── package.json
└── README.md
````

---

# ⚙️ Installation

## Prerequisites

* Node.js 18+
* npm 9+
* Git

---

## Clone Repository

```bash
git clone <repository-url>
cd TRUSTLAYERLABS-cyber-awareness
```

---

## Install Dependencies

```bash
npm --prefix CyberAwareness-main install
```

---

## Start Development Server

```bash
npm run dev
```

The application will start on:

```txt
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside:

```txt
CyberAwareness-main/
```

Example:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_VIRUSTOTAL_API_KEY=
```

---

# 💻 Development Commands

Run commands from repository root.

| Command           | Description              |
| ----------------- | ------------------------ |
| npm run dev       | Start development server |
| npm run build     | Production build         |
| npm run preview   | Preview production build |
| npm run lint      | Run ESLint               |
| npm run typecheck | TypeScript checking      |

---

# 🧠 Platform Modules

## AI & Analysis

* AI Scam Analyzer
* Threat Intelligence
* Breach Checker
* OCR Analysis

## Awareness & Training

* Phishing Simulator
* QR Scam Awareness
* Deepfake Awareness
* UPI Fraud Awareness

## Security Utilities

* URL Scanner
* IP Scanner
* Reporting Dashboard

## Administration

* Admin Analytics Dashboard
* Threat Monitoring
* User Awareness Tracking

---

# 🏛️ Architecture Overview

The platform follows a modular React architecture with reusable components and centralized services.

### Key Architectural Concepts

* Component-based design
* Context-based theme management
* Route-based module separation
* Firebase backend integration
* Multilingual i18n support
* Reusable analytics and scanner services

---

# 🤝 Contribution Workflow

## Sync Latest Changes

```bash
git checkout main
git pull
```

---

## Create Feature Branch

```bash
git checkout -b feature/feature-name
```

---

## Verify Before Commit

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Commit & Push

```bash
git add .
git commit -m "feat: short description"
git push origin feature/feature-name
```

---

# 🚧 Future Improvements

* Mobile application support
* Advanced AI threat analysis
* Community threat reporting
* Browser extension integration
* Additional regional language support
* Enhanced analytics and monitoring
* Expanded awareness simulations

---

# 📄 License

This project is licensed under the MIT License.

---

# 👥 Team

### Developed by TRUSTLAYERLABS Team

Built with ❤️ for cybersecurity awareness and digital safety.

---

```
```
