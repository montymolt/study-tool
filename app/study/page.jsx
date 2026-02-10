'use client';
import { useState, useEffect } from 'react';
import Flashcard from './Flashcard';

const STORAGE_KEY = 'study:srs:v1';

function loadSrs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveSrs(srs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(srs)); } catch(e){}
}

export default function Study(){
  const [deckId, setDeckId] = useState('algorithms');
  const [cards, setCards] = useState([]);
  const [due, setDue] = useState([]);
  const [srs, setSrs] = useState({});

  useEffect(()=>{
    // load seeded decks and SRS
    const s = loadSrs();
    setSrs(s);
    fetch('/data/decks.json').then(r=>r.json()).then(d=>{
      const deck = d.decks.find(x=>x.id===deckId);
      const list = deck ? deck.cards : [];
      setCards(list);
      // compute due cards
      const now = Date.now();
      const dueCards = list.filter(c => {
        const meta = s[c.id];
        return !meta || (meta.nextReview || 0) <= now;
      });
      setDue(dueCards.length ? dueCards : list.slice());
    }).catch(err=>{ console.error('Failed to load decks',err); });
  },[deckId]);

  // SM-2-ish update
  function updateSrsForCard(cardId, correct) {
    setSrs(prev => {
      const now = Date.now();
      const meta = Object.assign({ ease: 2.5, interval: 1, repetitions: 0, nextReview: now }, prev[cardId] || {});
      const quality = correct ? 5 : 2; // simplified
      if (quality >= 3) {
        meta.repetitions = (meta.repetitions || 0) + 1;
        if (meta.repetitions === 1) meta.interval = 1;
        else if (meta.repetitions === 2) meta.interval = 6;
        else meta.interval = Math.max(1, Math.round(meta.interval * (meta.ease || 2.5)));
        // update ease factor
        meta.ease = Math.max(1.3, (meta.ease || 2.5) + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      } else {
        meta.repetitions = 0;
        meta.interval = 1;
        meta.ease = Math.max(1.3, (meta.ease || 2.5) - 0.2);
      }
      meta.nextReview = now + meta.interval * 24 * 60 * 60 * 1000;

      const next = Object.assign({}, prev, { [cardId]: meta });
      saveSrs(next);
      return next;
    });
  }

  function handleAnswer(correct){
    if (!due || due.length === 0) return;
    const current = due[0];
    updateSrsForCard(current.id, correct);

    // recompute due list from remaining cards
    setDue(prev => {
      const rest = prev.slice(1);
      // if correct, push current to end of session queue; if incorrect, keep near front
      if (correct) return [...rest, current];
      else return [current, ...rest];
    });
  }

  if (due.length===0) return (<div>No cards loaded.</div>);
  const current = due[0];

  return (<div>
    <div className="mb-4">
      <label className="mr-2">Deck:</label>
      <select value={deckId} onChange={e=>setDeckId(e.target.value)} className="select">
        <option value="algorithms">Data Structures & Algorithms</option>
        <option value="systems">Systems Design</option>
        <option value="ml">AI / ML Basics</option>
      </select>
      <button className="btn ml-4" onClick={()=>{ localStorage.removeItem(STORAGE_KEY); setSrs({}); window.location.reload(); }}>Reset Progress</button>
    </div>

    <Flashcard card={current} onAnswer={handleAnswer} />

    <div className="text-sm text-slate-500 mt-4">Session queue: {due.length} cards</div>
  </div>);
}
