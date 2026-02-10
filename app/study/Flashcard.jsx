'use client';
import { useState, useRef, useEffect } from 'react';

export default function Flashcard({card, onAnswer}){
  const [flipped,setFlipped] = useState(false);
  const ref = useRef();

  useEffect(()=>{ setFlipped(false); },[card]);

  return (
    <div className="card p-6 rounded shadow bg-white" ref={ref}>
      <div className="text-sm text-slate-500">Card ID: {card.id}</div>
      <h2 className="text-xl font-semibold mt-2">{flipped?card.back:card.front}</h2>
      <div className="flex gap-3 mt-4">
        <button className="btn" onClick={()=>setFlipped(f=>!f)}>{flipped? 'Show Front':'Show Back'}</button>
        <button className="btn" onClick={()=>onAnswer(true)}>Correct</button>
        <button className="btn" onClick={()=>onAnswer(false)}>Incorrect</button>
      </div>
    </div>
  );
}
