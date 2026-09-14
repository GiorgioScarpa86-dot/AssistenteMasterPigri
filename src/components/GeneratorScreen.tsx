import { useStore } from '../store/useStore';
import { BIOMES } from '../data/biomes';
import { Difficulty } from '../types';

export function GeneratorScreen() {
  const {
    selectedBiome, setBiome,
    selectedDifficulty, setDifficulty,
    mapSize, setMapSize,
    deusExEnabled, setDeusEx,
    playerCount, setPlayerCount,
    avgLevel, setAvgLevel,
    activePartyId, parties,
    generateAll, isGenerating
  } = useStore();

  const activeParty = parties.find(p=>p.id===activePartyId);

  const difficulties: Difficulty[] = ['Easy','Medium','Hard','Deadly'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-28 space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Encounter Forge</h2>
        <p className="text-[13px] text-zinc-400 mt-1">Semantic cohesion: biome → map → monsters → tactics. RAW XP math.</p>
      </div>

      {/* Active party quick adjust */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Party Tuning</h3>
          {activeParty && <span className="text-[11px] text-zinc-500">{activeParty.name}</span>}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-[11px] uppercase text-zinc-500">Players (1-8)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setPlayerCount(playerCount-1)} className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded font-bold">−</button>
              <div className="flex-1 text-center font-mono text-xl font-bold">{playerCount}</div>
              <button onClick={()=>setPlayerCount(playerCount+1)} className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded font-bold">+</button>
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase text-zinc-500">Avg Level (1-20)</label>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={()=>setAvgLevel(avgLevel-1)} className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded font-bold">−</button>
              <div className="flex-1 text-center font-mono text-xl font-bold">{avgLevel}</div>
              <button onClick={()=>setAvgLevel(avgLevel+1)} className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded font-bold">+</button>
            </div>
          </div>
        </div>
        <div className="mt-3 text-[11px] text-zinc-500 font-mono">
          XP Budget {selectedDifficulty}: {(() => {
            const thresholds: Record<number, Record<string, number>> = {
              1:{Easy:25,Medium:50,Hard:75,Deadly:100},
              2:{Easy:50,Medium:100,Hard:150,Deadly:200},
              3:{Easy:75,Medium:150,Hard:225,Deadly:400},
              4:{Easy:125,Medium:250,Hard:375,Deadly:500},
              5:{Easy:250,Medium:500,Hard:750,Deadly:1100},
            };
            // simplified calc display using same logic as util
            const lvl = Math.max(1, Math.min(20, Math.round(avgLevel)));
            const map: Record<string, number> = {Easy:25,Medium:50,Hard:75,Deadly:100}; // placeholder, real calc in store
            // We'll compute properly via imported function if needed, but quick approx:
            return `${playerCount} × Level ${lvl} = ~${(() => {
              const table: Record<number, any> = {
                1:{Easy:25,Medium:50,Hard:75,Deadly:100},
                2:{Easy:50,Medium:100,Hard:150,Deadly:200},
                3:{Easy:75,Medium:150,Hard:225,Deadly:400},
                4:{Easy:125,Medium:250,Hard:375,Deadly:500},
                5:{Easy:250,Medium:500,Hard:750,Deadly:1100},
                6:{Easy:300,Medium:600,Hard:900,Deadly:1400},
                7:{Easy:350,Medium:750,Hard:1100,Deadly:1700},
                8:{Easy:450,Medium:900,Hard:1400,Deadly:2100},
                9:{Easy:550,Medium:1100,Hard:1600,Deadly:2400},
                10:{Easy:600,Medium:1200,Hard:1900,Deadly:2800},
                11:{Easy:800,Medium:1600,Hard:2400,Deadly:3600},
                12:{Easy:1000,Medium:2000,Hard:3000,Deadly:4500},
                13:{Easy:1100,Medium:2200,Hard:3400,Deadly:5100},
                14:{Easy:1250,Medium:2500,Hard:3800,Deadly:5700},
                15:{Easy:1400,Medium:2800,Hard:4300,Deadly:6400},
                16:{Easy:1600,Medium:3200,Hard:4800,Deadly:7200},
                17:{Easy:2000,Medium:3900,Hard:5900,Deadly:8800},
                18:{Easy:2100,Medium:4200,Hard:6300,Deadly:9500},
                19:{Easy:2400,Medium:4900,Hard:7300,Deadly:10900},
                20:{Easy:2800,Medium:5600,Hard:8500,Deadly:12700},
              };
              const per = table[lvl]?.[selectedDifficulty] ?? 0;
              return per*playerCount;
            })()} XP`;
          })()}
        </div>
      </div>

      {/* Biome */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-3">Biome / Location</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BIOMES.map(b => (
            <button
              key={b.id}
              onClick={()=>setBiome(b.id)}
              className={`p-3 rounded border text-left transition-all ${
                selectedBiome===b.id ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/20' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="text-[18px]">{b.icon}</div>
              <div className="font-semibold text-[12px] mt-1 leading-tight">{b.name}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{b.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-400 mb-3">Difficulty (DMG RAW)</h3>
        <div className="grid grid-cols-4 gap-2">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={()=>setDifficulty(d)}
              className={`py-3 rounded border font-bold text-[12px] uppercase tracking-wide transition-colors ${
                selectedDifficulty===d
                  ? d==='Deadly' ? 'bg-red-500 text-white border-red-500' : d==='Hard' ? 'bg-orange-500 text-zinc-950 border-orange-500' : d==='Medium' ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-emerald-500 text-zinc-950 border-emerald-500'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500 mt-2">Multiplier: 1× (1 monster) • 1.5× (2) • 2× (3-6) • 2.5× (7-10) • 3× (11-14) • 4× (15+)</p>
      </div>

      {/* Options */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Options</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium">Map Size</div>
            <div className="text-[11px] text-zinc-500">Roll20 grid: 1 tile = 5ft</div>
          </div>
          <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded p-1">
            <button onClick={()=>setMapSize(20)} className={`px-3 py-1.5 rounded text-[12px] font-mono ${mapSize===20?'bg-zinc-800 text-white':'text-zinc-500'}`}>20×20</button>
            <button onClick={()=>setMapSize(30)} className={`px-3 py-1.5 rounded text-[12px] font-mono ${mapSize===30?'bg-zinc-800 text-white':'text-zinc-500'}`}>30×30</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[13px] font-medium flex items-center gap-2">Deus Ex Machina <span className="text-[10px] bg-violet-900/50 border border-violet-800 text-violet-300 px-1.5 py-0.5 rounded uppercase">Twist</span></div>
            <div className="text-[11px] text-zinc-500">Random narrative hazard / shift</div>
          </div>
          <button
            onClick={()=>setDeusEx(!deusExEnabled)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${deusExEnabled ? 'bg-amber-500' : 'bg-zinc-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${deusExEnabled ? 'translate-x-5' : ''}`}></div>
          </button>
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={generateAll}
        disabled={isGenerating}
        className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-black tracking-widest uppercase text-[14px] py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin"></span>
            FORGING...
          </>
        ) : (
          <>🎲 GENERATE ENCOUNTER</>
        )}
      </button>

      <p className="text-[11px] text-zinc-500 text-center">Semantic cohesion enforced: Tavern won't spawn wolves, forest won't spawn thugs.</p>
    </div>
  );
}
