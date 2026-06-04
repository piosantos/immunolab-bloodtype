import { Heart } from 'lucide-react';

interface HUDProps { gameState: { score: number; lives: number; timeLeft: number; wave: number; }; }

export default function TraumaHUD({ gameState }: HUDProps) {
    const timerColor = gameState.timeLeft > 10 ? 'bg-emerald-500' : 'bg-red-600 animate-pulse';
    const patientStatus = gameState.lives >= 3 ? 'STABLE' : gameState.lives >= 1 ? 'CRITICAL' : 'FLATLINE';

    return (
        <div className="w-full bg-slate-900 border-b border-white/10 p-4 font-mono text-white flex justify-between items-center sticky top-0 z-50 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase">Status</span><span className={`text-xl font-bold ${patientStatus === 'STABLE' ? 'text-emerald-400' : 'text-red-500'}`}>{patientStatus}</span></div>
                <Heart className={`w-6 h-6 ${patientStatus === 'STABLE' ? 'text-emerald-500 animate-pulse' : 'text-red-500 animate-ping'}`} />
            </div>
            <div className="flex flex-col items-center"><span className="text-[10px] text-slate-500 uppercase">Score</span><span className="text-2xl font-black tracking-widest">{gameState.score.toLocaleString()}</span></div>
            <div className="w-32">
                <div className="flex justify-between text-xs mb-1"><span>TIME</span><span>00:{gameState.timeLeft.toString().padStart(2, '0')}</span></div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div style={{ width: `${(gameState.timeLeft / 60) * 100}%` }} className={`h-full transition-all duration-1000 ${timerColor}`} /></div>
            </div>
        </div>
    );
}
