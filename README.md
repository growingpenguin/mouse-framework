# Mouse Framework 🖱️

A modern human–AI collaboration interface that teaches users when to rely on an AI agent and when not to, with a strong focus on **high-stakes vs low-stakes decisions**, **reversibility**, and **user control**.

![Framework Preview](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-6.3-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-cyan)

> Named "Mouse Framework" for the visual node-based ("mouse dots") task visualization

## 🎯 Purpose

This interface treats AI as a **framework builder**, not just a rule-based executor. The AI helps users construct, edit, and control a process — and everything is reversible.

### Key Principles
- **Low-stakes tasks** (reversible, informational) → Safe to delegate to AI
- **High-stakes tasks** (irreversible, sensitive, critical) → Require human judgment
- **User maintains control** at every step

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

## 📱 Application Flow

The application consists of **5 connected screens** that guide users through understanding AI delegation:

### Screen 1: Task Input & Decomposition
**"What do you want to do?"**

- Enter a high-level request (e.g., "Handle this patient report and notify the legal team")
- AI automatically decomposes the request into multiple task nodes
- Visual framework shows connected dots:
  - 🟢 **Green** = Low-stakes (reversible, informational)
  - 🔴 **Red** = High-stakes (irreversible, sensitive)
- Warning: "High-stakes tasks should not be delegated to AI"

➡️ Click **"Decompose Task"** to continue

---

### Screen 2: Framework View (Editable Process)
**"Your process framework"**

- View the task workflow as connected nodes
- Click any task node to:
  - Edit its description
  - Remove it from the workflow
  - Merge with another task
  - Split into subtasks
- Message: "The AI proposes a framework. You control it."

➡️ Click **"Continue to Delegation"** to continue

---

### Screen 3: Delegation & Stakes Rules
**"Who should handle each part?"**

- Each task shows its delegation status:
  - ✅ Low-stakes → "Delegate to AI" (enabled toggle)
  - ❌ High-stakes → "Human decision required" (disabled toggle)
- Clear reasoning icons for high-stakes:
  - 🔒 Irreversible action
  - ⚖️ Legal/medical/security impact
  - 🏢 Company-wide risk
- Rule: "AI can assist high-stakes tasks, but should not decide them."

➡️ Click **"Continue to Reversibility"** to continue

---

### Screen 4: Reversibility & Checkpoints
**"Control & safety"**

- Reversibility controls:
  - **Undo** - Reverse any action immediately
  - **Rollback** - Return to any previous state
  - **Preview** - Review changes before commit
- Mandatory checkpoints before:
  - 📤 Sending data
  - 💳 Making payments
  - 🔐 Changing security settings
- Message: "Delegation never removes your control."

➡️ Click **"Continue to Learning Summary"** to continue

---

### Screen 5: Learning & User Improvement
**"What you learned"**

- Summary of safely delegated tasks vs human-controlled tasks
- Key takeaways:
  1. Low-stakes, reversible tasks are safe to delegate
  2. High-stakes, irreversible tasks require human judgment
  3. AI assists, but you maintain control
- Collaboration statistics
- Core principle: "The AI helps you improve your process, not replace your decisions."

➡️ Click **"Try Another Workflow"** to restart

---

## 🏗️ Project Structure

```
ai-task-delegation-framework/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── TaskNode.tsx     # Task node component (green/red dots)
│   │   ├── TaskInput.tsx    # Screen 1: Input & Decomposition
│   │   ├── FrameworkView.tsx # Screen 2: Editable Framework
│   │   ├── DelegationRules.tsx # Screen 3: Stakes & Delegation
│   │   ├── ReversibilityCheckpoints.tsx # Screen 4: Safety
│   │   └── LearningOutcome.tsx # Screen 5: Summary
│   ├── styles/
│   │   ├── tailwind.css     # Tailwind imports
│   │   ├── fonts.css        # Font configuration
│   │   ├── index.css        # Main styles
│   │   └── theme.css        # Theme variables
│   ├── App.tsx              # Main app with screen navigation
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Icons
- **Radix UI** - Accessible UI primitives

---

## 📝 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Visual Stakes** | Green (safe) vs Red (danger) color coding |
| **User Control** | Editable framework, not fixed rules |
| **Reversibility** | Undo, rollback, preview at every step |
| **Education** | Teaching users over time, not just blocking |
| **Enterprise-grade** | Professional, calm, instructional UI |

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

- Design inspired by human-AI collaboration best practices
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

