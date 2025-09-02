import { useEffect, useRef } from "react";
import p5 from "p5";

export default function PanelStars() {
  const ref = useRef<HTMLDivElement | null>(null);
  const instRef = useRef<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let stars: { x: number; y: number; r: number; phase: number; speed: number }[] = [];

      const make = () => {
        stars = [];
        const w = p.width;
        const h = p.height;
        const count = Math.max(24, Math.floor((w * h) / 16000));
        for (let i = 0; i < count; i++) {
          // Cluster around center area using gaussian-like distribution
          const rx = (p.random() - 0.5) * 0.9; // -0.45..0.45
          const ry = (p.random() - 0.2) * 0.6; // tighter vertically
          const x = w / 2 + rx * w;
          const y = h * 0.38 + ry * h * 0.5; // around text area
          stars.push({
            x,
            y,
            r: p.random(0.8, 2.4),
            phase: p.random(p.TWO_PI),
            speed: p.random(0.8, 1.8),
          });
        }
      };

      p.setup = () => {
        const c = p.createCanvas(ref.current!.clientWidth, ref.current!.clientHeight);
        c.parent(ref.current!);
        p.clear();
        make();
      };

      p.windowResized = () => {
        if (!ref.current) return;
        p.resizeCanvas(ref.current.clientWidth, ref.current.clientHeight);
        make();
      };

      p.draw = () => {
        p.clear();
        const t = p.millis() / 1000;
        p.noStroke();
        for (const s of stars) {
          // gentle orbital drift
          s.x += Math.sin(t * 0.2 + s.phase) * 0.05;
          s.y += Math.cos(t * 0.25 + s.phase) * 0.03;
          const tw = (Math.sin(t * 3 * s.speed + s.phase) + 1) / 2; // 0..1
          const alpha = 120 + tw * 120;
          p.fill(255, 255, 255, alpha * 0.25);
          p.circle(s.x, s.y, s.r * 3.2);
          p.fill(255, 255, 255, alpha);
          p.circle(s.x, s.y, s.r);
        }
      };
    };

    const inst = new p5(sketch);
    instRef.current = inst;
    return () => inst.remove();
  }, []);

  return <div ref={ref} className="pointer-events-none absolute inset-0" />;
}
