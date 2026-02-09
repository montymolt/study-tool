'use client';
import { useState } from 'react';

const dummy = [
  { id:1, front:'What is Big O of binary search?', back:'O(log n)', deck:'algorithms' },
  { id:2, front:'Describe a hashmap collision resolution.', back:'Chaining or open addressing', deck:'algorithms' },
  { id:3, front:'What is CAP theorem?', back:'Consistency, Availability, Partition tolerance', deck:'systems' },
  { id:4, front:'What is gradient descent?', back:'Optimization algorithm to minimize loss', deck:'ml' }
];

export default function Study(){
  const [idx,setIdx]=useState(0);
  const [showBack,setShowBack]=useState(false);
  const card = dummy[idx%dummy.length];
  return (<div>
    <div className="card p-6 rounded shadow">
      <div className="text-sm text-slate-500">Deck: {card.deck}</div>
      <h2 className="text-xl font-semibold mt-2">{showBack?card.back:card.front}</h2>
    </div>
    <div className="flex gap-3 mt-4">
      <button className="btn" onClick={()=>setShowBack(s=>!s)}>{showBack?'Show Front':'Show Back'}</button>
      <button className="btn" onClick={()=>setIdx(i=>i+1)}>Next</button>
    </div>
  </div>);
}
