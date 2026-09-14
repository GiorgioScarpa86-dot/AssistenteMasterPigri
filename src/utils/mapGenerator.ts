import { MapData, BiomeId } from '../types';
import { getBiomeById } from '../data/biomes';

type Tile = '#' | '.' | 'D' | 'X' | 'T' | '~' | '^' | '≈' | ' ';

function createEmptyGrid(w: number, h: number, fill: Tile = '#'): Tile[][] {
  return Array.from({ length: h }, () => Array.from({ length: w }, () => fill));
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(()=>Math.random()-0.5);
}

// ROOMS generator (dungeon/tavern/ruins)
function generateRoomsMap(w: number, h: number): Tile[][] {
  const grid = createEmptyGrid(w,h,'#');
  const rooms: {x:number,y:number,w:number,h:number}[] = [];
  const roomAttempts = 12;
  
  for (let i=0;i<roomAttempts;i++) {
    const rw = randomInt(4, Math.min(10, w-2));
    const rh = randomInt(4, Math.min(8, h-2));
    const rx = randomInt(1, w - rw -1);
    const ry = randomInt(1, h - rh -1);
    const newRoom = {x:rx,y:ry,w:rw,h:rh};
    // check overlap
    let overlap = false;
    for (const r of rooms) {
      if (rx < r.x+r.w+1 && rx+rw+1 > r.x && ry < r.y+r.h+1 && ry+rh+1 > r.y) {
        overlap = true; break;
      }
    }
    if (!overlap) {
      rooms.push(newRoom);
      for (let y=ry;y<ry+rh;y++) for (let x=rx;x<rx+rw;x++) grid[y][x]='.';
    }
  }

  // connect rooms with corridors
  for (let i=1;i<rooms.length;i++) {
    const a = rooms[i-1];
    const b = rooms[i];
    const ax = Math.floor(a.x + a.w/2);
    const ay = Math.floor(a.y + a.h/2);
    const bx = Math.floor(b.x + b.w/2);
    const by = Math.floor(b.y + b.h/2);
    // h then v
    if (Math.random()<0.5) {
      for (let x=Math.min(ax,bx); x<=Math.max(ax,bx); x++) if (grid[ay][x]==='#') grid[ay][x]='.';
      for (let y=Math.min(ay,by); y<=Math.max(ay,by); y++) if (grid[y][bx]==='#') grid[y][bx]='.';
    } else {
      for (let y=Math.min(ay,by); y<=Math.max(ay,by); y++) if (grid[y][ax]==='#') grid[y][ax]='.';
      for (let x=Math.min(ax,bx); x<=Math.max(ax,bx); x++) if (grid[by][x]==='#') grid[by][x]='.';
    }
  }

  // doors at corridor intersections
  let doorsPlaced = 0;
  for (let y=1;y<h-1;y++) for (let x=1;x<w-1;x++) {
    if (grid[y][x]==='.' ) {
      const neighborsWalls = [
        grid[y-1][x]==='#',
        grid[y+1][x]==='#',
        grid[y][x-1]==='#',
        grid[y][x+1]==='#'
      ].filter(Boolean).length;
      if (neighborsWalls>=2 && Math.random()<0.08 && doorsPlaced<6) {
        // check if corridor
        const isCorridor = (grid[y-1][x]==='.' && grid[y+1][x]==='.') || (grid[y][x-1]==='.' && grid[y][x+1]==='.');
        if (isCorridor) {
          grid[y][x]='D';
          doorsPlaced++;
        }
      }
    }
  }

  // hazards
  let hazards = 0;
  for (let y=1;y<h-1;y++) for (let x=1;x<w-1;x++) if (grid[y][x]==='.' && Math.random()<0.03 && hazards<5) {
    grid[y][x]='X';
    hazards++;
  }

  return grid;
}

function generateForestMap(w:number,h:number): Tile[][] {
  const grid = createEmptyGrid(w,h,'.');
  // add trees as walls #
  const treeCount = Math.floor(w*h*0.18);
  for (let i=0;i<treeCount;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    grid[y][x]='#';
    if (Math.random()<0.5) {
      // cluster
      const nx = Math.min(w-1, Math.max(0, x+randomInt(-1,1)));
      const ny = Math.min(h-1, Math.max(0, y+randomInt(-1,1)));
      grid[ny][nx]='#';
    }
  }
  // clear center 5x5 for start
  const cx=Math.floor(w/2), cy=Math.floor(h/2);
  for (let y=cy-2;y<=cy+2;y++) for (let x=cx-2;x<=cx+2;x++) if (y>=0&&y<h&&x>=0&&x<w) grid[y][x]='.';

  // doors = clearings entries? Use D as paths
  for (let i=0;i<4;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    if (grid[y][x]==='#') grid[y][x]='.';
    // add door as trail marker
    if (Math.random()<0.5) grid[y][x]='D';
  }

  // hazards = X = brambles / pit
  for (let i=0;i<5;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    if (grid[y][x]==='.') grid[y][x]='X';
  }

  // add water ~ in forest as small ponds
  for (let i=0;i<2;i++) {
    const px=randomInt(2,w-4), py=randomInt(2,h-4);
    for (let y=py-1;y<=py+1;y++) for (let x=px-1;x<=px+1;x++) if (Math.random()<0.6) grid[y][x]='~';
  }

  return grid;
}

function generateCaveMap(w:number,h:number): Tile[][] {
  // cellular automata
  let grid = createEmptyGrid(w,h,'#');
  // random fill
  for (let y=1;y<h-1;y++) for (let x=1;x<w-1;x++) grid[y][x] = Math.random()<0.45 ? '#' : '.';
  
  // iterate 4 times
  for (let iter=0; iter<4; iter++) {
    const newGrid = createEmptyGrid(w,h,'#');
    for (let y=1;y<h-1;y++) for (let x=1;x<w-1;x++) {
      let walls=0;
      for (let dy=-1; dy<=1; dy++) for (let dx=-1; dx<=1; dx++) if (!(dx===0&&dy===0)) if (grid[y+dy][x+dx]==='#') walls++;
      if (walls>=5) newGrid[y][x]='#';
      else newGrid[y][x]='.';
    }
    grid=newGrid;
  }

  // ensure border walls
  for (let x=0;x<w;x++) { grid[0][x]='#'; grid[h-1][x]='#'; }
  for (let y=0;y<h;y++) { grid[y][0]='#'; grid[y][w-1]='#'; }

  // doors
  let doors=0;
  for (let y=2;y<h-2;y++) for (let x=2;x<w-2;x++) if (grid[y][x]==='.' && doors<4) {
    const wallNeighbors = [
      grid[y-1][x]==='#', grid[y+1][x]==='#', grid[y][x-1]==='#', grid[y][x+1]==='#'
    ].filter(Boolean).length;
    if (wallNeighbors>=2 && Math.random()<0.02) { grid[y][x]='D'; doors++; }
  }

  // hazards
  let haz=0;
  for (let y=1;y<h-1;y++) for (let x=1;x<w-1;x++) if (grid[y][x]==='.' && Math.random()<0.025 && haz<6) { grid[y][x]='X'; haz++; }

  return grid;
}

function generateOpenMap(w:number,h:number, biome: BiomeId): Tile[][] {
  const grid = createEmptyGrid(w,h,'.');
  // add some obstacles
  const obstacleChar: Tile = biome==='desert' ? '^' : biome==='arctic' ? '^' : biome==='coast' ? '~' : '.';
  const count = Math.floor(w*h*0.08);
  for (let i=0;i<count;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    if (obstacleChar==='.') {
      if (Math.random()<0.5) grid[y][x]='#';
    } else {
      grid[y][x]=obstacleChar;
    }
  }

  // hazards
  for (let i=0;i<6;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    if (grid[y][x]==='.') grid[y][x]='X';
  }

  // doors as exits
  grid[0][Math.floor(w/2)]='D';
  grid[h-1][Math.floor(w/2)]='D';
  grid[Math.floor(h/2)][0]='D';
  grid[Math.floor(h/2)][w-1]='D';

  return grid;
}

function generateUrbanMap(w:number,h:number): Tile[][] {
  const grid = createEmptyGrid(w,h,'.');
  // buildings as #
  const buildings = 8;
  for (let i=0;i<buildings;i++) {
    const bw=randomInt(3,6), bh=randomInt(3,6);
    const bx=randomInt(1,w-bw-1), by=randomInt(1,h-bh-1);
    for (let y=by;y<by+bh;y++) for (let x=bx;x<bx+bw;x++) grid[y][x]='#';
    // door
    const side = Math.floor(Math.random()*4);
    if (side===0) grid[by][bx+Math.floor(bw/2)]='D';
    else if (side===1) grid[by+bh-1][bx+Math.floor(bw/2)]='D';
    else if (side===2) grid[by+Math.floor(bh/2)][bx]='D';
    else grid[by+Math.floor(bh/2)][bx+bw-1]='D';
  }

  // hazards = market stalls / carts = X
  for (let i=0;i<5;i++) {
    const x=randomInt(0,w-1), y=randomInt(0,h-1);
    if (grid[y][x]==='.') grid[y][x]='X';
  }

  return grid;
}

export function generateMap(biome: BiomeId, size: 20 | 30 = 20): MapData {
  const biomeInfo = getBiomeById(biome);
  const w = size, h = size;
  let grid: Tile[][];

  switch (biomeInfo.mapStyle) {
    case 'forest':
      grid = generateForestMap(w,h);
      break;
    case 'cave':
      grid = generateCaveMap(w,h);
      break;
    case 'open':
      grid = generateOpenMap(w,h,biome);
      break;
    case 'urban':
      grid = generateUrbanMap(w,h);
      break;
    case 'rooms':
    default:
      grid = generateRoomsMap(w,h);
      break;
  }

  // Convert Tile to string grid
  const stringGrid = grid.map(row => row.map(cell => cell as string));

  const features = [
    `${biomeInfo.hazards[0]}`,
    `${biomeInfo.environment.slice(0,60)}...`,
    `Map optimized for Roll20: ${w}x${h} (1 tile = 5ft)`,
  ];

  if (biome==='forest') features.push('T = tree clusters (#), D = trail entrance, X = snare/brambles');
  if (biome==='desert') features.push('^ = rock/cactus, X = quicksand');
  if (biome==='arctic') features.push('^ = ice formation, X = thin ice');

  const legend: Record<string,string> = {
    '#': 'Wall / Dense obstacle / Building',
    '.': 'Open ground / Floor',
    'D': 'Door / Entrance / Trail',
    'X': 'Hazard / Trap / Difficult',
    '~': 'Water / Sludge',
    '^': 'Rock / Ice / High obstacle',
    'T': 'Tree',
  };

  return {
    id: Math.random().toString(36).slice(2,9),
    biome,
    width: w,
    height: h,
    grid: stringGrid,
    legend,
    description: `${biomeInfo.name} - ${biomeInfo.description}. ${biomeInfo.environment}`,
    features
  };
}
