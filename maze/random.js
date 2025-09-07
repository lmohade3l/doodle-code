const M = 2 ** 31;
const A = 110351245;
const C = 12345;

function randomInt(seed) {
  return (A * seed + C) % M;
}

export function randomInRange(seed, n) {
  const nextSeed = randomInt(seed);
  const randVal = Math.abs(nextSeed) % n;
  return [nextSeed, randVal];
}