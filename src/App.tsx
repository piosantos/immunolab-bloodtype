import { useState } from 'react';
import GameWrapper from './components/GameWrapper';
import BloodTestingLab from './components/BloodTestingLab';
import { Beaker, Siren, Download, Share } from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { SoundEngine } from './logic/SoundEngine';

type ViewState = 'MENU' | 'SANDBOX' | 'TRAUMA';

function App() {
    const [view, setView] = useState<ViewState>('MENU');
    const { isInstallable, installApp } = usePWAInstall();

    const startGame = (mode: ViewState) => {
        SoundEngine.init();
        setView(mode);
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return (
        <div className="w-full min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
            {view === 'MENU' && (
                <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-0" />
                    <div className="z-10 text-center space-y-8 max-w-2xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-600">ImmunoLab<span className="text-white">Pro</span></h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <button onClick={() => startGame('SANDBOX')} className="group relative p-8 bg-slate-900/50 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-900/20">
                                <div className="flex items-center gap-4 mb-4"><div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors"><Beaker size={24} /></div><h2 className="text-xl font-bold">Sandbox Mode</h2></div>
                                <p className="text-sm text-slate-500">Open lab environment. Manually select patient samples.</p>
                            </button>
                            <button onClick={() => startGame('TRAUMA')} className="group relative p-8 bg-slate-900/50 hover:bg-slate-800 border border-white/10 hover:border-red-500/50 rounded-2xl transition-all duration-300 text-left hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-900/20">
                                <div className="flex items-center gap-4 mb-4"><div className="p-3 rounded-lg bg-red-950 text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors"><Siren size={24} /></div><h2 className="text-xl font-bold">Trauma Mode</h2></div>
                                <p className="text-sm text-slate-500">High-intensity exam. Save patients against the clock.</p>
                            </button>
                        </div>
                        {isInstallable && (
                            <button onClick={installApp} className="absolute bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold shadow-lg transition-all animate-bounce-slow">
                                <Download size={20} /> Install App
                            </button>
                        )}
                        {isIOS && !isInstallable && (
                            <div className="absolute bottom-8 text-xs text-slate-500 flex items-center gap-2 animate-pulse">
                                <Share size={14} /> <span>To Install: Share → Add to Home Screen</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {view === 'SANDBOX' && (
                <div className="flex flex-col min-h-screen">
                    <div className="pt-[max(1rem,env(safe-area-inset-top))] px-4 pb-3 border-b border-white/5 bg-slate-950/80 backdrop-blur">
                        <button onClick={() => setView('MENU')} className="px-4 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">← MENU</button>
                    </div>
                    <div className="flex flex-1 items-center justify-center"><BloodTestingLab mode="SANDBOX" /></div>
                </div>
            )}
            {view === 'TRAUMA' && (
                <div className="relative">
                    <GameWrapper onAbort={() => setView('MENU')} />
                </div>
            )}
        </div>
    );
}
export default App;
