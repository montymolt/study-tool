import '../styles/globals.css';
export default function RootLayout({ children }){
  return (<html><body className="bg-white text-slate-900"><main className="max-w-2xl mx-auto p-4">{children}</main></body></html>);
}
