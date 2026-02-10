"use client";
import React, { useState } from "react";
import { Card } from "../lib/storage";

type Props = { card?: Card; onSave: (c: Partial<Card>) => void; onCancel?: () => void };

export default function CardEditor({ card, onSave, onCancel }: Props) {
  const [front, setFront] = useState(card?.front ?? "");
  const [back, setBack] = useState(card?.back ?? "");
  const [tags, setTags] = useState((card?.tags ?? []).join(", "));

  return (
    <div className="p-4">
      <label className="block text-sm font-medium">Front</label>
      <textarea value={front} onChange={(e) => setFront(e.target.value)} className="w-full border p-2" />
      <label className="block text-sm font-medium mt-2">Back</label>
      <textarea value={back} onChange={(e) => setBack(e.target.value)} className="w-full border p-2" />
      <label className="block text-sm font-medium mt-2">Tags (comma)</label>
      <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border p-2" />
      <div className="mt-3 flex gap-2">
        <button onClick={() => onSave({ front, back, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) })} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        {onCancel && <button onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>}
      </div>
    </div>
  );
}
