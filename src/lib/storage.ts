export const STORAGE_KEY = "study_tool_data_v1";

export type Card = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  createdAt: string;
  lastReviewed?: string | null;
  interval?: number; // days
  ease?: number; // maintenance of ease factor
  nextReview?: string | null;
};

export type Deck = {
  id: string;
  title: string;
  description?: string;
  visibility?: "private" | "public";
  cards: Card[];
};

export type AppState = {
  decks: Deck[];
  cards: Card[];
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load state", e);
  }
  return { decks: [], cards: [] };
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}
