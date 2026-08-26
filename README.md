# Fovea — Reading & Focus Training SaaS

Fovea is a mobile-first, high-performance web application designed for **speed reading, visual target tracking, and peripheral vision cognitive training**. Built with **React 18, TypeScript, Vite, and Tailwind CSS**, Fovea offers an elegant, distraction-free environment for cognitive training.

![Fovea Banner](https://img.shields.io/badge/Tech_Stack-React_18_|_TypeScript_5_|_Vite_5_|_Tailwind_3.4-14b8a6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)

---

## 🌟 Key Features

- **⚡ RSVP Speed Reader**: Tachistoscope-style Rapid Serial Visual Presentation engine with dynamic WPM controls (100–900 WPM), word chunking (1–4 words), and punctuation-aware timing pauses.
- **📚 Curated & Custom Reading**: Built-in library of scientific passages with comprehension quizzes, plus custom text pasting support.
- **🤖 AI-Powered Quiz & Vocabulary Generator**: Uses Anthropic Claude API to generate instant comprehension questions and word explanations for custom user text.
- **🎯 Saccade Sprint**: High-speed visual targeting drill tracking reaction time (in milliseconds) and accuracy across dynamic target positions.
- **🧩 Schulte Table**: Interactive peripheral vision matrix trainer (4x4, 5x5, 6x6) measuring completion speed and focal precision.
- **📈 Comprehensive Progress Analytics**: Interactive WPM and comprehension trend charts, level/XP progression system, daily streak tracking, and achievement badges.
- **📱 Mobile-First Responsive Design**: Desktop sidebar navigation paired with a mobile fixed bottom navigation bar, touch-optimised targets (min 44px), and iOS safe area inset support.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 18.3 + TypeScript 5.6 | Interactive component UI with strict type safety |
| **Build Tool** | Vite 5.4 | Lightning-fast HMR and production bundling |
| **Styling & Design** | Tailwind CSS 3.4 + PostCSS | Custom design tokens, dark graphite palette, custom fonts |
| **Icons** | Lucide React | Tree-shakable, consistent SVG icon set |
| **Typography** | Google Fonts (*Instrument Serif*, *Archivo*, *JetBrains Mono*) | Premium typography scale with fluid `clamp()` headliners |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/fovea.0.git
   cd fovea
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
fovea/
├── index.html              # SEO meta tags, Google Fonts, root mount
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # Strict TypeScript configuration
├── vite.config.ts          # Vite build plugin setup
├── tailwind.config.js      # Custom theme colors, shadows, and fonts
├── postcss.config.js       # PostCSS pipeline
├── README.md               # Documentation
├── .env.example            # Optional environment variables template
├── .gitignore              # Clean repository ignore patterns
│
└── src/
    ├── main.tsx             # Application entry mounting App into DOM
    ├── vite-env.d.ts        # Vite client types & icon definitions
    ├── App.tsx              # Main controller, router, & state management
    ├── index.css            # Tailwind directives & reusable UI components
    │
    ├── types/               # TypeScript interfaces & data models
    │   └── index.ts
    │
    ├── data/                # Static passage library & badge definitions
    │   ├── passages.ts
    │   └── badges.ts
    │
    ├── utils/               # Storage persistence & calculation algorithms
    │   ├── storage.ts
    │   └── helpers.ts
    │
    ├── services/            # Claude AI integration service
    │   └── aiService.ts
    │
    └── components/          # Reusable UI component modules
        ├── Disclaimer.tsx   # Cognitive training notice
        ├── Sidebar.tsx      # Desktop side navigation bar
        ├── BottomNav.tsx    # Mobile fixed bottom tab navigation
        ├── Onboarding.tsx   # Interactive setup wizard
        ├── Home.tsx         # Dashboard with level/XP & activity grid
        ├── RSVPReader.tsx   # Tachistoscope RSVP speed reading engine
        ├── Quiz.tsx         # Comprehension quiz renderer
        ├── ResultCard.tsx   # Session summary stats card
        ├── SaccadeTrainer.tsx # Visual target sprint trainer
        ├── SchulteTable.tsx # Peripheral vision grid matrix trainer
        ├── Progress.tsx     # Session trend charts & badge showcase
        ├── LineChart.tsx    # Custom inline SVG chart component
        ├── ProfileView.tsx  # Settings & data management
        └── WordHelperModal.tsx # AI vocabulary explainer modal
```

---

## ⚖️ Disclaimer

> [!WARNING]
> **For training and educational reference only.** Fovea is a reading and visual-attention exercise tool. It is not a medical device and does not diagnose, treat, or prevent any eye or neurological condition. Always consult a qualified eye-care or healthcare professional for diagnosis and medical guidance.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
