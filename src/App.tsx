import { useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PartyManager } from './components/PartyManager';
import { GeneratorScreen } from './components/GeneratorScreen';
import { EncounterDisplay } from './components/EncounterDisplay';
import { NPCPanel } from './components/NPCPanel';
import { useStore } from './store/useStore';

function App() {
  const { activeTab } = useStore();

  useEffect(() => {
    // PWA install prompt handling
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      console.log('PWA install available');
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20">
        {activeTab === 'party' && <PartyManager />}
        {activeTab === 'generate' && <GeneratorScreen />}
        {activeTab === 'encounter' && <EncounterDisplay />}
        {activeTab === 'npcs' && <NPCPanel />}
      </main>

      <BottomNav />

      {/* Desktop helper */}
      <div className="hidden lg:block fixed bottom-24 right-6 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-400 max-w-[220px]">
        <div className="font-bold text-zinc-200 mb-1">💡 DM Tips</div>
        <ul className="space-y-1 leading-snug">
          <li>• Party tuning affects XP budget live</li>
          <li>• Map copy works for Roll20</li>
          <li>• Tactics auto-generate for Medium+</li>
          <li>• Install as PWA for offline use</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
