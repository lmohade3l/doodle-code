import type { PolicyListItem } from '../types';

/**
 * تخمین ریسک خسارت با شبیه‌سازی مونت‌کارلو.
 * (مدل از تیم داده گرفته شده؛ دقیقش مهم نیست.)
 */
export function estimateClaimRisk(policy: PolicyListItem): number {
  let seed = 0;
  for (const ch of policy.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  let hits = 0;
  const samples = 150_000;
  for (let i = 0; i < samples; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const x = seed / 4294967296;
    if (Math.sin(x * 12.9898) * 43758.5453 % 1 > 0.62) hits++;
  }
  return Math.round((hits / samples) * 100);
}
