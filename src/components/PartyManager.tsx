import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { isConfigured } from '../firebase';

export function PartyManager() {
  const { parties, activePartyId, loadParties, createParty, deleteParty, selectParty, isLoadingParties, setActiveTab } = useStore();
  const [name, setName] = useState('');
  const [count, setCount] = useState(4);
  const [level, setLevel] = useState(3);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => { loadParties(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setName(`Party ${parties.length+1}`);
    }
    await createParty(name.trim() || `Party ${parties.length+1}`, count, level);
    setName('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Firebase status */}
      <div className={`p-3 rounded border text-[12px] ${isConfigured ? 'bg-emerald-950/30 border-emerald-900 text-emerald-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
        {isConfigured ? '🔥 Firebase Connected - Parties synced to cloud (anonymous auth)' : '💾 Offline Mode - Using localStorage. To enable cloud sync, add Firebase config in src/firebase.ts (see guide).'}
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight">Adventuring Parties</h2>
        <p className="text-[13px] text-zinc-400 mt-1">Create and manage multiple parties. Saved automatically.</p>
      </div>

      {/* Create form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">New Party</h3>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Party name (e.g. The Muddy Boots)"
          className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2.5 text-[14px] focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] uppercase tracking-wide text-zinc-500">Players</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setCount(Math.max(1,count-1))} className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">-</button>
              <div className="flex-1 text-center font-mono font-bold text-lg">{count}</div>
              <button onClick={()=>setCount(Math.min(8,count+1))} className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">+</button>
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wide text-zinc-500">Avg Level</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setLevel(Math.max(1,level-1))} className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">-</button>
              <div className="flex-1 text-center font-mono font-bold text-lg">{level}</div>
              <button onClick={()=>setLevel(Math.min(20,level+1))} className="w-9 h-9 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">+</button>
            </div>
          </div>
        </div>
        <button onClick={handleCreate} className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold tracking-wide uppercase text-[13px] py-3 rounded transition-colors">
          + Create Party
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">Saved Parties {isLoadingParties && '(loading...)'}</h3>
        {parties.length===0 && !isLoadingParties && (
          <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-lg p-8 text-center text-zinc-500 text-sm">
            No parties yet. Create one above.
          </div>
        )}
        {parties.map(party => (
          <div key={party.id} className={`bg-zinc-900 border rounded-lg p-4 flex items-center justify-between gap-3 ${activePartyId===party.id ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-zinc-800'}`}>
            <div className="flex-1 min-w-0">
              {editingId===party.id ? (
                <input value={editName} onChange={e=>setEditName(e.target.value)} className="bg-zinc-950 border border-zinc-700 rounded px-2 py-1 text-sm w-full" autoFocus onBlur={()=>setEditingId(null)} onKeyDown={e=>{ if(e.key==='Enter') { useStore.getState().updateParty(party.id, { name: editName }); setEditingId(null);} } } />
              ) : (
                <>
                  <div className="font-semibold text-[15px] truncate flex items-center gap-2">
                    {party.name}
                    {activePartyId===party.id && <span className="text-[10px] bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded font-bold uppercase">Active</span>}
                  </div>
                  <div className="text-[12px] text-zinc-400 mt-0.5">{party.playerCount} players • Level {party.averageLevel} avg • {new Date(party.updatedAt).toLocaleDateString()}</div>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {activePartyId!==party.id && (
                <button onClick={()=>selectParty(party.id)} className="text-[11px] bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded uppercase tracking-wide hover:bg-zinc-700">Select</button>
              )}
              <button onClick={()=>{ setEditingId(party.id); setEditName(party.name); }} className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">✏️</button>
              <button onClick={()=>deleteParty(party.id)} className="w-8 h-8 bg-red-950/50 border border-red-900/50 rounded flex items-center justify-center text-red-400">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {parties.length>0 && (
        <button onClick={()=>setActiveTab('generate')} className="w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-bold uppercase text-[13px] py-3 rounded tracking-wide">
          Continue to Generator →
        </button>
      )}
    </div>
  );
}
