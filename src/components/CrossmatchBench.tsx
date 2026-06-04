import { TestTube, Check, X, Droplet } from 'lucide-react';
import type { FullBloodType } from '../logic/BloodLogicCore';
import type { BenchPhase } from '../hooks/useCrossmatchSim';
import type { CrossmatchResult } from '../logic/CompatibilityCore';

interface BenchProps {
    patientType: FullBloodType; donorType: FullBloodType | null; phase: BenchPhase;
    result: CrossmatchResult | null; onDrop: () => void; onTransfuse: () => void; onDiscard: () => void;
}

export default function CrossmatchBench({ patientType, donorType, phase, result, onDrop, onTransfuse, onDiscard }: BenchProps) {
    return (
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative">
            <div className="flex items-center justify-center gap-12 mb-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full border-2 border-emerald-500/50 bg-yellow-200/10 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        <span className="text-emerald-400 font-mono font-bold">{patientType}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Recipient</span>
                </div>

                <div className="relative w-32 h-32 flex items-center justify-center">
                    {donorType ? (
                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-0.5 bg-white/10" />
                            <div className={`relative z-10 w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${result?.safe === false ? 'bg-red-900 border-red-500 animate-pulse' : result?.safe === true ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
                                {phase === 'ANALYSIS' && <Droplet className="text-red-500 animate-bounce" size={32} />}
                                {phase === 'DECISION' && result?.safe === false && <X size={40} className="text-red-500" />}
                                {phase === 'DECISION' && result?.safe === true && <Check size={40} className="text-emerald-400" />}
                            </div>
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center"><span className="text-xs text-center text-slate-500">SELECT<br />DONOR BAG</span></div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center border-2 transition-all ${donorType ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-transparent border-white/5 text-transparent'}`}>
                        <span className="font-mono font-bold text-xl">{donorType || '?'}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Donor</span>
                </div>
            </div>

            <div className="h-16 flex items-center justify-center w-full">
                {phase === 'TESTING' && donorType && (
                    <button onClick={onDrop} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold flex items-center gap-2 animate-fade-in shadow-lg hover:shadow-blue-500/25"><TestTube size={18} /> TEST COMPATIBILITY</button>
                )}
                {phase === 'DECISION' && result && (
                    <div className="flex gap-4 animate-fade-in">
                        <button onClick={onDiscard} className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-mono text-sm font-bold">DISCARD</button>
                        {result.safe && <button onClick={onTransfuse} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse">INITIATE TRANSFUSION</button>}
                    </div>
                )}
                {phase === 'DECISION' && !result?.safe && <div className="absolute bottom-[-3rem] text-red-500 font-mono text-sm font-bold bg-black/50 px-4 py-2 rounded">⚠ INCOMPATIBLE MATCH DETECTED</div>}
            </div>
        </div>
    );
}
