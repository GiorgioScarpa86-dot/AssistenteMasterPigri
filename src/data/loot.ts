import { LootResult } from '../types';

const GEM_NAMES = [
  { name: 'Azurite', value: 10 },
  { name: 'Bloodstone', value: 50 },
  { name: 'Moonstone', value: 50 },
  { name: 'Amethyst', value: 100 },
  { name: 'Jade', value: 100 },
  { name: 'Pearl', value: 100 },
  { name: 'Sapphire', value: 500 },
  { name: 'Emerald', value: 1000 },
  { name: 'Ruby', value: 1000 },
  { name: 'Diamond', value: 5000 },
];

const ART_NAMES = [
  { name: 'Silver ewer', value: 25 },
  { name: 'Carved ivory statuette', value: 25 },
  { name: 'Gold bracelet', value: 25 },
  { name: 'Cloth-of-gold vestments', value: 250 },
  { name: 'Black velvet mask with silver stitching', value: 250 },
  { name: 'Copper chalice with filigree', value: 250 },
  { name: 'Silvered hunting horn', value: 750 },
  { name: 'Jeweled gold crown', value: 750 },
  { name: 'Jeweled platinum ring', value: 2500 },
  { name: 'Golden coffer with platinum filigree', value: 7500 },
];

const MAGIC_ITEMS_LOW = [
  'Potion of Healing',
  'Potion of Climbing',
  'Spell Scroll (Cantrip)',
  'Spell Scroll (1st level)',
  'Dust of Dryness (1 pinch)',
  'Keoghtom\'s Ointment (1 use)'
];

const MAGIC_ITEMS_MID = [
  'Bag of Holding',
  '+1 Weapon',
  '+1 Shield',
  'Cloak of Protection',
  'Wand of Magic Missiles',
  'Potion of Greater Healing',
  'Boots of Elvenkind',
  'Gloves of Thievery',
  'Lantern of Revealing',
  'Sending Stones'
];

const MAGIC_ITEMS_HIGH = [
  '+2 Weapon',
  'Flame Tongue',
  'Carpet of Flying',
  'Amulet of Health',
  'Belt of Giant Strength (Hill)',
  'Wand of Fireballs',
  'Potion of Invulnerability',
  'Ring of Protection',
  'Staff of Power (minor)',
];

const MAGIC_ITEMS_VERY_HIGH = [
  '+3 Weapon',
  'Vorpal Sword (legendary rumor)',
  'Staff of the Magi',
  'Holy Avenger (paladin)',
  'Robe of the Archmagi',
  'Ring of Wish (1 charge)',
  'Tome of Clear Thought',
];

function rollDice(count: number, sides: number): number {
  let total = 0;
  for (let i=0;i<count;i++) total += Math.floor(Math.random()*sides)+1;
  return total;
}

function randomItems(list: string[], count: number): string[] {
  const shuffled = [...list].sort(()=>0.5-Math.random());
  return shuffled.slice(0, count);
}

export function generateLoot(cr: number, type: 'individual' | 'hoard' = 'hoard'): LootResult {
  if (type === 'individual') {
    return generateIndividualLoot(cr);
  }
  return generateHoardLoot(cr);
}

function generateIndividualLoot(cr: number): LootResult {
  const cp = rollDice(6,6) * (cr < 5 ? 1 : 0);
  const sp = rollDice(3,6) * (cr < 5 ? 10 : 5);
  const ep = cr >= 5 ? rollDice(3,6)*10 : 0;
  const gp = cr >= 1 ? rollDice(2,6)*10 + (cr>=5 ? rollDice(2,6)*20 : 0) : rollDice(1,6)*5;
  const pp = cr >= 11 ? rollDice(1,6)*2 : 0;

  return {
    type: 'individual',
    coins: { cp, sp, ep, gp, pp },
    description: `Individual loot from defeated foes (CR ~${cr}). Quick coin, no hoard.`
  };
}

function generateHoardLoot(cr: number): LootResult {
  let tier: 0 | 1 | 2 | 3 = 0;
  if (cr <= 4) tier = 0;
  else if (cr <= 10) tier = 1;
  else if (cr <= 16) tier = 2;
  else tier = 3;

  let coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  let gems: { name: string; value: number; count: number }[] = [];
  let art: { name: string; value: number }[] = [];
  let magicItems: string[] = [];

  if (tier === 0) {
    coins = {
      cp: rollDice(6,6)*100,
      sp: rollDice(3,6)*100,
      ep: 0,
      gp: rollDice(2,6)*10,
      pp: 0
    };
    if (Math.random() < 0.6) {
      const count = rollDice(2,6);
      for (let i=0;i<count;i++) {
        const g = GEM_NAMES.filter(g=>g.value<=50)[Math.floor(Math.random()*3)];
        gems.push({ ...g, count: 1 });
      }
    }
    if (Math.random() < 0.3) {
      const count = rollDice(1,4);
      for (let i=0;i<count;i++) art.push(ART_NAMES.filter(a=>a.value<=250)[Math.floor(Math.random()*3)]);
    }
    if (Math.random() < 0.4) magicItems = randomItems(MAGIC_ITEMS_LOW, rollDice(1,4));
  } else if (tier === 1) {
    coins = {
      cp: 0,
      sp: 0,
      ep: rollDice(2,6)*100,
      gp: rollDice(6,6)*100,
      pp: rollDice(3,6)*10
    };
    if (Math.random() < 0.7) {
      const count = rollDice(3,6);
      for (let i=0;i<count;i++) {
        const g = GEM_NAMES.filter(g=>g.value>=100 && g.value<=500)[Math.floor(Math.random()*3)];
        gems.push({ ...g, count: 1 });
      }
    }
    if (Math.random() < 0.5) {
      const count = rollDice(2,4);
      for (let i=0;i<count;i++) art.push(ART_NAMES.filter(a=>a.value>=250 && a.value<=750)[Math.floor(Math.random()*4)]);
    }
    if (Math.random() < 0.6) magicItems = randomItems([...MAGIC_ITEMS_LOW, ...MAGIC_ITEMS_MID], rollDice(1,6));
  } else if (tier === 2) {
    coins = {
      cp: 0, sp: 0, ep: 0,
      gp: rollDice(4,6)*1000,
      pp: rollDice(5,6)*100
    };
    const countGems = rollDice(3,6);
    for (let i=0;i<countGems;i++) {
      const g = GEM_NAMES.filter(g=>g.value>=500)[Math.floor(Math.random()*3)];
      gems.push({ ...g, count: 1 });
    }
    const countArt = rollDice(3,6);
    for (let i=0;i<countArt;i++) art.push(ART_NAMES.filter(a=>a.value>=750)[Math.floor(Math.random()*3)]);
    magicItems = randomItems([...MAGIC_ITEMS_MID, ...MAGIC_ITEMS_HIGH], rollDice(1,4)+1);
  } else {
    coins = {
      cp: 0, sp: 0, ep: 0,
      gp: rollDice(12,6)*1000,
      pp: rollDice(8,6)*1000
    };
    const countGems = rollDice(3,6)+2;
    for (let i=0;i<countGems;i++) {
      const g = GEM_NAMES.filter(g=>g.value>=1000)[Math.floor(Math.random()*2)];
      gems.push({ ...g, count: 1 });
    }
    const countArt = rollDice(2,6)+2;
    for (let i=0;i<countArt;i++) art.push(ART_NAMES.filter(a=>a.value>=2500)[Math.floor(Math.random()*2)]);
    magicItems = randomItems([...MAGIC_ITEMS_HIGH, ...MAGIC_ITEMS_VERY_HIGH], rollDice(1,6)+1);
  }

  // aggregate gems
  const gemMap = new Map<string, { name: string; value: number; count: number }>();
  gems.forEach(g=>{
    const key = g.name;
    if (gemMap.has(key)) gemMap.get(key)!.count++;
    else gemMap.set(key, { ...g });
  });

  return {
    type: 'hoard',
    coins,
    gems: Array.from(gemMap.values()),
    art,
    magicItems,
    description: `Hoard tier ${tier} (CR ${cr}). ${tier===0?'Small chest':tier===1?'Locked coffer':tier===2?'Vault':'Dragon hoard'}`
  };
}
