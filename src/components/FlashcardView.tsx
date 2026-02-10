"use client";
import React, { useState } from "react";
import { Card } from "../lib/storage";

export default function FlashcardView({ card, onAnswer }: { card: Card; onAnswer: (quality: number) => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="p-4">
      <div onClick={() => setFlipped(!flipped)} className="border rounded p-6 min-h-[200px] flex items-center justify-center text-center text-lg">
        {flipped ? card.back : card.front}
      </div>
      {flipped && (
        <div className="mt-3 flex gap-2">
          {[0,1,2,3,4,5].map((q)=> (
            <button key={q} onClick={() => onAnswer(q)} className="px-2 py-1 bg-gray-200 rounded">{q}</button>
          ))}
        </div>
      )}
    </div>
  );
}
