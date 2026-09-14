import { useStore } from '../store/useStore';

export function BottomNav() {
  const { activeTab, setActiveTab, currentEncounter } = useStore();

  const tabs = [
    { id: 'party' as const, label: 'Party', icon: '👥' },
    { id: 'generate' as const, label: 'Generate', icon: '🎲' },
    { id: 'encounter' as const, label: 'Encounter', icon: '⚔️', badge: currentEncounter ? '•' : undefined },
    { id: 'npcs' as const, label: 'NPCs', icon: '🧙' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto flex">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-[11px] font-medium tracking-wide uppercase transition-colors relative ${
              activeTab === t.id ? 'text-amber-400 bg-zinc-900' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="text-[18px] leading-none">{t.icon}</span>
            <span>{t.label}</span>
            {t.badge && <span className="absolute top-2 right-6 w-2 h-2 bg-amber-500 rounded-full"></span>}
            {activeTab===t.id && <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500"></div>}
          </button>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-zinc-950"></div>
    </nav>
  );
}
