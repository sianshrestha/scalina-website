/* The LiquidEther field used behind the hero and behind the closing block.

   One config, two mount points, so the page opens and closes on the same
   material. Brand blue weighted dark: at full opacity over near-black it reads
   as a glow rather than a bright wash.

   The hero's *static* wash behind the wordmark is separate and stays neutral
   (see Hero.module.css) — that was the halo around the letters, not this. */
export const ETHER = {
  colors: ['#00132E', '#004AAD', '#2A6BC4'] as string[],
  mouseForce: 16,
  cursorSize: 150,
  resolution: 0.4,
  autoDemo: true,
  autoSpeed: 0.28,
  autoIntensity: 1.9,
  autoResumeDelay: 1500,
};

