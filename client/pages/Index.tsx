import { useMemo, useState, useCallback } from "react";
import { StatCard } from "@/components/app/StatCard";
import { ProgressStat } from "@/components/app/ProgressStat";
import { Trophy, Layers, AlertCircle } from "lucide-react";
import GameCanvas, { type GameState } from "@/components/app/GameCanvas";

export default function Index() {
  const [state, setState] = useState<GameState>({
    score: 0,
    level: 1,
    progress: 0,
    missed: 0,
    gameOver: false,
  });

  const onUpdate = useCallback((s: GameState) => setState(s), []);

  const missedText = useMemo(() => `${state.missed}/3`, [state.missed]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-accent/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 -top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,theme(colors.primary.DEFAULT)/0.12,transparent)]" />
        <div className="absolute -bottom-1/3 -right-1/3 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,theme(colors.accent.DEFAULT)/0.25,transparent)]" />
      </div>

      <main className="relative mx-auto grid w-full max-w-5xl gap-6 px-6 py-14 sm:gap-8 sm:py-20">
        <header className="flex flex-col items-start gap-3 sm:gap-4">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Space Cleanup: Cosmic Recycler
          </span>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            Live Game Status
          </h1>
          <p className="text-pretty max-w-prose text-muted-foreground">
            Arrow keys to move. Collect green resources, avoid red debris. Miss 3 resources and its game over. Press R to restart.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Score"
            value={<span className="tabular-nums">{state.score}</span>}
            hint="Keep the streak going"
            tone="primary"
            icon={<Trophy className="h-6 w-6" />}
          />
          <StatCard
            label="Level"
            value={<span className="tabular-nums">{state.level}</span>}
            hint="Difficulty scales gradually"
            icon={<Layers className="h-6 w-6" />}
          />
          <ProgressStat label="Progress" value={state.progress} />
          <StatCard
            label="Missed"
            value={<span className="tabular-nums">{missedText}</span>}
            hint="Three misses end the run"
            tone="danger"
            icon={<AlertCircle className="h-6 w-6" />}
          />
        </section>

        <section className="mt-4">
          <GameCanvas onUpdate={onUpdate} />
        </section>
      </main>
    </div>
  );
}
