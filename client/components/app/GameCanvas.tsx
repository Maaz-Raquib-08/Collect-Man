import { useEffect, useRef } from "react";
import p5 from "p5";
import { cn } from "@/lib/utils";

export interface GameState {
  score: number;
  level: number;
  progress: number; // 0-100
  missed: number; // 0-3
  gameOver: boolean;
}

interface GameCanvasProps {
  onUpdate?: (state: GameState) => void;
  className?: string;
}

export default function GameCanvas({ onUpdate, className }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sketchRef = useRef<p5 | null>(null);

  useEffect(() => {
    let intervals: number[] = [];

    const sketch = (p: p5) => {
      let player: { x: number; y: number; w: number; h: number };
      let debris: Array<{ x: number; y: number; w: number; h: number }> = [];
      let resources: Array<{ x: number; y: number; w: number; h?: number }> = [];
      let score = 0;
      let level = 1;
      let progress = 0;
      let missedResources = 0;
      let gameOver = false;

      const emit = () => {
        onUpdate?.({ score, level, progress, missed: missedResources, gameOver });
      };

      const reset = () => {
        debris = [];
        resources = [];
        score = 0;
        level = 1;
        progress = 0;
        missedResources = 0;
        gameOver = false;
        emit();
      };

      const collides = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h?: number }) => {
        const bh = b.h ?? b.w; // circle diameter used as height
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + bh && a.y + a.h > b.y;
      };

      const spawnDebris = () => {
        if (!gameOver) {
          debris.push({ x: p.width, y: p.random(0, p.height - 30), w: 30, h: 30 });
        }
      };

      const spawnResource = () => {
        if (!gameOver) {
          resources.push({ x: p.width, y: p.random(0, p.height - 20), w: 20 });
        }
      };

      const updateProgress = (value: number) => {
        progress = Math.max(0, Math.min(100, value));
        emit();
      };

      p.setup = () => {
        const c = p.createCanvas(800, 400);
        c.addClass("rounded-xl border border-white/80");
        c.parent(containerRef.current!);

        player = { x: 100, y: p.height / 2 - 20, w: 40, h: 40 };

        intervals.push(window.setInterval(spawnDebris, 1500));
        intervals.push(window.setInterval(spawnResource, 2000));
        emit();
      };

      p.draw = () => {
        p.background(10, 10, 35);
        if (!gameOver) {
          // Pac-Man like player
          p.fill(255, 255, 0);
          const mouthAngle = Math.sin(p.frameCount * 0.1) * 30 + 15;
          p.arc(
            player.x + player.w / 2,
            player.y + player.h / 2,
            player.w,
            player.h,
            p.radians(mouthAngle),
            p.radians(360 - mouthAngle),
            p.PIE,
          );

          // Movement
          if (p.keyIsDown(p.LEFT_ARROW)) player.x -= 5;
          if (p.keyIsDown(p.RIGHT_ARROW)) player.x += 5;
          if (p.keyIsDown(p.UP_ARROW)) player.y -= 5;
          if (p.keyIsDown(p.DOWN_ARROW)) player.y += 5;
          player.x = p.constrain(player.x, 0, p.width - player.w);
          player.y = p.constrain(player.y, 0, p.height - player.h);

          // Debris
          for (let i = debris.length - 1; i >= 0; i--) {
            const d = debris[i];
            d.x -= 5 + level; // increases with level
            p.fill(255, 0, 0);
            p.rect(d.x, d.y, d.w, d.h);
            if (collides(player, d)) {
              gameOver = true;
            }
            if (d.x < -d.w) debris.splice(i, 1);
          }

          // Resources
          for (let i = resources.length - 1; i >= 0; i--) {
            const r = resources[i];
            r.x -= 5;
            p.fill(0, 255, 0);
            p.ellipse(r.x, r.y, r.w);
            if (collides(player, r)) {
              score += 10;
              updateProgress(progress + 10);
              resources.splice(i, 1);
              if (progress >= 100) {
                level += 1;
                updateProgress(0);
              }
            } else if (r.x < -r.w) {
              missedResources += 1;
              resources.splice(i, 1);
              if (missedResources >= 3) gameOver = true;
              emit();
            }
          }
        } else {
          p.fill(255, 0, 0);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text("Game Over! Press R to Restart", p.width / 2, p.height / 2);
        }
      };

      p.keyPressed = () => {
        if (gameOver && (p.key === "r" || p.key === "R")) {
          reset();
        }
      };
    };

    const instance = new p5(sketch);
    sketchRef.current = instance;

    return () => {
      sketchRef.current?.remove();
    };
  }, [onUpdate]);

  return <div ref={containerRef} className={cn("mx-auto w-full max-w-3xl", className)} />;
}
