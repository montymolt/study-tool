import { Card } from "./storage";

export function schedule(card: Card, quality: number): Card {
  // simple SM-2 like algorithm simplified
  const now = new Date().toISOString();
  const ease = card.ease ?? 2.5;
  const interval = card.interval ?? 0;
  let newEase = ease;
  let newInterval = interval;

  if (quality < 3) {
    newInterval = 1;
  } else {
    if (interval <= 0) newInterval = 1;
    else if (interval === 1) newInterval = 6;
    else newInterval = Math.round(interval * (newEase));
    // adjust ease
    newEase = Math.max(1.3, newEase + (0.1 - (5 - quality) * 0.08));
  }

  return {
    ...card,
    lastReviewed: now,
    interval: newInterval,
    ease: Number(newEase.toFixed(2)),
    nextReview: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString(),
  };
}
