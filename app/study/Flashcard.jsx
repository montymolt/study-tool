'use client';
import { useState, useRef, useEffect } from 'react';

export default function Flashcard({card, onAnswer}){
  const [flipped,setFlipped] = useState(false);
  const ref = useRef();
  const pos = useRef({x:0,y:0,down:false,startX:0,startY:0});
  const [style, setStyle] = useState({transform:'translate3d(0,0,0) rotate(0deg)',transition:'transform 150ms ease'});

  useEffect(()=>{ setFlipped(false); resetPos(); },[card]);

  function resetPos(){
    pos.current = {x:0,y:0,down:false,startX:0,startY:0};
    setStyle({transform:'translate3d(0,0,0) rotate(0deg)',transition:'transform 150ms ease'});
  }

  function handlePointerDown(e){
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    pos.current.down = true;
    pos.current.startX = x;
    pos.current.startY = y;
    setStyle(s => ({...s, transition:''}));
  }
  function handlePointerMove(e){
    if (!pos.current.down) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - pos.current.startX;
    pos.current.x = dx;
    const rot = Math.sign(dx) * Math.min(15, Math.abs(dx)/10);
    setStyle({transform:`translate3d(${dx}px,0,0) rotate(${rot}deg)`, transition:''});
  }
  function handlePointerUp(){
    if (!pos.current.down) return;
    pos.current.down = false;
    const dx = pos.current.x;
    const threshold = 100;
    if (dx > threshold){
      // right = correct
      setStyle({transform:`translate3d(1200px,0,0) rotate(25deg)`, transition:'transform 300ms ease'});
      setTimeout(()=>{ onAnswer(true); resetPos(); }, 250);
    } else if (dx < -threshold){
      // left = incorrect
      setStyle({transform:`translate3d(-1200px,0,0) rotate(-25deg)`, transition:'transform 300ms ease'});
      setTimeout(()=>{ onAnswer(false); resetPos(); }, 250);
    } else {
      // snap back
      resetPos();
    }
  }

  return (
    <div
      className="card p-6 rounded shadow bg-white touch-none"
      ref={ref}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={style}
    >
      <div className="text-sm text-slate-500">Card ID: {card.id}</div>
      <h2 className="text-xl font-semibold mt-2">{flipped?card.back:card.front}</h2>
      <div className="flex gap-3 mt-4">
        <button className="btn" onClick={()=>setFlipped(f=>!f)}>{flipped? 'Show Front':'Show Back'}</button>
        <button className="btn" onClick={()=>{ setStyle({transform:'translate3d(1200px,0,0) rotate(25deg)',transition:'transform 300ms ease'}); setTimeout(()=>{ onAnswer(true); resetPos(); },250); }}>Correct</button>
        <button className="btn" onClick={()=>{ setStyle({transform:'translate3d(-1200px,0,0) rotate(-25deg)',transition:'transform 300ms ease'}); setTimeout(()=>{ onAnswer(false); resetPos(); },250); }}>Incorrect</button>
      </div>
    </div>
  );
}
