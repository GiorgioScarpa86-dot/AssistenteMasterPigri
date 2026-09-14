import { NarrativeTwist } from '../types';

export const TWISTS: NarrativeTwist[] = [
  {
    id: 'reinforcements',
    title: 'Enemy Reinforcements',
    description: 'Horn blows - 1d4 additional monsters of same type arrive in 2 rounds from nearest door.',
    mechanic: 'Add 1d4 monsters to encounter. Players hear them coming, can prepare.',
    severity: 'major'
  },
  {
    id: 'third-party',
    title: 'Third Party Intrusion',
    description: 'A rival faction crashes the fight - they attack both sides indiscriminately.',
    mechanic: 'Introduce 1d3 neutral hostile creatures. They target nearest, regardless of side.',
    severity: 'major'
  },
  {
    id: 'collapse',
    title: 'Structural Collapse',
    description: 'Ceiling cracks! Area becomes difficult terrain, falling debris.',
    mechanic: 'All in 10ft radius DC13 DEX or 2d6 bludgeoning. Area becomes difficult terrain + half cover.',
    severity: 'major'
  },
  {
    id: 'darkness',
    title: 'Sudden Darkness',
    description: 'All torches snuffed by unnatural wind. Magical darkness for 1 minute.',
    mechanic: 'Heavily obscured. Creatures with darkvision see as dim. Dispel with light spell DC14.',
    severity: 'minor'
  },
  {
    id: 'weather',
    title: 'Weather Shift',
    description: 'Torrential rain / sandstorm erupts. Ranged attacks at disadvantage beyond 30ft.',
    mechanic: 'Ranged >30ft disadvantage. Fire damage halved. Perception -5. Lasts 1d4 rounds.',
    severity: 'minor'
  },
  {
    id: 'betrayal',
    title: 'NPC Betrayal',
    description: 'A friendly NPC reveals true allegiance and attacks from behind.',
    mechanic: 'One NPC becomes hostile, surprise attack with advantage. Social encounter becomes combat.',
    severity: 'deadly'
  },
  {
    id: 'hazard-activate',
    title: 'Hazard Activation',
    description: 'Ancient trap triggers - floor becomes lava / spikes / poison gas.',
    mechanic: 'All X tiles now deal 2d10 damage per round (DEX save half). Lasts until disabled DC15.',
    severity: 'major'
  },
  {
    id: 'wild-magic',
    title: 'Wild Magic Surge',
    description: 'Weave tears - random magical effect envelops battlefield.',
    mechanic: 'Roll on Wild Magic table. All spellcasters have +2/-2 to spell attack randomly for 1 minute.',
    severity: 'minor'
  },
  {
    id: 'hostage',
    title: 'Hostage Situation',
    description: 'Enemy grabs innocent / party member - threatens execution.',
    mechanic: 'Grappled hostage. Enemy readies action to kill if approached. Requires social or precise attack.',
    severity: 'major'
  },
  {
    id: 'escape-route',
    title: 'Escape Route Revealed',
    description: 'Wall crumbles revealing secret tunnel - enemies attempt to flee with loot.',
    mechanic: 'Enemies Dash to escape. If they escape, loot lost but combat ends. Players can chase.',
    severity: 'minor'
  },
  {
    id: 'enrage',
    title: 'Boss Enrage',
    description: 'Bloodied enemy enters frenzy - +2 attack, +1d6 damage, but -2 AC.',
    mechanic: 'Strongest monster: +2 hit, +1d6 dmg, -2 AC, advantage on STR saves. Lasts until dead.',
    severity: 'major'
  },
  {
    id: 'fog',
    title: 'Thick Fog',
    description: 'Mystical fog rolls in - visibility 10ft, everything heavily obscured beyond.',
    mechanic: 'Ranged attacks beyond 10ft auto-miss unless guess location. Melee has advantage if hidden.',
    severity: 'minor'
  },
  {
    id: 'cursed-ground',
    title: 'Cursed Ground',
    description: 'Necrotic energy rises - healing halved, undead gain +10 temp HP per round.',
    mechanic: 'Healing halved. Undead regen 10. Turn Undead at disadvantage. Dispel DC16.',
    severity: 'deadly'
  },
  {
    id: 'ally-arrives',
    title: 'Unexpected Ally',
    description: 'A potential ally arrives - but demands something in return for help.',
    mechanic: '1 helpful NPC appears, will fight if party promises favor / gold / quest. CR 1/2 helper.',
    severity: 'minor'
  },
  {
    id: 'time-pressure',
    title: 'Ticking Clock',
    description: 'Building on fire / ritual near completion - 5 rounds before catastrophe.',
    mechanic: '5 round timer. After, something terrible happens (collapse, summoning). Adds urgency.',
    severity: 'major'
  }
];

export function getRandomTwist(): NarrativeTwist {
  return TWISTS[Math.floor(Math.random()*TWISTS.length)];
}
