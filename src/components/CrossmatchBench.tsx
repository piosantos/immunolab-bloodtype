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
        <div className="relative flex w-full max-w-2xl flex-col items-center overflow-x-clip rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex w-full min-w-0 items-center justify-center gap-3 sm:mb-8 sm:gap-12">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-yellow-200/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] sm:h-20 sm:w-20">
                        <span className="text-emerald-400 font-mono font-bold">{patientType}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Recipient</span>
                </div>

                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-32 sm:w-32">
                    {donorType ? (
                        <div className="relative">
                            <div className="absolute left-1/2 top-1/2 h-0.5 w-32 -translate-x-1/2 -translate-y-1/2 bg-white/10 sm:w-48" />
                            <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-500 sm:h-24 sm:w-24 ${result?.safe === false ? 'bg-red-900 border-red-500 animate-pulse' : result?.safe === true ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
                                {phase === 'ANALYSIS' && <Droplet className="text-red-500 animate-bounce" size={32} />}
                                {phase === 'DECISION' && result?.safe === false && <X size={40} className="text-red-500" />}
                                {phase === 'DECISION' && result?.safe === true && <Check size={40} className="text-emerald-400" />}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-white/20 sm:h-24 sm:w-24"><span className="text-center text-[10px] font-bold text-slate-500 sm:text-xs">SELECT<br />DONOR BAG</span></div>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 transition-all sm:h-20 sm:w-20 ${donorType ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-transparent border-white/5 text-transparent'}`}>
                        <span className="font-mono text-lg font-bold sm:text-xl">{donorType || '?'}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Donor</span>
                </div>
            </div>

            <div className="flex min-h-16 w-full items-center justify-center">
                {phase === 'TESTING' && donorType && (
                    <button onClick={onDrop} className="flex min-h-12 items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg animate-fade-in hover:bg-blue-500 hover:shadow-blue-500/25 sm:px-8"><TestTube size={18} /> TEST COMPATIBILITY</button>
                )}
                {phase === 'DECISION' && result && (
                    <div className="flex w-full flex-col gap-3 animate-fade-in sm:w-auto sm:flex-row sm:gap-4">
                        <button onClick={onDiscard} className="min-h-12 rounded-lg border border-red-500/30 px-6 py-3 font-mono text-sm font-bold text-red-400 hover:bg-red-500/10">DISCARD</button>
                        {result.safe && <button onClick={onTransfuse} className="min-h-12 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse hover:bg-emerald-500 sm:px-8">INITIATE TRANSFUSION</button>}
                    </div>
                )}
                {phase === 'DECISION' && !result?.safe && <div className="absolute bottom-[-3rem] text-red-500 font-mono text-sm font-bold bg-black/50 px-4 py-2 rounded">⚠ INCOMPATIBLE MATCH DETECTED</div>}
            </div>
        </div>
    );
}
