/**
 * Small deterministic PRNG (Mulberry32).
 * Good enough for games, not for crypto.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function nextSeed() {
  // Deterministic enough across devices, stable within a start click.
  // Avoids Math.random() affecting game randomness after start.
  return (Date.now() ^ (performance.now() * 1000)) >>> 0;
}

export function shuffleWithRng<T>(arr: T[], rng: () => number) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sampleWithRng<T>(arr: T[], rng: () => number) {
  return arr[Math.floor(rng() * arr.length)];
}

