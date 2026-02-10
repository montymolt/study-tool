"use client";
import React, { useState } from "react";
import { Card } from "../lib/storage";

export default function SwipeView({ cards, onSwipe }: { cards: Card[]; onSwipe: (id: string, action: "know" | "skip" | "flag") => void }) {
  const [index, setIndex] = useState(0);
  if (cards.length === 0) return <div>No cards</div>;
  const card = cards[index];
  return (
    <div className="p-4">
      <div className="border rounded p-6 min-h-[200px] flex items-center justify-center text-center text-lg">
        {card.front}
      </div>
      <div className="mt-3 flex justify-between">
        <button onClick={() => { onSwipe(card.id, "skip"); setIndex((i)=>Math.min(cards.length-1,i+1)); }} className="px-3 py-1 bg-yellow-400 rounded">Skip</button>
        <button onClick={() => { onSwipe(card.id, "flag"); setIndex((i)=>Math.min(cards.length-1,i+1)); }} className="px-3 py-1 bg-gray-200 rounded">Flag</button>
        <button onClick={() => { onSwipe(card.id, "know"); setIndex((i)=>Math.min(cards.length-1,i+1)); }} className="px-3 py-1 bg-green-600 text-white rounded">Know</button>
      </div>
    </div>
  );
}
