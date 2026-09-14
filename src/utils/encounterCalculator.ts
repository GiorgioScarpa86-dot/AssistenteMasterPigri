import { Difficulty, Monster, EncounterMonster, Encounter, BiomeId } from '../types';
import { MONSTERS, getMonstersByBiome } from '../data/monsters';
import { generateLoot } from '../data/loot';
import { getRandomTwist } from '../data/twists';
import { getBiomeById } from '../data/biomes';
import { generateTactics } from './tacticsGenerator';

// DMG p82 XP Thresholds per player
const XP_THRESHOLDS: Record<number, Record<Difficulty, number>> = {
  1: { Easy: 25, Medium: 50, Hard: 75, Deadly: 100 },
  2: { Easy: 50, Medium: 100, Hard: 150, Deadly: 200 },
  3: { Easy: 75, Medium: 150, Hard: 225, Deadly: 400 },
  4: { Easy: 125, Medium: 250, Hard: 375, Deadly: 500 },
  5: { Easy: 250, Medium: 500, Hard: 750, Deadly: 1100 },
  6: { Easy: 300, Medium: 600, Hard: 900, Deadly: 1400 },
  7: { Easy: 350, Medium: 750, Hard: 1100, Deadly: 1700 },
  8: { Easy: 450, Medium: 900, Hard: 1400, Deadly: 2100 },
  9: { Easy: 550, Medium: 1100, Hard: 1600, Deadly: 2400 },
  10: { Easy: 600, Medium: 1200, Hard: 1900, Deadly: 2800 },
  11: { Easy: 800, Medium: 1600, Hard: 2400, Deadly: 3600 },
  12: { Easy: 1000, Medium: 2000, Hard: 3000, Deadly: 4500 },
  13: { Easy: 1100, Medium: 2200, Hard: 3400, Deadly: 5100 },
  14: { Easy: 1250, Medium: 2500, Hard: 3800, Deadly: 5700 },
  15: { Easy: 1400, Medium: 2800, Hard: 4300, Deadly: 6400 },
  16: { Easy: 1600, Medium: 3200, Hard: 4800, Deadly: 7200 },
  17: { Easy: 2000, Medium: 3900, Hard: 5900, Deadly: 8800 },
  18: { Easy: 2100, Medium: 4200, Hard: 6300, Deadly: 9500 },
  19: { Easy: 2400, Medium: 4900, Hard: 7300, Deadly: 10900 },
  20: { Easy: 2800, Medium: 5600, Hard: 8500, Deadly: 12700 },
};

function getMultiplier(count: number): number {
  if (count <= 1) return 1;
  if (count === 2) return 1.5;
  if (count <= 6) return 2;
  if (count <= 10) return 2.5;
  if (count <= 14) return 3;
  return 4;
}

export function calculatePartyThreshold(playerCount: number, avgLevel: number, difficulty: Difficulty): number {
  const lvl = Math.max(1, Math.min(20, Math.round(avgLevel)));
  const perPlayer = XP_THRESHOLDS[lvl][difficulty];
  return perPlayer * playerCount;
}

export function calculateAdjustedXP(totalXP: number, monsterCount: number): number {
  return Math.floor(totalXP * getMultiplier(monsterCount));
}

interface GenerateParams {
  biome: BiomeId;
  difficulty: Difficulty;
  playerCount: number;
  avgLevel: number;
  includeTwist?: boolean;
  mapId?: string;
}

export function generateEncounter(params: GenerateParams): Encounter {
  const { biome, difficulty, playerCount, avgLevel, includeTwist, mapId } = params;
  
  const budget = calculatePartyThreshold(playerCount, avgLevel, difficulty);
  const biomeMonsters = getMonstersByBiome(biome);
  
  // Fallback to all monsters if biome has too few
  const pool = biomeMonsters.length >= 3 ? biomeMonsters : MONSTERS;

  // Determine CR range based on level and difficulty
  // Easy: avgLevel/4 to avgLevel/2, Medium: avgLevel/3 to avgLevel, Hard: avgLevel/2 to avgLevel+1, Deadly: avgLevel/2 to avgLevel+2
  let minCR = 0;
  let maxCR = 1;
  const lvl = Math.max(1, avgLevel);

  if (difficulty === 'Easy') {
    minCR = Math.max(0, lvl/4 - 1);
    maxCR = Math.max(0.25, lvl/2);
  } else if (difficulty === 'Medium') {
    minCR = Math.max(0.125, lvl/3);
    maxCR = Math.max(1, lvl);
  } else if (difficulty === 'Hard') {
    minCR = Math.max(0.25, lvl/2);
    maxCR = Math.max(2, lvl+1);
  } else {
    minCR = Math.max(0.5, lvl/2);
    maxCR = Math.max(3, lvl+2);
  }

  // Clamp
  maxCR = Math.min(15, maxCR);
  minCR = Math.min(maxCR, minCR);

  // Filter pool by CR
  let candidates = pool.filter(m => m.crNum >= minCR && m.crNum <= maxCR);
  if (candidates.length === 0) {
    // expand search
    candidates = pool.filter(m => m.crNum >= minCR-1 && m.crNum <= maxCR+1);
  }
  if (candidates.length === 0) candidates = pool.slice(0,10);

  // Try to build encounter close to budget
  let attempts = 0;
  let best: { monsters: EncounterMonster[], totalXP: number, adjustedXP: number, diffScore: number } | null = null;

  while (attempts < 100) {
    attempts++;
    const monsterCountTarget = difficulty === 'Easy' ? (Math.random()<0.7?1:2) :
                               difficulty === 'Medium' ? (Math.floor(Math.random()*3)+1) :
                               difficulty === 'Hard' ? (Math.floor(Math.random()*4)+2) :
                               (Math.floor(Math.random()*5)+2);

    const selected: Map<string, { monster: Monster, count: number }> = new Map();
    let totalXP = 0;
    let totalCount = 0;

    // Pick primary monster
    const primary = candidates[Math.floor(Math.random()*candidates.length)];
    const primaryCount = Math.max(1, Math.min(monsterCountTarget, Math.floor(Math.random()*monsterCountTarget)+1));
    
    // Adjust count to fit budget roughly
    let count = primaryCount;
    // Estimate adjusted
    let adjusted = calculateAdjustedXP(primary.xp * count, count);
    // If over budget by >50%, reduce
    while (adjusted > budget * 1.5 && count > 1) {
      count--;
      adjusted = calculateAdjustedXP(primary.xp * count, count);
    }
    // If under budget by a lot, maybe increase or add second type
    if (adjusted < budget * 0.5) {
      // try adding more of same or different
      if (Math.random() < 0.6) {
        const extra = Math.min(3, Math.floor((budget - adjusted) / primary.xp));
        count += extra;
      }
    }

    selected.set(primary.id, { monster: primary, count });
    totalXP = primary.xp * count;
    totalCount = count;

    // Possibly add secondary monster type (combo)
    if (Math.random() < 0.5 && totalCount < 8) {
      const secondaryPool = candidates.filter(m=>m.id!==primary.id);
      if (secondaryPool.length>0) {
        const secondary = secondaryPool[Math.floor(Math.random()*secondaryPool.length)];
        const secCount = Math.floor(Math.random()*2)+1;
        // check budget
        const newTotal = totalXP + secondary.xp*secCount;
        const newAdjusted = calculateAdjustedXP(newTotal, totalCount+secCount);
        if (newAdjusted <= budget*1.8) {
          selected.set(secondary.id, { monster: secondary, count: secCount });
          totalXP = newTotal;
          totalCount += secCount;
        }
      }
    }

    const finalAdjusted = calculateAdjustedXP(totalXP, totalCount);
    const diffScore = Math.abs(finalAdjusted - budget);

    if (!best || diffScore < best.diffScore) {
      best = {
        monsters: Array.from(selected.values()),
        totalXP,
        adjustedXP: finalAdjusted,
        diffScore
      };
    }

    // If within 20% of budget, good enough
    if (finalAdjusted >= budget*0.7 && finalAdjusted <= budget*1.3) {
      break;
    }
  }

  if (!best) {
    // fallback
    const m = candidates[0];
    best = { monsters: [{ monster: m, count: 1 }], totalXP: m.xp, adjustedXP: m.xp, diffScore: 0 };
  }

  // Generate description
  const biomeInfo = getBiomeById(biome);
  const descriptions = [
    `A ${difficulty.toLowerCase()} threat lurks in the ${biomeInfo.name.toLowerCase()}. ${biomeInfo.environment}`,
    `${best.monsters.map(em=>`${em.count}x ${em.monster.name}`).join(' and ')} have made this ${biome} their territory.`,
    `The party stumbles into ${best.monsters[0].monster.name.toLowerCase()} territory - ${biomeInfo.hazards[0].toLowerCase()}.`
  ];

  const lootCR = Math.max(...best.monsters.map(m=>m.monster.crNum));
  const loot = generateLoot(lootCR, Math.random()<0.7 ? 'hoard' : 'individual');

  const tactics = generateTactics(best.monsters.map(em=>em.monster), biome, difficulty);

  return {
    id: Math.random().toString(36).slice(2,10),
    biome,
    difficulty,
    monsters: best.monsters,
    totalXP: best.totalXP,
    adjustedXP: best.adjustedXP,
    budget,
    description: descriptions[Math.floor(Math.random()*descriptions.length)],
    tactics,
    loot,
    twist: includeTwist ? getRandomTwist() : undefined,
    mapId
  };
}

export { XP_THRESHOLDS };
