# Mouse Framework 🖱️

A modern human–AI collaboration interface that teaches users when to rely on an AI agent and when not to, with a strong focus on **high-stakes vs low-stakes decisions**, **reversibility**, **trust calibration**, and **user control**.

![Framework Preview](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.3-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan) ![SelfCheckGPT](https://img.shields.io/badge/SelfCheckGPT-Integrated-violet)

> Named "Mouse Framework" for the visual node-based ("mouse dots") task visualization

## 🎯 Purpose

This interface treats AI as a **framework builder**, not just a rule-based executor. The AI helps users construct, edit, and control a process — and everything is reversible.

### Key Principles
- **Low-stakes tasks** (reversible, informational) → Safe to delegate to AI
- **High-stakes tasks** (irreversible, sensitive, critical) → Require human judgment
- **Trust calibration** → SelfCheckGPT detects AI uncertainty to prevent over-trust
- **User maintains control** at every step

---

## 🧠 SelfCheckGPT Integration

This project integrates concepts from the research paper:

> **"SELFCHECKGPT: Zero-Resource Black-Box Hallucination Detection for Generative Large Language Models"**  
> Manakul, Liusie, Gales (2023) - University of Cambridge

### The Problem
In high-stakes settings, larger models often sound more confident, causing people to over-generalize from a few good answers and trust them too much. This leads to over-deployment and more unnoticed mistakes.

### The Solution
SelfCheckGPT detects when AI responses are inconsistent across multiple samples:
- **High consistency** → Likely factual, safe to trust
- **Low consistency** → Potential hallucination, human review required

### Key Insight
> *"In high-stakes AI, success depends on calibrated human trust, not smarter-sounding answers."*

### How It Works
1. Generate N stochastic samples from LLM
2. Compare consistency between samples
3. High disagreement = potential hallucination = WARNING
4. High-stakes + low confidence = DO NOT DELEGATE

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/growingpenguin/mouse-framework.git
cd mouse-framework

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🤖 AI Integration Options

### Option 1: Demo Mode (No Setup Required!)
Just click **"Try Demo (No API Key)"** on the first screen to explore with pre-built examples.

### Option 2: Gemini AI (Free!)

Get intelligent task decomposition with Google's free Gemini API:

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in and click **"Create API Key"**
3. Set up your environment:

```bash
cp .env.example .env
# Edit .env and add: VITE_GEMINI_API_KEY=your_key_here
```

**Free Tier Limits:**
| Resource | Limit |
|----------|-------|
| Requests per minute | 15 RPM |
| Requests per day | 1,500 RPD |
| Tokens per month | 1,000,000 |

---

## 📱 Application Flow

The application consists of **5 connected screens**:

### Screen 1: Task Input & Decomposition
**"What do you want to do?"**

- Enter a high-level request or click **"Try Demo"**
- AI decomposes the request into task nodes
- Visual framework shows:
  - 🟢 **Green** = Low-stakes (reversible)
  - 🔴 **Red** = High-stakes (irreversible)

---

### Screen 2: Framework View (Editable Process)
**"Your process framework"**

Interactive controls:
- ✏️ **Edit Description** - Rename any task
- 🗑️ **Remove** - Delete tasks from workflow
- ⬆️⬇️ **Reorder** - Move tasks up/down
- 🔄 **Toggle Stakes** - Change high/low stakes
- ➕ **Add New Task** - Create custom tasks

---

### Screen 3: Delegation & Stakes Rules
**"Who should handle each part?"**

Two analysis views:

| View | Description |
|------|-------------|
| **Stakes-Based** | Traditional high/low stakes delegation |
| **SelfCheckGPT** | AI confidence analysis with consistency scores |

SelfCheckGPT features:
- 📊 Per-task confidence percentages
- ⚠️ Warnings for low-consistency tasks
- 📈 Overall consistency summary
- 💡 Research insight toggle

---

### Screen 4: Reversibility & Checkpoints
**"Control & safety"**

Interactive controls:
- **Undo** - Click to undo last action
- **Rollback** - View history, restore any state
- **Preview** - See pending changes before commit

Mandatory checkpoints:
- 📤 Sending data → Approve
- 💳 Making payments → Approve
- 🔐 Security changes → Approve

Progress bar shows checkpoint completion.

---

### Screen 5: Learning & User Improvement
**"What you learned"**

- Summary of delegated vs human-controlled tasks
- Key takeaways for future decisions
- Collaboration statistics
- Core principle: "AI helps improve your process, not replace your decisions."

---

## 🏗️ Project Structure

```
mouse-framework/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── TaskNode.tsx           # Task node (green/red dots)
│   │   ├── TaskInput.tsx          # Screen 1: Input
│   │   ├── FrameworkView.tsx      # Screen 2: Editable Framework
│   │   ├── DelegationRules.tsx    # Screen 3: Stakes + SelfCheck
│   │   ├── SelfCheckPanel.tsx     # SelfCheckGPT analysis UI
│   │   ├── ReversibilityCheckpoints.tsx # Screen 4: Safety
│   │   └── LearningOutcome.tsx    # Screen 5: Summary
│   ├── lib/
│   │   ├── gemini.ts              # Gemini AI integration
│   │   └── selfcheck.ts           # SelfCheckGPT logic
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS 4 | Styling |
| Google Gemini AI | Task decomposition |
| SelfCheckGPT | Hallucination detection |
| Lucide React | Icons |
| Radix UI | Accessible primitives |

---

## 📝 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Visual Stakes** | Green (safe) vs Red (danger) color coding |
| **Trust Calibration** | SelfCheckGPT confidence scores |
| **User Control** | Editable framework, not fixed rules |
| **Reversibility** | Undo, rollback, preview at every step |
| **Education** | Teaching users over time |
| **Enterprise-grade** | Professional, calm UI |

---

## 📚 Research References

- **SelfCheckGPT Paper:** Manakul, P., Liusie, A., & Gales, M. J. F. (2023). *SELFCHECKGPT: Zero-Resource Black-Box Hallucination Detection for Generative Large Language Models.* University of Cambridge. [arXiv:2303.08896](https://arxiv.org/abs/2303.08896)

- **GitHub:** [potsawee/selfcheckgpt](https://github.com/potsawee/selfcheckgpt)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes as part of an AI Agents class project.

---

## 🙏 Acknowledgments

- SelfCheckGPT research by University of Cambridge
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspired by human-AI collaboration best practices
