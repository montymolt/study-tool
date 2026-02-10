import { Card, Deck } from "./storage";
import { v4 as uuid } from "uuid";

function makeCard(front: string, back: string, tags: string[] = [], category?: string): Card {
  return {
    id: uuid(),
    front,
    back,
    tags,
    category,
    difficulty: "medium",
    createdAt: new Date().toISOString(),
    lastReviewed: null,
    interval: 0,
    ease: 2.5,
    nextReview: null,
  };
}

export function seedCards(): { decks: Deck[]; cards: Card[] } {
  const cards: Card[] = [];

  const aiPrompts = [
    [
      "What is gradient descent?",
      "An optimization algorithm used to minimize functions by iteratively moving toward the steepest descent using gradients.",
    ],
    ["Explain overfitting.", "When a model learns noise from training data and fails to generalize to new data."],
    ["What is regularization?", "Techniques (L1/L2, dropout) to prevent overfitting by penalizing complexity."],
    ["Define batch normalization.", "Normalization of layer inputs to stabilize and accelerate training by reducing internal covariate shift."],
    ["What is transfer learning?", "Reusing pre-trained model weights on a new but related task to speed up training and improve performance."],
  ];

  // replicate to reach ~50 AI cards
  for (let i = 0; i < 10; i++) {
    aiPrompts.forEach(([f, b]) => {
      cards.push(makeCard(String(f), String(b), ["ai", "ml"], "AI"));
    });
  }

  // systems design sample deck
  const systems: [string, string][] = [
    ["What is load balancing?", "Distributing network or application traffic across multiple servers to improve responsiveness and availability."],
    ["Explain horizontal vs vertical scaling.", "Horizontal: add more machines; vertical: increase resources on existing machine."],
  ];
  for (const [f, b] of systems) cards.push(makeCard(f, b, ["systems"], "Systems Design"));

  // DSA sample deck
  const dsa: [string, string][] = [
    ["What is a binary search?", "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half."],
    ["What is Big O notation?", "A notation to describe the upper bound on time/space complexity as input size grows."],
  ];
  for (const [f, b] of dsa) cards.push(makeCard(f, b, ["dsa"], "DSA"));

  const deckAi: Deck = { id: uuid(), title: "AI Basics", description: "Seed AI-focused cards", visibility: "private", cards: cards.slice(0, 50) };
  const deckSystems: Deck = { id: uuid(), title: "Systems Design", description: "Sample systems deck", visibility: "private", cards: cards.filter((c) => c.category === "Systems Design") };
  const deckDsa: Deck = { id: uuid(), title: "DSA", description: "Sample DSA deck", visibility: "private", cards: cards.filter((c) => c.category === "DSA") };

  return { decks: [deckAi, deckSystems, deckDsa], cards };
}
