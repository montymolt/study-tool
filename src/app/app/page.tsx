"use client"
import React from 'react'
import { useEffect, useState } from 'react'
import { loadState, saveState, Card } from '../../lib/storage'
import { seedCards } from '../../lib/seed'
import CardEditor from '../../components/CardEditor'
import FlashcardView from '../../components/FlashcardView'
import SwipeView from '../../components/SwipeView'
import { schedule } from '../../lib/srs'

export default function AppPage(){
  const [state,setState]=useState<{cards:Card[]}>({cards:[]})
  const [mode,setMode]=useState<'list'|'editor'|'flash'|'swipe'>('list')
  const [editing,setEditing]=useState<Card|undefined>(undefined)

  useEffect(()=>{
    // load or seed
    const s=loadState()
    if(s.cards.length===0){
      const seeded=seedCards()
      const newState={cards:seeded.cards}
      setState({cards:newState.cards})
      saveState({decks:seeded.decks,cards:newState.cards})
    } else {
      setState({cards:s.cards})
    }
  },[])

  function handleSave(partial:any){
    if(editing){
      const updated={...editing,...partial}
      const cards=state.cards.map(c=>c.id===editing.id?updated:c)
      setState({cards}); saveState({decks:[],cards})
      setEditing(undefined); setMode('list')
    } else {
      const id = crypto.randomUUID()
      const now=new Date().toISOString()
      const card:Card = { id, front: partial.front, back: partial.back, tags: partial.tags||[], createdAt:now, lastReviewed:null, interval:0, ease:2.5, nextReview:null }
      const cards=[card,...state.cards]
      setState({cards}); saveState({decks:[],cards}); setMode('list')
    }
  }

  function handleDelete(id:string){
    const cards=state.cards.filter(c=>c.id!==id)
    setState({cards}); saveState({decks:[],cards})
  }

  function handleAnswer(card:Card,quality:number){
    const updated=schedule(card,quality)
    const cards=state.cards.map(c=>c.id===card.id?updated:c)
    setState({cards}); saveState({decks:[],cards})
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Cards</h2>
          <div className="flex gap-2">
            <button onClick={()=>{setMode('editor'); setEditing(undefined)}} className="px-3 py-1 bg-blue-600 text-white rounded">New</button>
            <button onClick={()=>setMode('flash')} className="px-3 py-1 bg-white border rounded">Flash</button>
            <button onClick={()=>setMode('swipe')} className="px-3 py-1 bg-white border rounded">Swipe</button>
          </div>
        </div>
        {mode==='editor' && <CardEditor card={editing} onSave={handleSave} onCancel={()=>setMode('list')} />}
        {mode==='list' && (
          <div className="mt-4">
            {state.cards.map(c=> (
              <div key={c.id} className="p-3 border rounded mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{c.front}</div>
                    <div className="text-sm text-zinc-600">{c.tags?.join(', ')}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>{setEditing(c); setMode('editor')}} className="px-2 py-1 bg-yellow-300 rounded">Edit</button>
                    <button onClick={()=>handleDelete(c.id)} className="px-2 py-1 bg-red-400 text-white rounded">Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {mode==='flash' && state.cards[0] && <FlashcardView card={state.cards[0]} onAnswer={(q)=>handleAnswer(state.cards[0],q)} />}
        {mode==='swipe' && <SwipeView cards={state.cards} onSwipe={(id,action)=>{ const card=state.cards.find(c=>c.id===id); if(!card)return; if(action==='know') handleAnswer(card,5); else if(action==='skip') handleAnswer(card,3); else if(action==='flag') {/* noop */} }} />}
      </div>
    </div>
  )
}
