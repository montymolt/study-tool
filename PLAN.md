# Study Tool — Project Plan

Purpose
- Mobile-first web app to study software engineering interview topics: systems design, AI development best practices, and data structures & algorithms.
- Fast, digestible sessions: flashcards, Tinder-style swiping, and TikTok-style vertical short facts.

Tech stack
- Next.js (TypeScript, App Router)
- Tailwind CSS
- LocalStorage for MVP persistence
- GitHub for code hosting
- Vercel for deployment
- Supabase for sync/auth (Phase 2)

MVP features
1. Scaffold & deploy
   - Next.js + Tailwind + TypeScript scaffold
   - Local dev server and Vercel deployment
2. Card management
   - Create/edit/delete cards
   - CSV import/export
   - Tagging and simple search
3. Study modes
   - Flashcards (tap to flip)
   - Tinder-style swipe (know/skip/flag)
   - TikTok-style vertical feed (single fact + micro-explanation)
4. Basic SRS
   - Track lastReviewed, interval, ease, nextReview in localStorage
5. Mobile-first UI
   - Gestures for swipe and tap, responsive layout
6. Local stats
   - Cards reviewed, streaks, per-deck progress

Phase 2
- Supabase auth + sync
- Shared decks + public decks
- AI-powered content generation (OpenAI/Claude)
- Advanced SRS algorithm

Data model
- Card: id, front, back, tags[], category, difficulty, createdAt, lastReviewed, interval, ease, nextReview
- Deck: id, title, description, visibility, cards[]

Milestones & timeline (rough)
- Scaffold + initial deploy: 30-60 minutes
- Card editor + local persistence + CSV: 3-6 hours
- Swipe + TikTok study views: 4-8 hours
- Basic SRS + stats: 2-4 hours

Repository & deployment
- Local repo: /Users/cosmowatts/.openclaw/workspace/study-tool
- Remote: will create montymolt/study-tool when ready
- Vercel: deploy from repo (or from local for preview)

Notes
- Seed ~20 AI-focused cards for initial study content (optional)
- Prioritize mobile gestures and minimal UI friction

