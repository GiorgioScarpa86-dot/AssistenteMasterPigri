export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Deadly';

export type BiomeId = 
  | 'tavern'
  | 'dungeon'
  | 'forest'
  | 'desert'
  | 'sewers'
  | 'mountain'
  | 'swamp'
  | 'arctic'
  | 'city'
  | 'cave'
  | 'ruins'
  | 'coast'
  | 'underdark';

export interface Party {
  id: string;
  name: string;
  playerCount: number;
  averageLevel: number;
  playerLevels?: number[];
  createdAt: number;
  updatedAt: number;
  ownerId?: string;
}

export interface Monster {
  id: string;
  name: string;
  cr: string;
  crNum: number;
  xp: number;
  ac: number;
  hp: number;
  speed: string;
  type: string;
  alignment: string;
  biomes: BiomeId[];
  traits: string[];
  actions: { name: string; desc: string }[];
  tactics?: string;
  isPackTactics?: boolean;
}

export interface EncounterMonster {
  monster: Monster;
  count: number;
}

export interface Encounter {
  id: string;
  biome: BiomeId;
  difficulty: Difficulty;
  monsters: EncounterMonster[];
  totalXP: number;
  adjustedXP: number;
  budget: number;
  description: string;
  tactics: string[];
  loot: LootResult;
  twist?: NarrativeTwist;
  mapId?: string;
}

export interface MapData {
  id: string;
  biome: BiomeId;
  width: number;
  height: number;
  grid: string[][];
  legend: Record<string, string>;
  description: string;
  features: string[];
}

export interface LootResult {
  type: 'individual' | 'hoard';
  coins: { cp: number; sp: number; ep: number; gp: number; pp: number };
  gems?: { name: string; value: number; count: number }[];
  art?: { name: string; value: number }[];
  magicItems?: string[];
  description: string;
}

export interface NarrativeTwist {
  id: string;
  title: string;
  description: string;
  mechanic: string;
  severity: 'minor' | 'major' | 'deadly';
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  role: string;
  visualTrait: string;
  secret: string;
  motive: string;
  ac: number;
  hp: number;
  speed: string;
  attack: string;
  biome: BiomeId;
  quirk: string;
}

export interface Biome {
  id: BiomeId;
  name: string;
  icon: string;
  description: string;
  color: string;
  environment: string;
  hazards: string[];
  mapStyle: 'rooms' | 'forest' | 'cave' | 'open' | 'urban';
}
