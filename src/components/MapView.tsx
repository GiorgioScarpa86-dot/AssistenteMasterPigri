import { useStore } from '../store/useStore';

export function MapView() {
  const { currentMap, regenerateMap } = useStore();

  if (!currentMap) return null;

  const copyMap = () => {
    const text = currentMap.grid.map(row => row.join('')).join('\n');
    navigator.clipboard.writeText(text);
    alert('Map copied to clipboard! Paste into Roll20 or notes.');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-3 flex items-center justify-between border-b border-zinc-800">
        <div>
          <h3 className="font-bold text-[13px] uppercase tracking-wide">Procedural Map • {currentMap.width}×{currentMap.height}</h3>
          <p className="text-[11px] text-zinc-500">{currentMap.description}</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={regenerateMap} className="bg-zinc-800 border border-zinc-700 text-[11px] px-2.5 py-1.5 rounded uppercase">↻ Reroll</button>
          <button onClick={copyMap} className="bg-amber-500 text-zinc-950 text-[11px] px-2.5 py-1.5 rounded uppercase font-bold">Copy ASCII</button>
        </div>
      </div>

      <div className="p-3 bg-zinc-950 overflow-auto">
        <div className="map-grid text-[10px] sm:text-[11px] leading-[1.1] whitespace-pre inline-block bg-black p-2 rounded border border-zinc-800">
          {currentMap.grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                let color = 'text-zinc-600';
                if (cell === '#') color = 'text-zinc-100 font-bold';
                else if (cell === '.') color = 'text-zinc-600';
                else if (cell === 'D') color = 'text-amber-400 font-bold';
                else if (cell === 'X') color = 'text-red-400 font-bold';
                else if (cell === '~') color = 'text-sky-400';
                else if (cell === '^') color = 'text-stone-400';
                return <span key={x} className={`${color} w-[0.65em] text-center`}>{cell}</span>;
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
        <div>
          <div className="font-bold uppercase tracking-wide text-zinc-400 mb-1">Legend</div>
          <div className="space-y-0.5 font-mono">
            {Object.entries(currentMap.legend).map(([k,v])=>(
              <div key={k} className="flex gap-2"><span className="w-4 text-center font-bold">{k}</span><span className="text-zinc-500">{v}</span></div>
            ))}
          </div>
        </div>
        <div>
          <div className="font-bold uppercase tracking-wide text-zinc-400 mb-1">Features</div>
          <ul className="space-y-1 text-zinc-300">
            {currentMap.features.map((f,i)=><li key={i} className="flex gap-1.5"><span className="text-amber-500">•</span>{f}</li>)}
          </ul>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="bg-zinc-950 border border-zinc-800 rounded p-2 text-[10px] text-zinc-500 font-mono">
          Roll20 tip: Create map layer, set grid to {currentMap.width}×{currentMap.height}, paste this as notes, then draw walls on # tiles. D = doors, X = hazards/traps.
        </div>
      </div>
    </div>
  );
}
