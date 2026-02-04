# Mouse Framework 🖱️

A modern human–AI collaboration interface that teaches users when to rely on an AI agent and when not to, with a strong focus on **high-stakes vs low-stakes decisions**, **reversibility**, **trust calibration**, and **user control**.

![Framework Preview](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.3-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan) ![d3-force](https://img.shields.io/badge/d3--force-Integrated-orange) ![SelfCheckGPT](https://img.shields.io/badge/SelfCheckGPT-Integrated-violet)

> Named "Mouse Framework" for the visual node-based ("mouse dots") task visualization

## 🌐 Live Demo

**Try it now:** 👉 [https://growingpenguin.github.io/mouse-framework/](https://growingpenguin.github.io/mouse-framework/)

No installation required! Choose from 3 demo scenarios or use Gemini AI.

---

## 🎯 Purpose

This interface treats AI as a **framework builder**, not just a rule-based executor. The AI helps users construct, edit, and control a process — and everything is reversible.

### Key Principles
- **Low-stakes tasks** (reversible, informational) → Safe to delegate to AI
- **High-stakes tasks** (irreversible, sensitive, critical) → Require human judgment
- **Trust calibration** → SelfCheckGPT detects AI uncertainty to prevent over-trust
- **User maintains control** at every step

---

## ✨ Features

### 🎨 Force-Directed Layout (New!)

Task nodes use **d3-force** with Fruchterman–Reingold style physics:

| Force | Purpose |
|-------|---------|
| `forceManyBody` | Nodes repel each other |
| `forceCollide` | Prevents overlap with collision detection |
| `forceLink` | Connected nodes stay closer |
| `forceCenter` | Keeps graph centered |
| `forceX/Y` | Attracts to optimal grid positions |

**Dynamic behavior:**
- Add a new task → Simulation re-runs automatically
- Nodes spread out smoothly with no overlaps
- Connection lines update in real-time
- Works for 1-10+ nodes

### 📋 3 Demo Scenarios (No API Key Required!)

| Scenario | Domain | Tasks |
|----------|--------|-------|
| 🏥 **Healthcare** | Patient report handling | Summarize → Access Data → Interpret → Notify |
| 💰 **Finance** | Payroll processing | Calculate → Review → Approve → Transfer |
| 🖥️ **IT/DevOps** | Production deployment | Test → Build → Deploy → Update Firewall |

### 🧠 SelfCheckGPT Integration

Detects AI hallucination by measuring consistency across samples:
- **High consistency** → Likely factual, safe to trust
- **Low consistency** → Potential hallucination, human review required

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

Open [http://localhost:5173/mouse-framework/](http://localhost:5173/mouse-framework/) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🤖 AI Integration Options

### Option 1: Demo Mode (No Setup Required!)
Click any of the **3 demo scenario cards** to explore pre-built examples:
- Healthcare, Finance, or IT/DevOps workflows
- See how tasks are categorized as high/low stakes
- Full interactive experience without API keys

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

- Choose from **3 demo scenarios** or enter custom text
- AI decomposes the request into task nodes
- **Force-directed layout** positions nodes automatically
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
- ➕ **Add New Task** - Creates node with force simulation

**Dynamic connections:**
- Lines auto-generated based on task count
- Connection count shown in bottom-right corner

---

### Screen 3: Delegation & Stakes Rules
**"Who should handle each part?"**

This screen helps users decide which tasks can be safely delegated to AI and which require human judgment. It provides **two different lenses**:

#### View 1: Stakes-Based (Traditional)

Simple rule-based delegation:
| Task Type | Decision |
|-----------|----------|
| 🟢 Low-stakes | ✅ Delegate to AI |
| 🔴 High-stakes | ❌ Human decision required |

High-stakes criteria:
| Risk Type | Meaning |
|-----------|---------|
| `irreversible` | Cannot be undone (emails, payments) |
| `legal` | Legal/medical/compliance impact |
| `security` | Security implications |
| `company-wide` | Affects entire organization |

#### View 2: SelfCheckGPT (Research-Based)

This view applies the **SelfCheckGPT paper's** core insight:

> *"Larger models often sound more confident, causing people to over-generalize from a few good answers and trust them too much. This leads to over-deployment and more unnoticed mistakes."*

**How SelfCheckGPT detects hallucination:**

```
┌─────────────────────────────────────────────────────────┐
│   Query: "What should we do with this patient data?"    │
├─────────────────────────────────────────────────────────┤
│   Sample 1: "Access via secure portal"                  │
│   Sample 2: "Retrieve with authorization"               │
│   Sample 3: "Requires HIPAA compliance review"          │
│                                                         │
│   ⚠️ Samples DIVERGE → LOW CONFIDENCE → Human required  │
└─────────────────────────────────────────────────────────┘
```

**The algorithm:**
1. Ask the AI the same question **multiple times** (stochastic sampling)
2. Compare the answers for **consistency**
3. **High agreement** → AI probably knows the answer (factual)
4. **Answers contradict** → AI is likely hallucinating (unreliable)

---

##### SelfCheckGPT Page Layout

The SelfCheckGPT view has **4 main sections**:

**Section 1: Header with Research Toggle**
```
┌──────────────────────────────────────────────────────────┐
│  🧠 SelfCheckGPT Analysis                                │
│                                                          │
│  Detecting AI uncertainty by comparing multiple          │
│  response samples. High disagreement = hallucination.    │
│                                                          │
│  [Show research insight ▼]  ← Click to see paper details │
└──────────────────────────────────────────────────────────┘
```

When expanded, shows the core research principle:
- **Problem:** Larger models sound confident → over-trust
- **Solution:** SelfCheckGPT detects inconsistency
- **Key Insight:** Success = calibrated trust, not smart answers

---

**Section 2: Consistency Summary (3-column dashboard)**

| Metric | What It Shows | Example |
|--------|---------------|---------|
| **Overall Confidence** | Average across all tasks | 74% |
| **High Agreement** | # of tasks where AI is consistent | 2 |
| **Low Agreement** | # of tasks where AI contradicts itself | 0 |

This gives you a **bird's-eye view** before diving into individual tasks.

---

**Section 3: Recommendation Box (color-coded)**

| Status | Color | Message |
|--------|-------|---------|
| **LOW RISK** | 🟢 Green | "All tasks show high consistency. Safe for delegation." |
| **MIXED** | 🟡 Yellow | "Some tasks reliable, others uncertain. Review individually." |
| **CRITICAL** | 🔴 Red | "Most tasks show high uncertainty. Avoid delegation." |

Below the status, a **trust calibration message** appears:
> *"Success depends on calibrated trust, not smarter-sounding answers. Check each task."*

---

**Section 4: Per-Task Consistency Analysis (expandable cards)**

Each task gets a card showing:

```
┌──────────────────────────────────────────────────────────┐
│  ✓ Calculate payroll                           89%      │
│    🟢 Low-stakes                          HIGH agreement │
│                                                    [▼]   │
└──────────────────────────────────────────────────────────┘
```

Click to expand and see:
- **Sample Responses** — Simulated AI outputs (3 samples)
- **Warning** — If disagreement detected
- **Recommendation** — What action to take

Example expanded card:
```
┌──────────────────────────────────────────────────────────┐
│  ⚠️ Medical interpretation                     52%      │
│    🔴 High-stakes                           LOW agreement │
├──────────────────────────────────────────────────────────┤
│  Sample responses (simulated):                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Sample 1: "Requires legal review per Section 5.2" │  │
│  │ Sample 2: "May need compliance under Article 7"   │  │
│  │ Sample 3: "Legal implications unclear, consult"   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ⚠️ WARNING: High disagreement detected! AI responses    │
│     are inconsistent. Do NOT delegate without review.    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔴 DO NOT DELEGATE: High uncertainty detected.    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

##### Why Each Section Matters

| Section | Purpose | User Need |
|---------|---------|-----------|
| **Header** | Explain what SelfCheckGPT does | Understanding |
| **Consistency Summary** | Quick overview of all tasks | Speed |
| **Recommendation Box** | Overall action to take | Decision |
| **Per-Task Analysis** | Deep dive into each task | Precision |

---

**Confidence calculation (simplified):**
```typescript
let confidence = 0.85;  // Base confidence
if (task.stakes === 'high') confidence -= 0.15;
if (task.riskTypes?.includes('legal')) confidence -= 0.10;
if (task.riskTypes?.includes('security')) confidence -= 0.08;
// Result: Legal high-stakes task → ~52% confidence → "HUMAN REVIEW REQUIRED"
```

**Why both views matter:**

| View | Strength | Weakness |
|------|----------|----------|
| Stakes-Based | Simple, predictable | Ignores AI's actual reliability |
| SelfCheckGPT | Detects AI uncertainty | More complex |

Together they answer:
1. **Is this task risky?** (Stakes-Based)
2. **Can the AI reliably handle it?** (SelfCheckGPT)

**Key takeaway displayed in UI:**
> *"SelfCheckGPT enforces caution when AI responses disagree — because in high-stakes AI, success depends on calibrated human trust, not smarter-sounding answers."*

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
│   │   ├── TaskCanvas.tsx         # Force-directed layout canvas
│   │   ├── TaskInput.tsx          # Screen 1: Input + Demo scenarios
│   │   ├── FrameworkView.tsx      # Screen 2: Editable Framework
│   │   ├── DelegationRules.tsx    # Screen 3: Stakes + SelfCheck
│   │   ├── SelfCheckPanel.tsx     # SelfCheckGPT analysis UI
│   │   ├── ReversibilityCheckpoints.tsx # Screen 4: Safety
│   │   └── LearningOutcome.tsx    # Screen 5: Summary
│   ├── lib/
│   │   ├── gemini.ts              # Gemini AI integration
│   │   ├── selfcheck.ts           # SelfCheckGPT logic
│   │   └── useForceLayout.ts      # d3-force simulation hook
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Pages auto-deploy
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
| **d3-force** | Force-directed graph layout |
| Google Gemini AI | Task decomposition |
| SelfCheckGPT | Hallucination detection |
| Lucide React | Icons |
| Radix UI | Accessible primitives |

---

## 🔬 Force Layout Algorithm

The force simulation uses d3-force with these parameters:

```typescript
forceSimulation(nodes)
  .force('charge', forceManyBody().strength(-300 - nodes.length * 20))
  .force('collide', forceCollide().radius(85).strength(1))
  .force('link', forceLink(connections).distance(150))
  .force('center', forceCenter(width/2, height/2))
  .force('x', forceX(targetX).strength(0.2))
  .force('y', forceY(targetY).strength(0.2))
```

**Dynamic grid positioning:**
| Nodes | Layout |
|-------|--------|
| 1 | Centered |
| 2 | Side by side |
| 3 | Triangle |
| 4 | 2×2 grid |
| 5 | 2-2-1 pyramid |
| 6+ | √n × √n grid |

---

## 📝 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Visual Stakes** | Green (safe) vs Red (danger) color coding |
| **Trust Calibration** | SelfCheckGPT confidence scores |
| **User Control** | Editable framework, not fixed rules |
| **Reversibility** | Undo, rollback, preview at every step |
| **Force Physics** | Nodes spread naturally, no overlaps |
| **Education** | Teaching users over time |

---

## 📚 Research References

- **SelfCheckGPT Paper:** Manakul, P., Liusie, A., & Gales, M. J. F. (2023). *SELFCHECKGPT: Zero-Resource Black-Box Hallucination Detection for Generative Large Language Models.* University of Cambridge. [arXiv:2303.08896](https://arxiv.org/abs/2303.08896)

- **Force-Directed Graphs:** Fruchterman, T. M. J., & Reingold, E. M. (1991). *Graph Drawing by Force-Directed Placement.* Software: Practice and Experience.

- **d3-force:** [https://github.com/d3/d3-force](https://github.com/d3/d3-force)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes (`npm run build`)
4. Merge to develop (`git checkout develop && git merge feature/amazing-feature`)
5. Test on develop (`npm run build`)
6. Merge to main (`git checkout main && git merge develop`)
7. Push and auto-deploy!

### Branch Strategy
```
feature/* → develop → main → GitHub Pages
```

---

## 📄 License

This project is for educational purposes as part of an AI Agents class project.

---

## 🙏 Acknowledgments

- SelfCheckGPT research by University of Cambridge
- Force-directed layout powered by [d3-force](https://github.com/d3/d3-force)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspired by human-AI collaboration best practices
