import { useEffect, useRef } from "react";
import p5 from "p5";

export default function StartBackground() {
  const ref = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let stars: { x: number; y: number; s: number; sp: number }[] = [];
      let clouds: { x: number; y: number; r: number; c: p5.Color; sp: number }[] = [];

      const createStars = () => {
        stars = [];
        const count = Math.floor((p.width * p.height) / 18000);
        for (let i = 0; i < count; i++) {
          stars.push({
            x: p.random(0, p.width),
            y: p.random(0, p.height),
            s: p.random(1, 2.2),
            sp: p.random(20, 60),
          });
        }
      };

      const createClouds = () => {
        clouds = [];
        for (let i = 0; i < 10; i++) {
          const mix = p.random(0.4, 0.9);
          const col = p.lerpColor(p.color(255, 255, 255, 90), p.color(80, 150, 255, 90), mix);
          clouds.push({
            x: p.random(0, p.width),
            y: p.random(0, p.height * 0.6),
            r: p.random(120, 260),
            c: col,
            sp: p.random(6, 14),
          });
        }
      };

      p.setup = () => {
        const c = p.createCanvas(p.windowWidth, p.windowHeight);
        c.parent(ref.current!);
        createStars();
        createClouds();
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        createStars();
        createClouds();
      };

      p.draw = () => {
        p.background(0);

        // stars
        p.noStroke();
        for (const st of stars) {
          st.x -= (st.sp * p.deltaTime) / 1000;
          if (st.x < -2) st.x = p.width + 2;
          p.fill(255, 255, 255, 220);
          p.circle(st.x, st.y, st.s);
        }

        // clouds (soft white/blue mixture)
        for (const cl of clouds) {
          cl.x -= (cl.sp * p.deltaTime) / 1000;
          if (cl.x < -cl.r) cl.x = p.width + cl.r;
          p.noStroke();
          p.fill(cl.c);
          p.ellipse(cl.x, cl.y, cl.r * 1.6, cl.r);
          p.ellipse(cl.x + cl.r * 0.6, cl.y + cl.r * 0.05, cl.r * 1.2, cl.r * 0.8);
          p.ellipse(cl.x - cl.r * 0.5, cl.y + cl.r * 0.1, cl.r, cl.r * 0.7);
        }
      };
    };

    const inst = new p5(sketch);
    instanceRef.current = inst;
    return () => inst.remove();
  }, []);

  return <div ref={ref} className="pointer-events-none fixed inset-0 -z-10" />;
}
