import { Biome } from '../types';

export const BIOMES: Biome[] = [
  {
    id: 'tavern',
    name: 'Tavern / Inn',
    icon: '🍺',
    description: 'Crowded taproom with shady deals',
    color: 'bg-amber-900',
    environment: 'Warm interior with wooden tables, fireplace, bar counter. Dim lantern light.',
    hazards: ['Drunken brawl', 'Spilled oil - slippery', 'Broken bottles'],
    mapStyle: 'rooms'
  },
  {
    id: 'dungeon',
    name: 'Dungeon',
    icon: '🏰',
    description: 'Stone corridors, traps, darkness',
    color: 'bg-zinc-700',
    environment: 'Cold stone walls, echoing halls, torch sconces, iron doors.',
    hazards: ['Pit trap', 'Collapsing ceiling', 'Poison darts'],
    mapStyle: 'rooms'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: '🌲',
    description: 'Dense woodland, overgrown paths',
    color: 'bg-green-900',
    environment: 'Tall trees, thick underbrush, dappled sunlight, fallen logs.',
    hazards: ['Entangling roots', 'Hidden snare', 'Swarm of insects'],
    mapStyle: 'forest'
  },
  {
    id: 'desert',
    name: 'Desert',
    icon: '🏜️',
    description: 'Scorching sands, ruins half-buried',
    color: 'bg-yellow-900',
    environment: 'Dunes, cacti, sun-bleached bones, mirage shimmer.',
    hazards: ['Quicksand', 'Extreme heat', 'Sandstorm'],
    mapStyle: 'open'
  },
  {
    id: 'sewers',
    name: 'Sewers',
    icon: '🐀',
    description: 'Fetid tunnels beneath the city',
    color: 'bg-lime-900',
    environment: 'Slimy brick, ankle-deep sludge, pipes dripping, rats.',
    hazards: ['Disease pool', 'Slick algae', 'Toxic fumes'],
    mapStyle: 'cave'
  },
  {
    id: 'mountain',
    name: 'Mountain',
    icon: '⛰️',
    description: 'Rocky peaks, thin air, cliffs',
    color: 'bg-slate-700',
    environment: 'Jagged rocks, wind howling, loose scree, eagle nests.',
    hazards: ['Avalanche', 'Rockfall', 'Precipice'],
    mapStyle: 'cave'
  },
  {
    id: 'swamp',
    name: 'Swamp',
    icon: '🐊',
    description: 'Murky bog, hanging moss',
    color: 'bg-emerald-900',
    environment: 'Black water, cypress knees, fog, buzzing flies.',
    hazards: ['Deep mud', 'Poisonous gas', 'Leeches'],
    mapStyle: 'forest'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    icon: '❄️',
    description: 'Frozen wasteland, blizzard',
    color: 'bg-sky-900',
    environment: 'Snowdrifts, ice sheets, howling wind, aurora.',
    hazards: ['Thin ice', 'Extreme cold', 'Whiteout'],
    mapStyle: 'open'
  },
  {
    id: 'city',
    name: 'City Streets',
    icon: '🏙️',
    description: 'Narrow alleys, market crowds',
    color: 'bg-neutral-700',
    environment: 'Cobblestone, market stalls, balconies, guard patrols.',
    hazards: ['Crowd - difficult terrain', 'Loose roof tiles', 'City watch'],
    mapStyle: 'urban'
  },
  {
    id: 'cave',
    name: 'Cave',
    icon: '🕳️',
    description: 'Natural cavern, stalactites',
    color: 'bg-stone-800',
    environment: 'Damp stone, dripping water, bat guano, echo.',
    hazards: ['Stalagmite field', 'Underground river', 'Bat swarm'],
    mapStyle: 'cave'
  },
  {
    id: 'ruins',
    name: 'Ruins',
    icon: '🏛️',
    description: 'Ancient collapsed temple',
    color: 'bg-orange-900',
    environment: 'Broken columns, vines, cracked altar, history.',
    hazards: ['Unstable floor', 'Ancient trap', 'Cursed object'],
    mapStyle: 'rooms'
  },
  {
    id: 'coast',
    name: 'Coast',
    icon: '🌊',
    description: 'Cliffs, beach, crashing waves',
    color: 'bg-blue-900',
    environment: 'Sand, tide pools, sea spray, gulls crying.',
    hazards: ['High tide', 'Slippery seaweed', 'Riptide'],
    mapStyle: 'open'
  },
  {
    id: 'underdark',
    name: 'Underdark',
    icon: '🕷️',
    description: 'Lightless abyss, fungal forest',
    color: 'bg-violet-950',
    environment: 'Bioluminescent fungi, chasms, spider webs, silence.',
    hazards: ['Faerzress madness', 'Web trap', 'Bottomless pit'],
    mapStyle: 'cave'
  }
];

export const getBiomeById = (id: string) => BIOMES.find(b => b.id === id) || BIOMES[1];
