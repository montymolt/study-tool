'use client';
import { useState, useEffect } from 'react';

const DECKS_KEY = 'study:decks:v1';

function loadLocalDecks(){
  try{ const raw = localStorage.getItem(DECKS_KEY); return raw?JSON.parse(raw):{} }catch(e){return{}};
}
function saveLocalDecks(d){ try{ localStorage.setItem(DECKS_KEY, JSON.stringify(d)); }catch(e){}
}

export default function Manage(){
  const [decks, setDecks] = useState({});
  const [newDeckId, setNewDeckId] = useState('');
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(()=>{ setDecks(loadLocalDecks()); },[]);

  function createDeck(){
    if (!newDeckId) return;
    const copy = Object.assign({}, decks, { [newDeckId]: { id:newDeckId, name:newDeckName||newDeckId, cards:[] } });
    setDecks(copy); saveLocalDecks(copy);
    setNewDeckId(''); setNewDeckName('');
  }

  function deleteDeck(id){
    const copy = Object.assign({}, decks); delete copy[id]; setDecks(copy); saveLocalDecks(copy);
  }

  function importCsv(e){
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev)=>{
      const text = ev.target.result; const lines = text.split('\n').map(l=>l.trim()).filter(Boolean);
      const header = lines[0].split(',').map(h=>h.trim());
      const rows = lines.slice(1).map(r=>r.split(',').map(c=>c.trim()));
      // default mapping: id,front,back,deck
      const idIdx = header.indexOf('id'); const frontIdx = header.indexOf('front'); const backIdx = header.indexOf('back'); const deckIdx = header.indexOf('deck');
      rows.forEach(r=>{
        const id = idIdx>=0? r[idIdx] : crypto.randomUUID();
        const front = frontIdx>=0? r[frontIdx] : r[0];
        const back = backIdx>=0? r[backIdx] : r[1] || '';
        const deck = deckIdx>=0? r[deckIdx] : (newDeckId||'imported');
        const copy = Object.assign({}, decks);
        if (!copy[deck]) copy[deck] = { id:deck, name:deck, cards:[] };
        copy[deck].cards.push({ id, front, back });
        setDecks(copy); saveLocalDecks(copy);
      });
    };
    reader.readAsText(file);
  }

  return (<div>
    <h2 className="text-xl font-bold mb-4">Manage Decks</h2>
    <div className="mb-4">
      <input placeholder="Deck ID" value={newDeckId} onChange={e=>setNewDeckId(e.target.value)} className="input mr-2" />
      <input placeholder="Deck Name" value={newDeckName} onChange={e=>setNewDeckName(e.target.value)} className="input mr-2" />
      <button className="btn" onClick={createDeck}>Create Deck</button>
      <input className="ml-4" type="file" accept=".csv" onChange={importCsv} />
    </div>

    <div className="grid gap-3">
      {Object.values(decks).map(d=> (
        <div key={d.id} className="p-3 border rounded">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{d.name} <span className="text-sm text-slate-500">({d.id})</span></div>
              <div className="text-sm text-slate-500">{(d.cards||[]).length} cards</div>
            </div>
            <div>
              <button className="btn mr-2" onClick={()=>{ navigator.clipboard.writeText(JSON.stringify(d)); }}>Export</button>
              <button className="btn btn-ghost" onClick={()=>deleteDeck(d.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>);
}
