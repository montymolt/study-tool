'use client';
import { useState, useEffect } from 'react';
import Flashcard from './Flashcard';

export default function Study(){
  const [deckId, setDeckId] = useState('algorithms');
  const [cards, setCards] = useState([]);
  const [pos, setPos] = useState(0);

  useEffect(()=>{
    // load seeded decks
    fetch('/data/decks.json').then(r=>r.json()).then(d=>{
      const deck = d.decks.find(x=>x.id===deckId);
      setCards(deck ? deck.cards : []);
      setPos(0);
    }).catch(err=>{ console.error('Failed to load decks',err); });
  },[deckId]);

  function handleAnswer(correct){
    // naive SRS: if correct, move card to end; if incorrect, keep near front
    setCards(prev=>{
      const current = prev[0];
      const rest = prev.slice(1);
      if (correct) return [...rest, current];
      else return [current, ...rest];
    });
    setPos(0);
  }

  if (cards.length===0) return (<div>No cards loaded.</div>);

  const current = cards[0];

  return (<div>
    <div className="mb-4">
      <label className="mr-2">Deck:</label>
      <select value={deckId} onChange={e=>setDeckId(e.target.value)} className="select">
        <option value="algorithms">Data Structures & Algorithms</option>
        <option value="systems">Systems Design</option>
        <option value="ml">AI / ML Basics</option>
      </select>
    </div>

    <Flashcard card={current} onAnswer={handleAnswer} />
  </div>);
}
