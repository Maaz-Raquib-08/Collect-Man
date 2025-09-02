import { useState, useCallback, useEffect } from "react";
import GameCanvas, { type GameState } from "@/components/app/GameCanvas";
import StartBackground from "@/components/app/StartBackground";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Index() {
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<GameState>({
    score: 0,
    level: 1,
    progress: 0,
    missed: 0,
    gameOver: false,
  });

  const onUpdate = useCallback((s: GameState) => setState(s), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started && (e.key === "Enter" || e.key === " ")) setStarted(true);
      if (started && e.key === "Escape") setStarted(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  const livesLeft = Math.max(0, 3 - state.missed);

  return (
    <div className={started ? "relative min-h-screen bg-gradient-to-br from-white to-accent/40" : "relative min-h-screen bg-[linear-gradient(180deg,#0b1740_0%,#09122e_100%)]"}>
      {started ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/3 -top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,theme(colors.primary.DEFAULT)/0.12,transparent)]" />
          <div className="absolute -bottom-1/3 -right-1/3 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,theme(colors.accent.DEFAULT)/0.25,transparent)]" />
        </div>
      ) : null}

      <main className="relative mx-auto w-full max-w-5xl px-6 py-20">
        {!started ? (
          <>
            <StartBackground />
            <div className="mx-auto grid max-w-xl place-items-center">
              <div
                className="w-full rounded-3xl border border-cyan-300/60 bg-[linear-gradient(180deg,rgba(59,130,246,0.2),rgba(12,22,56,0.45))] p-8 text-center shadow-[0_0_40px_rgba(34,211,238,0.6)] ring-1 ring-cyan-300/40 backdrop-blur-sm"
                style={{ fontFamily: '"Press Start 2P", monospace' }}
              >
                <div className="text-cyan-200 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]">START</div>
                <div className="mt-3 text-3xl text-cyan-50 drop-shadow-[0_0_14px_rgba(34,211,238,0.8)]">NEW GAME</div>
                <button className="mt-6 inline-block rounded-md border border-black/20 bg-orange-400 px-5 py-2 text-black shadow-[0_0_16px_rgba(251,146,60,0.9)] hover:bg-orange-300" onClick={() => setStarted(true)}>
                  PLAY
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="relative flex flex-col items-center gap-4">
            <div className="pointer-events-none absolute left-1/2 top-2 z-10 w-full max-w-3xl -translate-x-1/2 px-2">
              <div className="flex items-center justify-between">
                <div className="pointer-events-auto flex items-center gap-2" aria-label="Lives">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={i < livesLeft ? "h-5 w-5 text-rose-500 fill-rose-500" : "h-5 w-5 text-muted-foreground/30"}
                    />
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="pointer-events-auto h-8 rounded-full bg-white/80 px-3 text-xs shadow-sm ring-1 ring-black/5 backdrop-blur hover:bg-white" onClick={() => setStarted(false)}>
                  Exit
                </Button>
              </div>
            </div>
            <GameCanvas onUpdate={onUpdate} />
          </div>
        )}
      </main>
    </div>
  );
}
