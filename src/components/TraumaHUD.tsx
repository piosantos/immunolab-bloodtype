import { Heart } from 'lucide-react';

interface HUDProps { gameState: { score: number; lives: number; timeLeft: number; wave: number; }; onAbort: () => void; }

export default function TraumaHUD({ gameState, onAbort }: HUDProps) {
    const timerColor = gameState.timeLeft > 10 ? 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]' : 'bg-red-500 animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.55)]';
    const patientStatus = gameState.lives >= 3 ? 'STABLE' : gameState.lives >= 1 ? 'CRITICAL' : 'FLATLINE';
    const isStable = patientStatus === 'STABLE';

    return (
        <div className="sticky top-0 z-50 w-full overflow-x-clip border-b border-cyan-100/10 bg-slate-950/92 px-3 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))] font-mono text-white shadow-[0_18px_42px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:px-5">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
                <div className="grid w-full grid-cols-2 items-stretch gap-2 sm:grid-cols-[1.2fr_1fr_1.4fr] sm:gap-3">
                    <div className="col-span-2 flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:col-span-1">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${isStable ? 'border-emerald-300/30 bg-emerald-400/10' : 'border-red-400/35 bg-red-500/10'}`}>
                                <Heart className={`h-5 w-5 ${isStable ? 'text-emerald-300 animate-pulse' : 'text-red-400 animate-ping'}`} />
                            </div>
                            <div className="min-w-0">
                                <span className="block text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">Status</span>
                                <span className={`block truncate text-lg font-black leading-none tracking-[0.08em] ${isStable ? 'text-emerald-300' : 'text-red-400'}`}>{patientStatus}</span>
                            </div>
                        </div>
                        <button onClick={onAbort} className="min-h-10 shrink-0 rounded-lg border border-red-400/30 bg-red-950/40 px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-red-200 transition-all hover:border-red-300/60 hover:bg-red-900/50 hover:text-white">Abort</button>
                    </div>

                    <div className="col-span-2 flex min-w-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:col-span-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">Score</span>
                        <span className="font-mono tabular-nums text-xl font-black leading-none tracking-[0.08em] text-slate-50 sm:text-2xl">{gameState.score.toLocaleString()}</span>
                    </div>

                    <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:col-span-1">
                        <div className="mb-2 flex items-end justify-between gap-4">
                            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">Time</span>
                            <span className={`tabular-nums text-lg font-black leading-none tracking-[0.16em] ${gameState.timeLeft > 10 ? 'text-emerald-200' : 'text-red-300'}`}>00:{gameState.timeLeft.toString().padStart(2, '0')}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full border border-white/5 bg-black/40">
                            <div style={{ width: `${(gameState.timeLeft / 60) * 100}%` }} className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`} />
                        </div>
                        <div className="mt-1 flex justify-between text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
                            <span>Wave {gameState.wave}</span>
                            <span>{gameState.lives} Lives</span>
                        </div>
                    </div>
                </div>
            </div>
            <p className="mt-2 text-center font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Educational simulation only. Simplified ABO/Rh model. Simulasi edukatif saja. Model ABO/Rh disederhanakan.
            </p>
        </div>
    );
}
