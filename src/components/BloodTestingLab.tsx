import { useEffect } from 'react';
import { useBloodSim, type ReagentType } from '../hooks/useBloodSim';
import { type FullBloodType, isFullBloodType, ALL_BLOOD_TYPES } from '../logic/BloodLogicCore';
import { SoundEngine } from '../logic/SoundEngine';
import { RotateCcw, FlaskConical, Beaker } from 'lucide-react';

interface LabProps {
    mode?: 'SANDBOX' | 'TRAUMA';
    targetSample?: FullBloodType;
    onDiagnose?: (diagnosis: FullBloodType) => void;
    isDiagnosingLocked?: boolean;
}

const REAGENT_STYLES: Record<ReagentType, { ring: string; text: string; border: string; iconColor: string; glow: string; liquid: string }> = {
    'Anti-A': {
        ring: 'border-blue-300/90 shadow-[0_0_28px_rgba(96,165,250,0.38),inset_0_0_26px_rgba(96,165,250,0.16)]',
        text: 'text-blue-200',
        border: 'border-blue-300/60',
        iconColor: 'text-blue-300',
        glow: 'bg-blue-300',
        liquid: 'from-blue-400/20 via-red-700/65 to-red-950/90',
    },
    'Anti-B': {
        ring: 'border-amber-200/90 shadow-[0_0_28px_rgba(251,191,36,0.34),inset_0_0_26px_rgba(251,191,36,0.14)]',
        text: 'text-amber-100',
        border: 'border-amber-200/60',
        iconColor: 'text-amber-200',
        glow: 'bg-amber-200',
        liquid: 'from-amber-300/18 via-red-700/65 to-red-950/90',
    },
    'Anti-D': {
        ring: 'border-emerald-200/90 shadow-[0_0_28px_rgba(52,211,153,0.34),inset_0_0_26px_rgba(52,211,153,0.14)]',
        text: 'text-emerald-100',
        border: 'border-emerald-200/60',
        iconColor: 'text-emerald-200',
        glow: 'bg-emerald-200',
        liquid: 'from-emerald-300/18 via-red-700/65 to-red-950/90',
    },
};

export default function BloodTestingLab({ mode = 'SANDBOX', targetSample = 'A+', onDiagnose, isDiagnosingLocked = false }: LabProps) {
    const { state, setSample, dropReagent, resetSim } = useBloodSim();
    const isReactionLocked = state.phase === 'DROPPING' || state.phase === 'REACTING' || !!state.activeReagent;
    const isKeypadLocked = isDiagnosingLocked || isReactionLocked;

    useEffect(() => {
        if (mode === 'TRAUMA' && isFullBloodType(targetSample)) setSample(targetSample);
    }, [mode, targetSample, setSample]);

    const handleDrop = (type: ReagentType) => {
        if (dropReagent(type)) {
            SoundEngine.init();
            SoundEngine.playGlassClink();
        }
    };

    return (
        <div className="flex w-full max-w-5xl flex-col items-center gap-5 overflow-x-clip px-3 py-4 sm:gap-7 sm:px-6 sm:py-7 md:px-8">
            <div className="relative w-full overflow-hidden rounded-[1.75rem] border border-cyan-100/15 bg-[linear-gradient(145deg,rgba(15,23,42,0.74),rgba(2,6,23,0.92))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl sm:p-6 md:p-8">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent" />
                <button onClick={() => resetSim({ preserveSample: mode === 'TRAUMA' })} className="absolute right-3 top-3 z-10 grid min-h-11 min-w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 shadow-inner transition-colors hover:border-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/60 sm:right-4 sm:top-4" title={mode === 'TRAUMA' ? "Clear Slide" : "Reset Lab"}>
                    <RotateCcw size={20} />
                </button>
                <div className="mb-5 pr-12 sm:mb-6">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-cyan-200/70">Antisera Panel</p>
                    <div className="mt-2 h-px w-full bg-gradient-to-r from-cyan-200/20 via-white/10 to-transparent" />
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 md:gap-7">
                {(['Anti-A', 'Anti-B', 'Anti-D'] as ReagentType[]).map(type => {
                    const styles = REAGENT_STYLES[type];
                    const isActive = state.activeReagent === type;
                    const hasResult = state.results[type] !== null;
                    const isClumped = state.results[type] === true;
                    return (
                        <div key={type} className="flex min-w-0 flex-col items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:gap-4 sm:p-4">
                            <div className={`lab-well relative flex aspect-square w-full max-w-[8.75rem] items-center justify-center overflow-hidden rounded-full border-[3px] backdrop-blur-md transition-all duration-500 sm:max-w-[9.5rem] ${isActive ? styles.ring : hasResult ? 'border-white/25 shadow-[inset_0_0_28px_rgba(255,255,255,0.08)]' : 'border-white/18 shadow-[inset_0_0_24px_rgba(148,163,184,0.10)]'}`}>
                                <div className="absolute inset-[7px] rounded-full border border-white/20 shadow-[inset_0_8px_18px_rgba(255,255,255,0.10),inset_0_-18px_28px_rgba(0,0,0,0.46)]" />
                                <div className="absolute left-[21%] top-[13%] h-7 w-3 rounded-full bg-white/45 blur-[1px] rotate-45" />
                                <div className="absolute inset-[14px] rounded-full bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.24),rgba(255,255,255,0.05)_34%,rgba(15,23,42,0.2)_62%,rgba(2,6,23,0.72))]" />
                                {isActive && <span className={`absolute top-3 h-5 w-3 rounded-full ${styles.glow} animate-lab-drop shadow-[0_0_18px_currentColor]`} />}
                                {isClumped && <div className="animate-clump-reveal absolute inset-[13px] rounded-full bg-red-950/95 opacity-95" style={{ backgroundImage: 'radial-gradient(circle, rgba(248,113,113,0.95) 1.4px, transparent 2.2px), radial-gradient(circle, rgba(69,10,10,0.95) 2.8px, transparent 3.5px)', backgroundPosition: '0 0, 4px 5px', backgroundSize: '10px 10px, 13px 13px' }} />}
                                {state.results[type] === false && <div className={`animate-liquid-settle absolute inset-[13px] rounded-full bg-gradient-to-b ${styles.liquid} shadow-[inset_0_10px_20px_rgba(255,255,255,0.10),inset_0_-18px_24px_rgba(69,10,10,0.55)]`} />}
                                {state.results[type] === null && !isActive && <span className="relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/22">Dry</span>}
                                {isActive && <span className="relative z-10 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-white/65">{state.phase === 'DROPPING' ? 'Drop' : 'React'}</span>}
                            </div>
                            <button onClick={() => handleDrop(type)} disabled={isReactionLocked || state.results[type] !== null || (!state.selectedSample && mode === 'SANDBOX')} className={`flex min-h-12 w-full max-w-[11rem] items-center justify-center gap-2 rounded-xl border bg-white/[0.045] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all hover:-translate-y-0.5 hover:bg-white/[0.08] active:translate-y-0 disabled:pointer-events-none disabled:opacity-35 ${isActive ? `${styles.text} ${styles.border}` : 'border-white/10'}`}>
                                <FlaskConical size={15} className={styles.iconColor} /> Drop {type.replace('Anti-', '')}
                            </button>
                        </div>
                    );
                })}
                </div>
            </div>
            <div className="w-full max-w-xl">
                {mode === 'TRAUMA' ? (
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {ALL_BLOOD_TYPES.map((type) => (
                            <button key={type} onClick={() => onDiagnose?.(type)} disabled={isKeypadLocked} className="min-h-12 rounded-xl border border-cyan-100/10 bg-slate-900/80 px-2 py-3 font-mono text-base font-black text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all hover:border-cyan-200/35 hover:bg-slate-800 active:scale-95 disabled:pointer-events-none disabled:opacity-35 sm:min-h-14">
                                {type}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Beaker size={14} /> Select Patient Sample</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {ALL_BLOOD_TYPES.map((type) => (
                                <button key={type} onClick={() => { resetSim(); setSample(type); }} disabled={isReactionLocked} className={`min-h-11 rounded-lg border px-2 py-2 font-mono text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-40 ${state.selectedSample === type ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.22)]' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                        {!state.selectedSample && <div className="mt-4 text-center text-xs text-amber-500/80 font-mono animate-pulse">Load a sample to begin testing</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
