import { useStore } from '../store/useStore';
import { useState } from 'react';

export function NPCPanel() {
  const { currentNPCs, generateNPCsOnly, selectedBiome } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);

  if (currentNPCs.length===0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">🧙</div>
        <h2 className="text-lg font-bold">No NPCs yet</h2>
        <p className="text-sm text-zinc-400 mt-2">Generate an encounter first, or create NPCs for your current biome.</p>
        <button onClick={()=>generateNPCsOnly(3)} className="mt-4 bg-zinc-800 border border-zinc-700 px-4 py-2 rounded text-sm uppercase font-bold tracking-wide">Generate 3 NPCs for {selectedBiome}</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">NPCs • {selectedBiome}</h2>
          <p className="text-[12px] text-zinc-500">Punchy, mobile-optimized stat snippets</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={()=>generateNPCsOnly(1)} className="bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded text-[11px] uppercase">+1</button>
          <button onClick={()=>generateNPCsOnly(3)} className="bg-amber-500 text-zinc-950 px-3 py-1.5 rounded text-[11px] uppercase font-bold">Reroll 3</button>
        </div>
      </div>

      {currentNPCs.map(npc => (
        <div key={npc.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <button onClick={()=>setOpenId(openId===npc.id ? null : npc.id)} className="w-full p-4 text-left flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[15px]">{npc.name}</span>
                <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded uppercase tracking-wide">{npc.race}</span>
                <span className="text-[10px] bg-amber-900/30 border border-amber-800/50 text-amber-300 px-1.5 py-0.5 rounded uppercase">{npc.role}</span>
              </div>
              <div className="text-[12px] text-zinc-400 mt-1">👁️ {npc.visualTrait}</div>
              <div className="text-[12px] text-zinc-300 mt-1 italic">"{npc.quirk}"</div>
            </div>
            <span className="text-zinc-600">{openId===npc.id?'−':'+'}</span>
          </button>

          {openId===npc.id && (
            <div className="px-4 pb-4 space-y-3 animate-fadeIn">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] uppercase text-zinc-500">AC</div>
                  <div className="font-mono font-bold">{npc.ac}</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] uppercase text-zinc-500">HP</div>
                  <div className="font-mono font-bold text-red-400">{npc.hp}</div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
                  <div className="text-[10px] uppercase text-zinc-500">Speed</div>
                  <div className="font-mono font-bold text-[12px]">{npc.speed}</div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded p-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wide text-sky-400 mb-1">Combat Snippet</div>
                <div className="text-[12px] font-mono text-zinc-300">{npc.attack}</div>
              </div>

              <div className="space-y-2">
                <div className="bg-red-950/20 border border-red-900/30 rounded p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-red-300">Secret</div>
                  <div className="text-[12px] text-zinc-300 mt-0.5">{npc.secret}</div>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-amber-300">Motive</div>
                  <div className="text-[12px] text-zinc-300 mt-0.5">{npc.motive}</div>
                </div>
              </div>

              <div className="text-[10px] text-zinc-600 font-mono">Biome: {npc.biome} • ID: {npc.id}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
