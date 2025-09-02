import { useState, useCallback, useEffect } from "react";
import GameCanvas, { type GameState } from "@/components/app/GameCanvas";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";

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
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStarted(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started]);

  const livesLeft = Math.max(0, 3 - state.missed);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-accent/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 -top-1/3 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,theme(colors.primary.DEFAULT)/0.12,transparent)]" />
        <div className="absolute -bottom-1/3 -right-1/3 h-[700px] w-[700px] rounded-full bg-[radial-gradient(closest-side,theme(colors.accent.DEFAULT)/0.25,transparent)]" />
      </div>

      <main className="relative mx-auto w-full max-w-5xl px-6 py-20">
        {!started ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-primary/20 bg-white/60 p-8 shadow-brand backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Space Cleanup: Cosmic Recycler
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Start Game</h1>
            <p className="mt-2 text-sm text-muted-foreground">Arrow keys to move. Collect green resources, avoid red debris. Miss 3 resources and it’s game over. Press R to restart.</p>
            <div className="mt-6">
              <Button
                size="lg"
                className="shadow-brand bg-gradient-to-r from-primary to-fuchsia-500 hover:from-fuchsia-500 hover:to-primary"
                onClick={() => setStarted(true)}
              >
                Start Playing
              </Button>
            </div>
          </div>
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
                <Button className="pointer-events-auto" variant="secondary" onClick={() => setStarted(false)}>Exit</Button>
              </div>
            </div>
            <GameCanvas onUpdate={onUpdate} />
          </div>
        )}
      </main>
    </div>
  );
}
