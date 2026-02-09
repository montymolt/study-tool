import Link from 'next/link';
export default function Home(){
  return (<div><h1 className="text-2xl font-bold">Study Tool (Scaffold)</h1><p className="mt-4">Mobile-first flashcards for interviews.</p><div className="mt-6"><Link href="/study" className="btn">Start Studying</Link></div></div>);
}
