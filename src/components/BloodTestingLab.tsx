import { useEffect } from 'react';
import { useBloodSim, type ReagentType } from '../hooks/useBloodSim';
import { type FullBloodType, isFullBloodType, ALL_BLOOD_TYPES } from '../logic/BloodLogicCore';
import { SoundEngine } from '../logic/SoundEngine';
import { RotateCcw, FlaskConical, Beaker } from 'lucide-react';

interface LabProps { mode?: 'SANDBOX' | 'TRAUMA'; targetSample?: FullBloodType; onDiagnose?: (diagnosis: FullBloodType) => void; }

const REAGENT_STYLES: Record<ReagentType, { ring: string; text: string; border: string; iconColor: string }> = {
    'Anti-A': { ring: 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]', text: 'text-blue-400', border: 'border-blue-400/30', iconColor: 'text-blue-400' },
    'Anti-B': { ring: 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)]', text: 'text-yellow-400', border: 'border-yellow-400/30', iconColor: 'text-yellow-400' },
    'Anti-D': { ring: 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]', text: 'text-emerald-400', border: 'border-emerald-400/30', iconColor: 'text-emerald-400' },
};

export default function BloodTestingLab({ mode = 'SANDBOX', targetSample = 'A+', onDiagnose }: LabProps) {
    const { state, setSample, dropReagent, resetSim } = useBloodSim();

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
        <div className="flex flex-col items-center gap-8 p-8 relative max-w-4xl mx-auto w-full">
            <div className="relative w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-around gap-8 shadow-2xl items-center">
                <button onClick={() => resetSim({ preserveSample: mode === 'TRAUMA' })} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors" title={mode === 'TRAUMA' ? "Clear Slide" : "Reset Lab"}>
                    <RotateCcw size={20} />
                </button>
                {(['Anti-A', 'Anti-B', 'Anti-D'] as ReagentType[]).map(type => {
                    const styles = REAGENT_STYLES[type];
                    const isActive = state.activeReagent === type;
                    return (
                        <div key={type} className="flex flex-col items-center gap-4">
                            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative overflow-hidden ${isActive ? styles.ring : 'border-white/10 bg-black/20'}`}>
                                {state.results[type] === true && <div className="absolute inset-0 bg-red-900 opacity-90 animate-fade-in" style={{ backgroundImage: 'radial-gradient(circle, #450a0a 2px, transparent 2.5px)', backgroundSize: '8px 8px' }} />}
                                {state.results[type] === false && <div className="absolute inset-0 bg-red-600/80 blur-sm shadow-inner" />}
                                {state.results[type] === null && <span className="text-xs text-white/20 font-mono">EMPTY</span>}
                            </div>
                            <button onClick={() => handleDrop(type)} disabled={!!state.activeReagent || state.results[type] !== null || (!state.selectedSample && mode === 'SANDBOX')} className={`flex items-center gap-2 px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono disabled:opacity-30 transition-all text-white ${isActive ? `${styles.text} ${styles.border}` : ''}`}>
                                <FlaskConical size={14} className={styles.iconColor} /> ADD {type.replace('Anti-', '')}
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className="w-full max-w-lg">
                {mode === 'TRAUMA' ? (
                    <div className="grid grid-cols-4 gap-2">
                        {ALL_BLOOD_TYPES.map((type) => (
                            <button key={type} onClick={() => onDiagnose?.(type)} className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 font-bold font-mono transition-all active:scale-95">
                                {type}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Beaker size={14} /> Select Patient Sample</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {ALL_BLOOD_TYPES.map((type) => (
                                <button key={type} onClick={() => { resetSim(); setSample(type); }} className={`py-2 text-xs font-mono rounded border transition-all ${state.selectedSample === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                        {!state.selectedSample && <div className="mt-4 text-center text-xs text-amber-500/80 font-mono animate-pulse">⚠ Please load a sample to begin testing</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
