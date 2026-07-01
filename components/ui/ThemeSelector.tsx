"use client";

import { Tooltip } from "@/components/ui/Tooltip";
import { type Theme, useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const options: Array<{ theme: Theme; label: string; className: string }> = [
  { theme: "obsidian", label: "Obsidian", className: "bg-[#5B6EF5]" },
  { theme: "midnight", label: "Midnight", className: "bg-[#6B7FFF]" },
  { theme: "legion-red", label: "Legion Red", className: "bg-[#DC2626]" },
  { theme: "gold-commander", label: "Gold Commander", className: "bg-[#C9A84C]" },
  { theme: "light", label: "Light", className: "border-2 border-[#4F5FE0] bg-white" }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mb-4 rounded-md border border-[var(--border-ghost)] bg-[var(--bg-surface)]/80 p-3 backdrop-blur">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">Appearance</p>
      <div className="flex items-center gap-3">
        {options.map((option) => (
          <Tooltip key={option.theme} label={option.label}>
            <button
              type="button"
              aria-label={`Use ${option.label} theme`}
              onClick={() => setTheme(option.theme)}
              className={cn(
                "h-5 w-5 rounded-full border border-white/20 transition-transform duration-150 hover:scale-[1.2]",
                option.className,
                theme === option.theme && "outline outline-2 outline-offset-2 outline-white"
              )}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
