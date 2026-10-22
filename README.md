# ⚡ CSE EEC Interactive Virtual Laboratory & Bilingual Simulator

[![Live Production](https://img.shields.io/badge/Live%20Platform-eec--explanation.vercel.app-success?style=for-the-badge&logo=vercel)](https://eec-explanation.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=githubactions)](https://github.com/Nur-Hasan-Jisan/eec-explanation/actions)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

A state-of-the-art interactive virtual laboratory and semiconductor physics simulator for Computer Science & Engineering (CSE) 1st-Year Electrical Engineering & Circuit Theory (EEC) courses.

---

## 🌟 Key Features

- **27 Fully Implemented Interactive Labs**: Covering Topics 1 through 27 (Covalent crystal lattices, PN junctions, Zener diodes, Rectifiers, Clipper/Clampers, BJT configurations, JFET/MOSFET characteristics, Operational Amplifiers, Logic Gates, and more).
- **Component Creator & Customization Workbench**: Custom workbenches specifically tailored to each lab, allowing students and educators to tweak physical parameters, introduce custom components, toggle real-time signal generators, and inspect live voltage/current responses.
- **Fluent Bilingual Translation (English ⇄ Bangla)**: Instantaneous, deep translation across every topic, formula explanation, parameter label, and workbench button.
- **Intuitive Concepts & Core Physics Explanations**: Every core equation includes intuitive, accessible explanations alongside rigorous physical derivations.
- **Dark & Light Mode**: Instant theme switching with high-contrast laboratory aesthetics and smooth transitions.
- **100% Client-Side Real-Time Physics**: Zero external server runtime requirement for simulations—zero latency, highly responsive 60 FPS Canvas and SVG animations.
- **Vercel-Ready**: Preconfigured with `vercel.json` SPA rewrites and optimized Rollup code splitting (sub-400kB bundles).

---

## 🚀 One-Click Deployment to Vercel

The project is structured to deploy out-of-the-box on Vercel with zero manual configuration.

### Option 1: Import via Vercel Dashboard (Recommended)

1. **Push this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and log in.
3. Import your GitHub repository.
4. **Vercel will automatically detect the settings from `vercel.json`**:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend-react && npm install && npm run build` (or `npm run build` from root)
   - **Output Directory**: `frontend-react/dist`
5. Click **Deploy**. Your app will be live with a production URL in less than 60 seconds!

---

### Option 2: Deploying via Vercel CLI

If you have the [Vercel CLI](https://vercel.com/docs/cli) installed:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# From the root directory:
vercel

# For production deployment:
vercel --prod
```

---

### Option 3: Deploying Subfolder Directly (`frontend-react`)

If you prefer pointing Vercel directly to the frontend folder:
1. In Vercel Project Settings, set **Root Directory** to `frontend-react`.
2. The included `frontend-react/vercel.json` will automatically configure:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **SPA Rewrites**: `/(.*)` → `/index.html`

---

## 💻 Local Development

To run the application locally:

### From the Root Directory:
```bash
# Start Vite development server
npm run dev

# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Or Directly Inside `frontend-react`:
```bash
cd frontend-react
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Repository Structure

```
eec-fullstack-platform/
├── .gitignore                    # Root gitignore (excludes node_modules, build outputs, OS files)
├── package.json                  # Root npm scripts delegating build/dev to frontend-react
├── vercel.json                   # Root Vercel config with SPA rewrites & build hooks
├── README.md                     # Project documentation & deployment manual
├── frontend-react/               # Production React 18 + Vite Web Application
│   ├── .gitignore                # Frontend-specific gitignore
│   ├── index.html                # HTML5 entry with SEO tags & Google Fonts
│   ├── package.json              # Frontend dependencies (React, Vite, Lucide, Tailwind)
│   ├── vercel.json               # Frontend-level Vercel config
│   ├── vite.config.js            # Vite configuration with Rollup chunk splitting
│   ├── tailwind.config.js        # Tailwind design configuration
│   └── src/
│       ├── App.jsx               # Main stateful application shell
│       ├── index.css             # Design tokens, gradients, animations
│       ├── main.jsx              # React DOM entry point
│       ├── components/           # 27+ modular simulators, workbenches & canvas engines
│       ├── data/                 # Comprehensive bilingual curriculum dataset (Topics 1-27)
│       └── utils/                # Mathematical solvers & helper functions
├── backend-java/                 # Reference Java Spring backend service
└── backend-python/               # Reference Python numerical SPICE solver
```

---

## 🛡️ License

Developed for Computer Science & Engineering undergraduate curricula. All rights reserved.
