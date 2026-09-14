import { Monster, Difficulty, BiomeId } from '../types';
import { getBiomeById } from '../data/biomes';

export function generateTactics(monsters: Monster[], biome: BiomeId, difficulty: Difficulty): string[] {
  const tactics: string[] = [];
  const biomeInfo = getBiomeById(biome);

  // Add official pack tactics if present
  monsters.forEach(m => {
    if (m.isPackTactics) {
      tactics.push(`🐺 ${m.name} - PACK TACTICS: Advantage on attack if ally within 5ft of target. ${m.tactics || 'Swarm one target.'}`);
    } else if (m.tactics) {
      tactics.push(`⚔️ ${m.name}: ${m.tactics}`);
    }
  });

  // Generate synergistic combos if multiple monster types
  if (monsters.length > 1) {
    const [a, b] = monsters;
    if (a && b) {
      const combos = [
        `Combo: ${a.name} grapples/restrains, then ${b.name} attacks restrained target with advantage.`,
        `If ${a.name} casts area control (Entangle/Faerie Fire), ${b.name} focuses lit/restrained foes.`,
        `${a.name} harasses backline casters while ${b.name} holds frontline.`,
        `${b.name} uses Help action to grant ${a.name} advantage on big attack.`,
        `Flanking: ${a.name} and ${b.name} position opposite sides of highest AC target for advantage.`
      ];
      tactics.push(combos[Math.floor(Math.random()*combos.length)]);
    }
  }

  // Environment-based tactics
  const envTactics: Record<string, string[]> = {
    tavern: [
      'Use tables for half cover (+2 AC). Flip table as action.',
      'Barman throws bottle - improvised ranged, DC12 DEX or 1d4 + blinded 1 round.',
      'Crowd provides difficult terrain, can hide in crowd as bonus action.'
    ],
    dungeon: [
      'Monsters know trap locations, shove PCs into X hazards (STR contest).',
      'Use D doors to bottleneck - hold door closed while ranged attack through gap.',
      'One monster disengages to pull lever, activating hazard in 1d2 rounds.'
    ],
    forest: [
      'Ranged attackers climb trees (#) for 10ft elevation + half cover.',
      'Monsters use foliage to Hide as bonus action (Stealth +5).',
      'Entangling roots (X) - if PC ends turn on X, DC12 STR or restrained until start of next turn.'
    ],
    desert: [
      'Heat: CON save DC12 each hour or 1 level exhaustion. Monsters resistant.',
      'Sandstorm gust - ranged beyond 30ft at disadvantage, fire halved.',
      'Quicksand X - fall prone, DC13 STR to escape, restrained while in.'
    ],
    sewers: [
      'Slimy floor: Dash requires DC10 Acrobatics or fall prone.',
      'Disease pool X - DC12 CON or poisoned 1 minute, 1d4 poison at start of turn.',
      'Monsters use pipes to climb and drop from above for surprise.'
    ],
    mountain: [
      'High ground: monsters on rocks have +2 attack from elevation.',
      'Loose scree X - moving through requires 2x movement, DC11 DEX or prone.',
      'Wind gust - small creatures DC10 STR or pushed 5ft toward cliff.'
    ],
    swamp: [
      'Deep water X = difficult terrain, 1/2 speed, Stealth disadvantage.',
      'Fog - heavily obscured beyond 15ft, monsters with blindsight unaffected.',
      'Leeches: if PC ends turn in water, 1d4 necrotic, speed -5 until removed.'
    ],
    arctic: [
      'Extreme cold: DC13 CON each hour or exhaustion. Fire deals +1d4 extra.',
      'Ice sheet X - DC12 Acrobatics or prone, slide 10ft random direction.',
      'Whiteout: visibility 20ft, ranged disadvantage beyond.'
    ],
    city: [
      'Crowd: moving through crowd is difficult terrain, can Shove crowd to create path.',
      'Guards arrive in 1d4+2 rounds - both sides must consider law.',
      'Rooftops: monsters on roofs have cover, can drop tiles (1d6 bludgeoning, DC11 DEX).'
    ],
    cave: [
      'Stalactites: ranged attack can drop them (AC15, 10hp) - 2d6 piercing in 5ft radius.',
      'Echo: Thunder damage doubled, alerts other caves (more monsters in 1d4 rounds).',
      'Darkness: without light, blinded. Monsters with darkvision hunt.'
    ],
    ruins: [
      'Unstable floor X - DC13 DEX or fall 10ft to lower level 1d6 bludgeoning.',
      'Ancient altar grants +1d4 to spell attacks if blood sacrifice (1d6 dmg).',
      'Collapsed column provides total cover, but may collapse if hit (DC14).'
    ],
    coast: [
      'High tide: water ~ rises 5ft per round, swallowing low ground.',
      'Slippery seaweed X - DC11 DEX or prone, difficult terrain.',
      'Gulls: swarm distracts - CONcentration checks at disadvantage near coast.'
    ],
    underdark: [
      'Faerzress: wild magic - spell DC +2/-2 randomly, teleport mishap on nat 1.',
      'Webs X - DC12 STR or restrained, flammable (5ft fire destroys, 2d4 fire to restrained).',
      'Silence: sound dampened - Perception hearing disadvantage, but Stealth advantage.'
    ]
  };

  const env = envTactics[biome] || envTactics['dungeon'];
  tactics.push(`🌍 ENV (${biomeInfo.name}): ${env[Math.floor(Math.random()*env.length)]}`);

  // Difficulty-based extra
  if (difficulty === 'Hard' || difficulty === 'Deadly') {
    const advanced = [
      `Focus Fire Protocol: All monsters target lowest HP PC to force death saves, then split.`,
      `Caster Disruption: One monster readies action to attack when PC casts - forces CON save.`,
      `Flank Highest AC: Two monsters flank tank (Advantage) while others swarm squishy.`,
      `Retreat & Regroup: If bloodied (<50% HP), monster Disengages to chokepoint D and drinks potion.`,
      `Lair Action (1/round, init 20): ${biomeInfo.hazards[0]} triggers - all PCs DC13 save or suffer.`,
      `Moral Check: If leader drops, minions DC12 WIS save or flee. Use this to end combat early.`
    ];
    tactics.push(`💀 ${advanced[Math.floor(Math.random()*advanced.length)]}`);
  }

  if (difficulty === 'Deadly') {
    tactics.push(`☠️ DEADLY: Monsters have +1d6 temp HP from adrenaline, use cover, and target healers first. If party drops, they stabilize to capture, not kill - for leverage.`);
  }

  // Remove duplicates
  return [...new Set(tactics)].slice(0, 6);
}
