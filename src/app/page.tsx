import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold">Study Tool</h1>
        <p className="text-sm text-zinc-600">Mobile-first study app — flashcards, swipe, vertical feed.</p>
        <div className="mt-4 flex gap-2">
          <Link href="/app/cards" className="px-3 py-2 bg-white border rounded">Cards</Link>
          <Link href="/app/study" className="px-3 py-2 bg-white border rounded">Study</Link>
        </div>
      </div>
    </main>
  );
}
