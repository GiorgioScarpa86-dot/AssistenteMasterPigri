import { useStore } from '../store/useStore';

export function Header() {
  const cloudSync = useStore(s => s.cloudSync);
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-black text-zinc-950 text-sm">DM</div>
          <div>
            <h1 className="font-bold tracking-tight leading-none text-[15px]">MASTER PIGRI</h1>
            <p className="text-[10px] tracking-widest text-zinc-400 uppercase">D&D 5e • Session Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 text-[10px] border px-2 py-1 rounded ${
              cloudSync
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
            title={
              cloudSync
                ? 'Connesso a Firebase: le party sono salvate nel cloud'
                : 'Firebase non attivo: le party sono salvate solo su questo dispositivo'
            }
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${cloudSync ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            {cloudSync ? '☁️ SYNC CLOUD' : '💾 SOLO LOCALE'}
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px]">⚔️</div>
        </div>
      </div>
    </header>
  );
}
