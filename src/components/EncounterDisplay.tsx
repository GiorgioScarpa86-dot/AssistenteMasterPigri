import { useState } from 'react';
import { useStore } from '../store/useStore';
import { MapView } from './MapView';

export function EncounterDisplay() {
  const { currentEncounter, currentMap } = useStore();
  const [openMonsters, setOpenMonsters] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState({ tactics: true, loot: true, twist: true, xp: false });

  if (!currentEncounter) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-4">🎲</div>
        <h2 className="text-lg font-bold">No encounter yet</h2>
        <p className="text-sm text-zinc-400 mt-2">Go to Generate tab and forge your first encounter. It will appear here with map, tactics, and loot.</p>
      </div>
    );
  }

  const toggleMonster = (id: string) => setOpenMonsters(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-4">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentMap ? '🗺️' : '⚔️'}</span>
              <h2 className="font-bold text-[16px]">{currentEncounter.difficulty} Encounter • {currentEncounter.biome.toUpperCase()}</h2>
            </div>
            <p className="text-[13px] text-zinc-300 mt-1 leading-snug">{currentEncounter.description}</p>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide border ${
            currentEncounter.difficulty==='Deadly' ? 'bg-red-950 border-red-800 text-red-300' :
            currentEncounter.difficulty==='Hard' ? 'bg-orange-950 border-orange-800 text-orange-300' :
            currentEncounter.difficulty==='Medium' ? 'bg-amber-950 border-amber-800 text-amber-300' :
            'bg-emerald-950 border-emerald-800 text-emerald-300'
          }`}>{currentEncounter.difficulty}</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Budget</div>
            <div className="font-mono font-bold text-amber-400">{currentEncounter.budget} XP</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Total XP</div>
            <div className="font-mono font-bold">{currentEncounter.totalXP}</div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded p-2">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Adjusted</div>
            <div className="font-mono font-bold text-sky-400">{currentEncounter.adjustedXP}</div>
          </div>
        </div>

        <button onClick={()=>setOpenSections(s=>({...s, xp:!s.xp}))} className="mt-2 text-[11px] text-zinc-500 underline">XP math details {openSections.xp?'▲':'▼'}</button>
        {openSections.xp && (
          <div className="mt-2 bg-zinc-950 border border-zinc-800 rounded p-2 text-[11px] text-zinc-400 font-mono">
            Party: {currentEncounter.monsters.reduce((a,b)=>a+b.count,0)} monsters → multiplier { (currentEncounter.adjustedXP/currentEncounter.totalXP).toFixed(1)}×<br/>
            Formula: Total XP × multiplier = Adjusted XP<br/>
            Adjusted compared to budget to determine difficulty. DMG p82.
          </div>
        )}
      </div>

      {currentMap && <MapView />}

      {/* Monsters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-[12px] uppercase tracking-widest">Monsters • {currentEncounter.monsters.reduce((a,b)=>a+b.count,0)} total</h3>
          <span className="text-[10px] text-zinc-500">Tap to expand stat blocks</span>
        </div>
        <div className="divide-y divide-zinc-800">
          {currentEncounter.monsters.map(em => (
            <div key={em.monster.id} className="p-3">
              <button onClick={()=>toggleMonster(em.monster.id)} className="w-full flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center font-mono text-[11px] font-bold">{em.monster.cr}</div>
                  <div>
                    <div className="font-bold text-[14px]">{em.count}× {em.monster.name} <span className="text-zinc-500 font-normal text-[12px]">({em.monster.type})</span></div>
                    <div className="text-[11px] text-zinc-400">AC {em.monster.ac} • HP {em.monster.hp} • {em.monster.speed} • XP {em.monster.xp} each</div>
                  </div>
                </div>
                <div className="text-zinc-500">{openMonsters[em.monster.id] ? '−' : '+'}</div>
              </button>

              {openMonsters[em.monster.id] && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-amber-400 mb-1">Traits</div>
                    <ul className="text-[12px] text-zinc-300 space-y-1">
                      {em.monster.traits.length===0 ? <li className="text-zinc-500">No special traits</li> : em.monster.traits.map((t,i)=><li key={i}>• {t}</li>)}
                    </ul>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-sky-400 mb-1">Actions</div>
                    <ul className="text-[12px] text-zinc-300 space-y-1">
                      {em.monster.actions.map((a,i)=><li key={i}><span className="font-bold text-zinc-100">{a.name}:</span> {a.desc}</li>)}
                    </ul>
                  </div>
                  {em.monster.tactics && (
                    <div className="bg-amber-950/20 border border-amber-900/30 rounded p-2.5 text-[12px] text-amber-200/80">
                      <span className="font-bold">Tactic:</span> {em.monster.tactics}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tactics */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <button onClick={()=>setOpenSections(s=>({...s, tactics:!s.tactics}))} className="w-full p-3 flex items-center justify-between">
          <h3 className="font-bold text-[12px] uppercase tracking-widest">⚔️ Tactics & Combos {currentEncounter.difficulty!=='Easy' ? '• Pack Tactics' : ''}</h3>
          <span className="text-zinc-500">{openSections.tactics?'−':'+'}</span>
        </button>
        {openSections.tactics && (
          <div className="px-3 pb-3 space-y-2">
            {currentEncounter.tactics.map((t,i)=>(
              <div key={i} className="bg-zinc-950 border border-zinc-800 rounded p-2.5 text-[12px] leading-snug text-zinc-300">
                {t}
              </div>
            ))}
            {currentEncounter.difficulty==='Easy' && <div className="text-[11px] text-zinc-500">Easy difficulty - monsters fight straightforwardly, no advanced combos.</div>}
          </div>
        )}
      </div>

      {/* Twist */}
      {currentEncounter.twist && (
        <div className="bg-violet-950/30 border border-violet-900/50 rounded-lg">
          <button onClick={()=>setOpenSections(s=>({...s, twist:!s.twist}))} className="w-full p-3 flex items-center justify-between">
            <h3 className="font-bold text-[12px] uppercase tracking-widest text-violet-300">🎭 Deus Ex Machina • {currentEncounter.twist.title}</h3>
            <span className="text-violet-400">{openSections.twist?'−':'+'}</span>
          </button>
          {openSections.twist && (
            <div className="px-3 pb-3 space-y-2">
              <p className="text-[13px] text-violet-100">{currentEncounter.twist.description}</p>
              <div className="bg-zinc-950 border border-violet-900/30 rounded p-2.5 text-[12px] text-zinc-300">
                <span className="font-bold text-violet-300">Mechanic:</span> {currentEncounter.twist.mechanic}
              </div>
              <span className={`inline-block text-[10px] px-2 py-1 rounded uppercase font-bold ${
                currentEncounter.twist.severity==='deadly' ? 'bg-red-900 text-red-200' :
                currentEncounter.twist.severity==='major' ? 'bg-orange-900 text-orange-200' : 'bg-zinc-800 text-zinc-400'
              }`}>{currentEncounter.twist.severity}</span>
            </div>
          )}
        </div>
      )}

      {/* Loot */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg">
        <button onClick={()=>setOpenSections(s=>({...s, loot:!s.loot}))} className="w-full p-3 flex items-center justify-between">
          <h3 className="font-bold text-[12px] uppercase tracking-widest">💰 Loot • {currentEncounter.loot.type}</h3>
          <span className="text-zinc-500">{openSections.loot?'−':'+'}</span>
        </button>
        {openSections.loot && (
          <div className="px-3 pb-3 space-y-3">
            <p className="text-[12px] text-zinc-400">{currentEncounter.loot.description}</p>
            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[12px]">
              {Object.entries(currentEncounter.loot.coins).map(([k,v])=>(
                <div key={k} className="bg-zinc-950 border border-zinc-800 rounded p-1.5">
                  <div className="text-[10px] uppercase text-zinc-500">{k}</div>
                  <div className="font-bold">{v}</div>
                </div>
              ))}
            </div>
            {currentEncounter.loot.gems && currentEncounter.loot.gems.length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">Gems</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentEncounter.loot.gems.map((g,i)=><span key={i} className="text-[11px] bg-sky-950/50 border border-sky-900/50 text-sky-300 px-2 py-1 rounded">{g.count}× {g.name} ({g.value}gp)</span>)}
                </div>
              </div>
            )}
            {currentEncounter.loot.art && currentEncounter.loot.art.length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">Art Objects</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentEncounter.loot.art.map((a,i)=><span key={i} className="text-[11px] bg-amber-950/30 border border-amber-900/30 text-amber-300 px-2 py-1 rounded">{a.name} ({a.value}gp)</span>)}
                </div>
              </div>
            )}
            {currentEncounter.loot.magicItems && currentEncounter.loot.magicItems.length>0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-zinc-500 mb-1">Magic Items / Potions</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentEncounter.loot.magicItems.map((m,i)=><span key={i} className="text-[11px] bg-violet-950/30 border border-violet-900/30 text-violet-300 px-2 py-1 rounded">✨ {m}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
