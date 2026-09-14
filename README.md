# 🐉 Master Pigri - D&D 5e DM Assistant

**Real-time session assistant for Dungeon Masters** - Mobile-first, PWA-ready, offline-capable, Firebase-synced.

Built with React + Vite + TypeScript + Tailwind + Firebase + Zustand

---

## 🚀 ZERO-CODE SETUP FOR BEGINNERS (5 minutes)

### Step 1: Install Node.js
1. Go to https://nodejs.org
2. Download LTS version (green button)
3. Install it (click Next, Next...)

### Step 2: Open Terminal
- **Windows**: Press `Win + R`, type `cmd`, Enter
- **Mac**: Spotlight → `Terminal`
- **Android (Termux)**: Install Termux app

### Step 3: Clone & Run (copy-paste these)

```bash
# 1. Download the project (if from GitHub)
git clone https://github.com/YOUR_USERNAME/AssistenteMasterPigri.git
cd AssistenteMasterPigri

# 2. Install dependencies (takes 1-2 minutes)
npm install

# 3. Run dev server
npm run dev
```

You will see:
```
  VITE v5.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
```

Open that URL in Chrome/Firefox. **Done!** App works 100% offline.

### Step 4 (Optional): Enable Cloud Save with Firebase (Free)

1. Go to https://console.firebase.google.com/ → Create Project (free Spark plan)
2. Project Settings → General → Your apps → Web → Copy config
3. In this project, copy `.env.example` to `.env.local` (git-ignored) and paste
   the six values there:
```bash
cp .env.example .env.local   # then edit .env.local with your values
```
```env
VITE_FIREBASE_API_KEY=AIza...          # ← paste yours here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```
   (Prefer a single file? You can also paste the values in `INLINE_FALLBACK`
   inside `src/firebase.ts` — but then they travel with the repo.)
4. Restart `npm run dev` (or rebuild) so Vite picks up the variables.
5. In Firebase Console:
   - Authentication → Sign-in method → Enable Anonymous
   - Firestore Database → Create Database → Start in test mode

That's it. App auto-detects Firebase and syncs parties. If you skip this, it uses localStorage - no crash.

---

## 📁 COMPLETE FILE TREE

```
AssistenteMasterPigri/
├── index.html                  # Entry HTML, PWA meta, fonts
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite + PWA plugin config
├── tailwind.config.js          # Dark theme, amber accent
├── postcss.config.js
├── tsconfig.json
├── public/
│   └── vite.svg                # Favicon placeholder
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # Tab router, layout
    ├── index.css               # Tailwind + custom
    ├── firebase.ts             # Firebase init + offline fallback
    ├── types/
    │   └── index.ts            # All TypeScript interfaces
    ├── store/
    │   └── useStore.ts         # Zustand global state + CRUD
    ├── data/
    │   ├── biomes.ts           # 13 biomes with colors & hazards
    │   ├── monsters.ts         # 45+ monsters with biomes, CR, tactics
    │   ├── npcs.ts             # Procedural NPC generator
    │   ├── loot.ts             # DMG loot tables (individual/hoard)
    │   └── twists.ts           # 15 Deus Ex Machina twists
    ├── utils/
    │   ├── encounterCalculator.ts # RAW DMG XP budget, multiplier
    │   ├── mapGenerator.ts     # Procedural ASCII maps (rooms/cave/forest/open/urban)
    │   └── tacticsGenerator.ts # Pack Tactics + environmental combos
    └── components/
        ├── Header.tsx
        ├── BottomNav.tsx       # Mobile bottom nav
        ├── PartyManager.tsx    # CRUD parties, Firebase/localStorage
        ├── GeneratorScreen.tsx # Biome, difficulty, party tuning
        ├── MapView.tsx         # ASCII grid renderer + copy
        ├── EncounterDisplay.tsx# Monsters, XP, tactics, loot, twist
        └── NPCPanel.tsx        # Punchy NPC cards
```

---

## 🧠 CORE FEATURES EXPLAINED

### 1. Party Management
- Create unlimited parties: name, player count (1-8), avg level (1-20)
- Saved to Firestore if configured, else localStorage
- Select active party → auto-fills generator
- On generator screen, you can + / - players and levels live before rolling

### 2. Semantic Cohesion Engine
- Each monster has `biomes[]` tags
- Tavern → Thug, Spy, Commoner, Bandit
- Forest → Wolf, Bear, Giant Spider, Druid
- Desert → Scorpion, Mummy, Jackalwere
- **Rule enforced**: `getMonstersByBiome()` filters, never mixes
- Map style changes per biome: dungeon=rooms, forest=trees, cave=cellular automata, etc.

### 3. RAW Encounter Calculator (DMG p82)
```ts
Thresholds per level: Easy/Medium/Hard/Deadly
Budget = perPlayer × playerCount
TotalXP = sum(monster.xp × count)
AdjustedXP = TotalXP × multiplier
  1 monster 1×, 2 1.5×, 3-6 2×, 7-10 2.5×, 11-14 3×, 15+ 4×
```
- Generator tries 100 attempts to hit budget within 20%
- Shows Budget vs Total vs Adjusted
- Loot CR = max CR in encounter

### 4. Map Generator
- **Rooms**: Random non-overlapping rooms + corridors (dungeon/tavern/ruins)
- **Forest**: 18% trees (#), clear center, water ponds (~), brambles X
- **Cave**: Cellular automata (4 iterations) → organic caverns
- **Open**: Desert/arctic/coast with few obstacles
- **Urban**: City blocks with doors
- All maps include # . D X mandatory + legend + Roll20 tips
- 20×20 or 30×30, copy as ASCII

### 5. Tactics & Pack Tactics
- If monster has `isPackTactics` → official Pack Tactics description
- If multiple types → combo generated: "If Shaman casts Entangle, Spiders target restrained"
- Environment tactics: e.g., Forest → climb trees for cover, use foliage to Hide
- Hard/Deadly adds: Focus fire, caster disruption, lair action, morale
- Displayed in dedicated collapsible section for Medium+

### 6. Loot & Twist
- **Individual**: Coins only, quick
- **Hoard**: Tier 0 (CR0-4), 1 (5-10), 2 (11-16), 3 (17+) with gems/art/magic items
- **Twist toggle**: Random from 15 narrative hazards (reinforcements, collapse, betrayal, etc.)

### 7. NPCs
- Name pools per race, visual trait, secret, motive, quirk
- Stat snippet: AC, HP, Speed, Attack (no full sheet)
- Biome-aware (but can be any)

---

## 📱 MOBILE-FIRST UI

- Dark: `bg-zinc-950` / `bg-zinc-900` / `bg-zinc-800`, text `zinc-100`
- Accent: `amber-500` for primary actions
- Fixed bottom nav, touch targets 40px+
- Collapsible accordions for stat blocks
- Monospace for maps & XP, sans for reading
- Safe area inset for iPhone/Android gesture bars
- PWA: installable, offline, standalone

---

## 🛠️ SCRIPTS

```bash
npm run dev      # Start dev server http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

---

## 🚢 DEPLOY (FREE)

### Vercel (easiest)
1. Push to GitHub
2. Go to vercel.com → New Project → Import GitHub repo
3. Deploy (auto detects Vite)

### Netlify
1. `npm run build`
2. Drag `dist/` folder to netlify.com/drop

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting (select dist)
firebase deploy
```

---

## ❓ FAQ FOR NON-CODERS

**Q: I didn't set up Firebase, will it crash?**
No. It detects missing config and uses localStorage. You see "Offline Mode" banner.

**Q: Where do I paste Firebase keys?**
Open `src/firebase.ts`, line 12-19. Replace YOUR_API_KEY_HERE etc.

**Q: How to change colors?**
Edit `tailwind.config.js` → `accent.DEFAULT` (currently amber).

**Q: Map not showing?**
You must click Generate on Generate tab first.

**Q: How to add new monsters?**
Edit `src/data/monsters.ts`, add entry with `makeMonster({...})`. Include biomes.

---

## 📜 LICENSE

MIT - Free for personal & commercial use. No attribution needed but appreciated.

Built for DMs who are tired (Pigri = Lazy in Italian) - automate the busywork, keep the storytelling.
