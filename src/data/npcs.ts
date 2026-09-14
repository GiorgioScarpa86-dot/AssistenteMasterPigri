import { NPC, BiomeId } from '../types';

const NAMES = {
  human: ['Eldric','Mira','Joren','Kaela','Borin','Lyssa','Thom','Varric','Elara','Gideon','Sable','Orin'],
  elf: ['Aelindra','Thalion','Lyris','Faelar','Sylwen','Erevan','Liriel','Caelum'],
  dwarf: ['Borin Stonefoot','Dagna Ironbraid','Thorin Oakenshield','Bruni Frostbeard','Gimli Jr.','Helga'],
  halfling: ['Milo','Pippa','Finn','Rosie','Samwise','Tilly'],
  orc: ['Grok','Mogha','Urzul','Krag','Shara'],
  tiefling: ['Zara','Xyris','Mordai','Lilith','Karn'],
  goblin: ['Skrit','Grix','Nibs','Pox','Zik'],
  dragonborn: ['Drakthar','Ember','Saphira','Rhogar']
};

const ROLES = ['Innkeeper','Guard Captain','Thief','Herbalist','Blacksmith','Beggar','Noble','Cultist','Bounty Hunter','Smuggler','Scholar','Priest','Mercenary','Fence','Street Urchin'];

const VISUALS = [
  'Scar across left eye, never blinks',
  'Hands stained with ink, always writing',
  'Wears mismatched boots, one too big',
  'Silver tooth glints when lying',
  'Tattoo of spider covering neck',
  'Eyes dart constantly, paranoid',
  'Missing two fingers, whistles when speaking',
  'Perfumed heavily to hide rot smell',
  'Carries broken lute, hums off-key',
  'Albino, sensitive to light, wears hood',
  'Burn scars on forearms, former smith',
  'Jade earrings, clicks them when thinking'
];

const SECRETS = [
  'Is actually a doppelganger scouting the party',
  'Owes 500gp to the Zhentarim, desperate',
  'Knows location of hidden vault under city',
  'Poisoned the last adventuring party for gold',
  'Is cursed to turn into a rat at midnight',
  'Secretly worships Asmodeus, hides holy symbol',
  'Has a twin locked in basement, talks to them',
  'Is the missing heir presumed dead',
  'Steals from temple donations, guilt-ridden',
  'Can speak to rats, uses them as spies',
  'Was a former adventurer who abandoned party',
  'Holds deed to haunted manor, wants rid of it'
];

const MOTIVES = [
  'Wants party to eliminate rival gang',
  'Seeks revenge for murdered sibling',
  'Needs escort through dangerous territory',
  'Wants to hire party to retrieve stolen heirloom',
  'Plans to betray party to authorities for reward',
  'Desperately seeks cure for sick child',
  'Wants to join party as guide, but is liability',
  'Offers info in exchange for protection',
  'Tries to sell cursed item as treasure',
  'Wants party to smuggle contraband'
];

const QUIRKS = [
  'Repeats last word of every sentence',
  'Only speaks in questions',
  'Counts coins obsessively mid-conversation',
  'Laughs at inappropriate moments',
  'Refuses to make eye contact',
  'Speaks in third person',
  'Mimics accents of who they talk to',
  'Never uses contractions',
  'Taps rhythm on table constantly',
  'Collects teeth, offers to buy party’s'
];

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random()*arr.length)];
}

export function generateNPC(biome: BiomeId): NPC {
  const races = Object.keys(NAMES) as (keyof typeof NAMES)[];
  const race = random(races);
  const name = random(NAMES[race]);
  const role = random(ROLES);
  const visual = random(VISUALS);
  const secret = random(SECRETS);
  const motive = random(MOTIVES);
  const quirk = random(QUIRKS);
  
  const levelTier = Math.floor(Math.random()*4)+1;
  const ac = 10 + levelTier + Math.floor(Math.random()*4);
  const hp = 10 + levelTier*8 + Math.floor(Math.random()*10);
  const attacks = [
    `+${3+levelTier} to hit, 1d6+${levelTier} dmg (Dagger)`,
    `+${2+levelTier} to hit, 1d8+${levelTier} dmg (Crossbow 80/320)`,
    `+${4+levelTier} to hit, 2d6+${levelTier} dmg (Greatsword)`,
    `Spell: Firebolt +${3+levelTier}, 2d10 fire`
  ];

  return {
    id: Math.random().toString(36).slice(2,9),
    name,
    race: race.charAt(0).toUpperCase()+race.slice(1),
    role,
    visualTrait: visual,
    secret,
    motive,
    ac,
    hp,
    speed: '30 ft',
    attack: random(attacks),
    biome,
    quirk
  };
}

export function generateNPCs(count: number, biome: BiomeId): NPC[] {
  return Array.from({length: count}, () => generateNPC(biome));
}
