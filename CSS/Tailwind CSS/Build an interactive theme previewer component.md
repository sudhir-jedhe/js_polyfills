An interactive theme previewer lets design systems inspect, tweak, and test semantic design tokens in real time across multiple UI components (buttons, inputs, cards, badges, and alerts) while verifying WCAG accessibility.

---

### Complete Component Implementation (React + Tailwind CSS)

```tsx
import * as React from "react";

// --- Types & Default Presets ---
export interface ThemeTokens {
  id: string;
  name: string;
  primary: string;
  primaryForeground: string;
  surface: string;
  surfaceForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  radius: number; // in pixels
}

export const THEME_PRESETS: ThemeTokens[] = [
  {
    id: "indigo-slate",
    name: "Indigo Modern",
    primary: "#6366f1",
    primaryForeground: "#ffffff",
    surface: "#ffffff",
    surfaceForeground: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    border: "#e2e8f0",
    radius: 12,
  },
  {
    id: "emerald-forest",
    name: "Emerald Forest",
    primary: "#10b981",
    primaryForeground: "#ffffff",
    surface: "#f8fafc",
    surfaceForeground: "#022c22",
    muted: "#e6f4ea",
    mutedForeground: "#065f46",
    border: "#cbd5e1",
    radius: 16,
  },
  {
    id: "cyber-neon",
    name: "Cyber Obsidian",
    primary: "#38bdf8",
    primaryForeground: "#030712",
    surface: "#0f172a",
    surfaceForeground: "#f8fafc",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    border: "#334155",
    radius: 8,
  },
  {
    id: "rose-elegance",
    name: "Rose Glamour",
    primary: "#f43f5e",
    primaryForeground: "#ffffff",
    surface: "#fff1f2",
    surfaceForeground: "#4c0519",
    muted: "#ffe4e6",
    mutedForeground: "#9f1239",
    border: "#fecdd3",
    radius: 20,
  },
];

// --- WCAG Contrast Helper ---
function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split("").map((c) => c + c).join("") : cleanHex, 16);
  const rgb = [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrast(fg: string, bg: string): number {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}

// --- Main Interactive Previewer ---
export function ThemePreviewer() {
  const [tokens, setTokens] = React.useState<ThemeTokens>(THEME_PRESETS[0]);
  const [activeTab, setActiveTab] = React.useState<"components" | "tokens" | "css">("components");

  const buttonContrast = getContrast(tokens.primaryForeground, tokens.primary);
  const textContrast = getContrast(tokens.surfaceForeground, tokens.surface);

  const updateToken = (key: keyof ThemeTokens, value: any) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
      
      {/* LEFT COLUMN: Controls & Token Editor */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Theme Designer</h2>
          <p className="text-xs text-slate-500 mt-1">
            Customize semantic design tokens or select a curated preset.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setTokens(preset)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-2 ${
                tokens.name === preset.name
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
              {preset.name}
            </button>
          ))}
        </div>

        {/* Color Customizers */}
        <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Color Tokens</h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-medium">Primary</span>
              <input
                type="color"
                value={tokens.primary}
                onChange={(e) => updateToken("primary", e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-medium">Primary Text</span>
              <input
                type="color"
                value={tokens.primaryForeground}
                onChange={(e) => updateToken("primaryForeground", e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-medium">Surface</span>
              <input
                type="color"
                value={tokens.surface}
                onChange={(e) => updateToken("surface", e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="font-medium">Surface Text</span>
              <input
                type="color"
                value={tokens.surfaceForeground}
                onChange={(e) => updateToken("surfaceForeground", e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
              />
            </label>
          </div>

          {/* Border Radius Slider */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span>Border Radius</span>
              <span className="font-mono text-slate-500">{tokens.radius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="28"
              step="2"
              value={tokens.radius}
              onChange={(e) => updateToken("radius", Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Accessibility & Contrast Monitor */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Accessibility (WCAG 2.1)</h3>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Primary Button Contrast:</span>
            <div className="flex items-center gap-2 font-mono font-bold">
              <span>{buttonContrast}:1</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${buttonContrast >= 4.5 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-700"}`}>
                {buttonContrast >= 4.5 ? "Pass (AA)" : "Fail"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">Body Text on Surface:</span>
            <div className="flex items-center gap-2 font-mono font-bold">
              <span>{textContrast}:1</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${textContrast >= 4.5 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-700"}`}>
                {textContrast >= 4.5 ? "Pass (AA)" : "Fail"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Component Canvas */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Canvas Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Preview Canvas</span>
          <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            {(["components", "css"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "components" ? (
          /* Live Canvas Wrapper */
          <div
            className="p-8 rounded-3xl border transition-all duration-300 shadow-inner flex flex-col gap-6"
            style={{
              backgroundColor: tokens.surface,
              color: tokens.surfaceForeground,
              borderColor: tokens.border,
              borderRadius: `${tokens.radius * 1.5}px`,
            }}
          >
            {/* Header Block */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                  style={{
                    backgroundColor: tokens.muted,
                    color: tokens.mutedForeground,
                    borderRadius: `${tokens.radius / 2}px`,
                  }}
                >
                  Pro Enterprise
                </span>
                <h3 className="text-2xl font-extrabold mt-2">Analytics & Billing</h3>
                <p className="text-xs mt-1 opacity-75">
                  Real-time bandwidth usage and team permissions overview.
                </p>
              </div>

              {/* Status Badge */}
              <span
                className="text-xs font-bold px-3 py-1 border"
                style={{
                  borderColor: tokens.primary,
                  color: tokens.primary,
                  borderRadius: `${tokens.radius}px`,
                }}
              >
                Active
              </span>
            </div>

            {/* Input Form Preview */}
            <div className="space-y-2">
              <label className="text-xs font-semibold opacity-90">Workspace Domain</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="acme-corp.cloud.internal"
                  className="w-full text-xs px-3.5 py-2.5 outline-none border transition-all"
                  style={{
                    backgroundColor: tokens.surface,
                    color: tokens.surfaceForeground,
                    borderColor: tokens.border,
                    borderRadius: `${tokens.radius}px`,
                  }}
                />
                <button
                  className="px-4 py-2.5 text-xs font-bold shrink-0 transition-transform active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: tokens.primary,
                    color: tokens.primaryForeground,
                    borderRadius: `${tokens.radius}px`,
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Interactive Components Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                className="px-5 py-2.5 text-xs font-bold transition-transform active:scale-95 shadow-md"
                style={{
                  backgroundColor: tokens.primary,
                  color: tokens.primaryForeground,
                  borderRadius: `${tokens.radius}px`,
                }}
              >
                Upgrade Plan
              </button>

              <button
                className="px-4 py-2.5 text-xs font-semibold border transition-colors"
                style={{
                  borderColor: tokens.border,
                  backgroundColor: tokens.muted,
                  color: tokens.surfaceForeground,
                  borderRadius: `${tokens.radius}px`,
                }}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          /* CSS / Tailwind Export Tab */
          <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <p className="text-slate-500 font-sans mb-3 font-semibold">/* Tailwind CSS v4 Theme Tokens */</p>
            <pre>{`@theme {
  --color-primary: ${tokens.primary};
  --color-primary-fg: ${tokens.primaryForeground};
  --color-surface: ${tokens.surface};
  --color-surface-fg: ${tokens.surfaceForeground};
  --color-muted: ${tokens.muted};
  --color-muted-fg: ${tokens.mutedForeground};
  --color-border: ${tokens.border};
  --radius-custom: ${tokens.radius}px;
}`}</pre>
          </div>
        )}
      </div>

    </div>
  );
}

```

---
