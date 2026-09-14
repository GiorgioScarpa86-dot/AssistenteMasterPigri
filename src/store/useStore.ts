import { create } from 'zustand';
import { Party, Encounter, MapData, BiomeId, Difficulty, NPC } from '../types';
import { generateEncounter } from '../utils/encounterCalculator';
import { generateMap } from '../utils/mapGenerator';
import { generateNPCs } from '../data/npcs';
import { db, auth, isConfigured, ensureAuth } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

interface AppState {
  // Party
  parties: Party[];
  activePartyId: string | null;
  playerCount: number;
  avgLevel: number;
  isLoadingParties: boolean;

  // Generator
  selectedBiome: BiomeId;
  selectedDifficulty: Difficulty;
  mapSize: 20 | 30;
  deusExEnabled: boolean;

  // Results
  currentEncounter: Encounter | null;
  currentMap: MapData | null;
  currentNPCs: NPC[];
  isGenerating: boolean;

  // UI
  activeTab: 'party' | 'generate' | 'encounter' | 'npcs';

  // Actions
  setActiveTab: (tab: AppState['activeTab']) => void;
  setBiome: (biome: BiomeId) => void;
  setDifficulty: (diff: Difficulty) => void;
  setMapSize: (size: 20 | 30) => void;
  setDeusEx: (enabled: boolean) => void;
  setPlayerCount: (count: number) => void;
  setAvgLevel: (level: number) => void;

  // Party CRUD
  loadParties: () => Promise<void>;
  createParty: (name: string, count: number, level: number) => Promise<void>;
  updateParty: (id: string, data: Partial<Party>) => Promise<void>;
  deleteParty: (id: string) => Promise<void>;
  selectParty: (id: string) => void;

  // Generation
  generateAll: () => Promise<void>;
  generateNPCsOnly: (count?: number) => void;
  regenerateMap: () => void;
}

const LOCAL_KEY = 'masterpigri_parties';

function loadLocalParties(): Party[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalParties(parties: Party[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(parties));
}

export const useStore = create<AppState>((set, get) => ({
  parties: [],
  activePartyId: null,
  playerCount: 4,
  avgLevel: 3,
  isLoadingParties: false,

  selectedBiome: 'dungeon',
  selectedDifficulty: 'Medium',
  mapSize: 20,
  deusExEnabled: false,

  currentEncounter: null,
  currentMap: null,
  currentNPCs: [],
  isGenerating: false,

  activeTab: 'party',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setBiome: (biome) => set({ selectedBiome: biome }),
  setDifficulty: (diff) => set({ selectedDifficulty: diff }),
  setMapSize: (size) => set({ mapSize: size }),
  setDeusEx: (enabled) => set({ deusExEnabled: enabled }),
  setPlayerCount: (count) => set({ playerCount: Math.max(1, Math.min(8, count)) }),
  setAvgLevel: (level) => set({ avgLevel: Math.max(1, Math.min(20, level)) }),

  loadParties: async () => {
    set({ isLoadingParties: true });
    try {
      if (isConfigured && db) {
        const user = await ensureAuth();
        if (user) {
          const q = query(collection(db, 'parties'), where('ownerId', '==', user.uid));
          const snap = await getDocs(q);
          const parties: Party[] = snap.docs.map(d => d.data() as Party);
          parties.sort((a,b)=>b.updatedAt-a.updatedAt);
          set({ parties, isLoadingParties: false });
          if (parties.length>0 && !get().activePartyId) {
            const first = parties[0];
            set({ activePartyId: first.id, playerCount: first.playerCount, avgLevel: first.averageLevel });
          }
          return;
        }
      }
      // offline fallback
      const local = loadLocalParties();
      set({ parties: local, isLoadingParties: false });
      if (local.length>0 && !get().activePartyId) {
        const first = local[0];
        set({ activePartyId: first.id, playerCount: first.playerCount, avgLevel: first.averageLevel });
      }
    } catch (e) {
      console.warn('loadParties failed', e);
      const local = loadLocalParties();
      set({ parties: local, isLoadingParties: false });
    }
  },

  createParty: async (name, count, level) => {
    const newParty: Party = {
      id: Math.random().toString(36).slice(2,10),
      name: name || `Party ${get().parties.length+1}`,
      playerCount: count,
      averageLevel: level,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      if (isConfigured && db && auth?.currentUser) {
        newParty.ownerId = auth.currentUser.uid;
        await setDoc(doc(db, 'parties', newParty.id), newParty);
      }
    } catch (e) {
      console.warn('Firestore save failed, using local', e);
    }

    const updated = [newParty, ...get().parties];
    set({ parties: updated, activePartyId: newParty.id, playerCount: newParty.playerCount, avgLevel: newParty.averageLevel });
    saveLocalParties(updated);
  },

  updateParty: async (id, data) => {
    const updated = get().parties.map(p => p.id===id ? { ...p, ...data, updatedAt: Date.now() } : p);
    set({ parties: updated });
    saveLocalParties(updated);
    const active = updated.find(p=>p.id===id);
    if (active && get().activePartyId===id) {
      set({ playerCount: active.playerCount, avgLevel: active.averageLevel });
    }
    try {
      if (isConfigured && db) {
        await setDoc(doc(db, 'parties', id), { ...data, updatedAt: Date.now() }, { merge: true });
      }
    } catch {}
  },

  deleteParty: async (id) => {
    const filtered = get().parties.filter(p=>p.id!==id);
    set({ parties: filtered, activePartyId: filtered[0]?.id || null });
    saveLocalParties(filtered);
    try {
      if (isConfigured && db) {
        await deleteDoc(doc(db, 'parties', id));
      }
    } catch {}
  },

  selectParty: (id) => {
    const p = get().parties.find(p=>p.id===id);
    if (p) {
      set({ activePartyId: id, playerCount: p.playerCount, avgLevel: p.averageLevel });
    }
  },

  generateAll: async () => {
    const { selectedBiome, selectedDifficulty, playerCount, avgLevel, mapSize, deusExEnabled } = get();
    set({ isGenerating: true });
    // small delay for UX
    await new Promise(r=>setTimeout(r, 300));
    
    const map = generateMap(selectedBiome, mapSize);
    const encounter = generateEncounter({
      biome: selectedBiome,
      difficulty: selectedDifficulty,
      playerCount,
      avgLevel,
      includeTwist: deusExEnabled,
      mapId: map.id
    });

    const npcs = generateNPCs(3, selectedBiome);

    set({ currentMap: map, currentEncounter: encounter, currentNPCs: npcs, isGenerating: false, activeTab: 'encounter' });
  },

  generateNPCsOnly: (count=3) => {
    const { selectedBiome } = get();
    set({ currentNPCs: generateNPCs(count, selectedBiome) });
  },

  regenerateMap: () => {
    const { selectedBiome, mapSize } = get();
    set({ currentMap: generateMap(selectedBiome, mapSize) });
  }
}));
