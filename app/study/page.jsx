'use client';
import { useState, useEffect } from 'react';
import Flashcard from './Flashcard';

const STORAGE_KEY = 'study:srs:v1';
const DECKS_KEY = 'study:decks:v1';

function loadSrs() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : {}; } catch (e) { return {}; }
}
function saveSrs(srs) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(srs)); } catch(e){} }

function loadLocalDecks(){
  try{ const raw = localStorage.getItem(DECKS_KEY); return raw?JSON.parse(raw):{} }catch(e){return{}};
}
function saveLocalDecks(d){ try{ localStorage.setItem(DECKS_KEY, JSON.stringify(d)); }catch(e){}
}

export default function Study(){
  const [deckId, setDeckId] = useState('algorithms');
  const [decks, setDecks] = useState([]);
  const [due, setDue] = useState([]);
  const [srs, setSrs] = useState({});

  useEffect(()=>{
    const s = loadSrs(); setSrs(s);
    const local = loadLocalDecks();
    fetch('/data/decks.json').then(r=>r.json()).then(d=>{
      // merge local decks (local overrides)
      const merged = d.decks.map(dd=>{
        if (local[dd.id]) return local[dd.id];
        return dd;
      });
      // append any extra local-only decks
      Object.values(local).forEach(ld=>{
        if (!merged.find(m=>m.id===ld.id)) merged.push(ld);
      });
      setDecks(merged);

      const deck = merged.find(x=>x.id===deckId) || merged[0];
      if (deck) computeDue(deck.cards || [], s);
    }).catch(err=>{ console.error('Failed to load decks',err); });
  },[deckId]);

  function computeDue(list, s){
    const now = Date.now();
    const dueCards = list.filter(c => {
      const meta = s[c.id];
      return !meta || (meta.nextReview || 0) <= now;
    });
    setDue(dueCards.length ? dueCards : list.slice());
  }

  function updateSrsForCard(cardId, correct) {
    setSrs(prev => {
      const now = Date.now();
      const meta = Object.assign({ ease: 2.5, interval: 1, repetitions: 0, nextReview: now }, prev[cardId] || {});
      const quality = correct ? 5 : 2;
      if (quality >= 3) {
        meta.repetitions = (meta.repetitions || 0) + 1;
        if (meta.repetitions === 1) meta.interval = 1;
        else if (meta.repetitions === 2) meta.interval = 6;
        else meta.interval = Math.max(1, Math.round(meta.interval * (meta.ease || 2.5)));
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
    setDue(prev => {
      const rest = prev.slice(1);
      if (correct) return [...rest, current];
      else return [current, ...rest];
    });
  }

  const deckOptions = decks.map(d=>({id:d.id,name:d.name || d.id}));
  const currentDeck = decks.find(d=>d.id===deckId) || decks[0] || {cards:[]};

  if (due.length===0) return (<div>No cards loaded.</div>);
  const current = due[0];

  return (<div>
    <div className="mb-4">
      <label className="mr-2">Deck:</label>
      <select value={deckId} onChange={e=>setDeckId(e.target.value)} className="select">
        {deckOptions.map(o => (<option key={o.id} value={o.id}>{o.name}</option>))}
      </select>
      <button className="btn ml-4" onClick={()=>{ localStorage.removeItem(STORAGE_KEY); setSrs({}); window.location.reload(); }}>Reset Progress</button>
      <a className="btn ml-2" href="/study/manage">Manage Decks</a>
    </div>

    <Flashcard card={current} onAnswer={handleAnswer} />

    <div className="text-sm text-slate-500 mt-4">Session queue: {due.length} cards</div>
  </div>);
}
