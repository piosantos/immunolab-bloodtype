import { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ALL_BLOOD_TYPES, type FullBloodType } from '../logic/BloodLogicCore';
import { CrossmatchEngine, type CrossmatchResult } from '../logic/CompatibilityCore';
import { useTraumaMode } from '../hooks/useTraumaMode';
import { useInventory } from '../hooks/useInventory';
import { useCrossmatchSim } from '../hooks/useCrossmatchSim';
import { useHeartMonitor } from '../hooks/useHeartMonitor'; // ✅ Checked
import { SoundEngine } from '../logic/SoundEngine';
import TraumaHUD from './TraumaHUD';
import BloodTestingLab from './BloodTestingLab';
import BloodFridge from './BloodFridge';
import CrossmatchBench from './CrossmatchBench';

const makePatient = (id: number) => ({ id, type: ALL_BLOOD_TYPES[Math.floor(Math.random() * 8)] });

interface GameWrapperProps { onAbort: () => void; }
interface DebriefState { title: string; outcome: string; result: CrossmatchResult; }

const formatDetailList = (items: string[]) => items.length > 0 ? items.join(', ') : 'None';

export default function GameWrapper({ onAbort }: GameWrapperProps) {
    const { gameState, submitDiagnosis } = useTraumaMode();
    const { inventory, generateLevelInventory, consumeBag } = useInventory();
    const crossmatch = useCrossmatchSim();

    const [stage, setStage] = useState<'DIAGNOSIS' | 'CROSSMATCH' | 'DEBRIEF'>('DIAGNOSIS');
    const [patient, setPatient] = useState(() => makePatient(1001));
    const [selectedDonor, setSelectedDonor] = useState<FullBloodType | null>(null);
    const [diagnosisLocked, setDiagnosisLocked] = useState(false);
    const [debrief, setDebrief] = useState<DebriefState | null>(null);

    const transfuseLock = useRef(false);

    // ✅ Checked: Audio System Hook Call
    useHeartMonitor(gameState.isActive, gameState.timeLeft, gameState.lives);

    const handleDiagnosis = useCallback((diagnosis: FullBloodType) => {
        if (gameState.lives <= 0 || diagnosisLocked || stage !== 'DIAGNOSIS') return;
        setDiagnosisLocked(true);
        if (diagnosis === patient.type) {
            SoundEngine.init();
            generateLevelInventory(patient.type);
            setStage('CROSSMATCH');
            setSelectedDonor(null);
            setDebrief(null);
            crossmatch.reset();
        } else {
            SoundEngine.init();
            SoundEngine.playFlatline();
            submitDiagnosis(false);
            setDebrief({
                title: 'Diagnosis Review',
                outcome: `Submitted ${diagnosis}; expected ${patient.type}.`,
                result: CrossmatchEngine.analyze(patient.type, diagnosis),
            });
            setStage('DEBRIEF');
        }
    }, [patient, generateLevelInventory, submitDiagnosis, gameState.lives, crossmatch, diagnosisLocked, stage]);

    const handleSelectBag = useCallback((type: FullBloodType) => {
        if (crossmatch.phase === 'ANALYSIS' || inventory[type] <= 0) return;
        SoundEngine.init();
        setSelectedDonor(type);
        crossmatch.reset();
    }, [crossmatch, inventory]);

    const handleDrop = useCallback(() => {
        if (!selectedDonor || crossmatch.phase !== 'TESTING') return;
        crossmatch.begin(patient.type, selectedDonor);
    }, [crossmatch, patient.type, selectedDonor]);

    const stewardshipPoints = useMemo(() => selectedDonor ? CrossmatchEngine.getStewardshipScore(patient.type, selectedDonor) : 0, [patient.type, selectedDonor]);

    const handleTransfusion = useCallback(() => {
        const result = crossmatch.result;
        if (transfuseLock.current || !result?.safe || !selectedDonor) return;

        const ok = consumeBag(selectedDonor);
        if (!ok) { crossmatch.reset(); return; }

        transfuseLock.current = true;
        SoundEngine.init();
        SoundEngine.playGlassClink();

        submitDiagnosis(true, stewardshipPoints);
        setDebrief({
            title: 'Crossmatch Analysis',
            outcome: `Recipient ${patient.type} / Donor ${selectedDonor}`,
            result,
        });
        setStage('DEBRIEF');
    }, [consumeBag, crossmatch, patient.type, selectedDonor, stewardshipPoints, submitDiagnosis]);

    const handleNextCase = useCallback(() => {
        setStage('DIAGNOSIS');
        setPatient(prev => makePatient(prev.id + 1));
        setSelectedDonor(null);
        setDebrief(null);
        crossmatch.reset();
        transfuseLock.current = false;
        setDiagnosisLocked(false);
    }, [crossmatch]);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-slate-950 text-white">
            <TraumaHUD gameState={gameState} onAbort={onAbort} />
            <div className="relative min-h-0 flex-1 overflow-x-clip">
                {stage === 'DEBRIEF' && debrief ? (
                    <motion.div key="debrief" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 flex flex-col items-center justify-center overflow-x-clip overflow-y-auto px-4 py-8">
                        <div className="w-full max-w-2xl rounded-3xl border border-cyan-100/15 bg-[linear-gradient(145deg,rgba(15,23,42,0.82),rgba(2,6,23,0.95))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-2xl sm:p-7">
                            <div className="mb-5 border-b border-white/10 pb-4">
                                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-200/70">Debrief Engine</p>
                                <h2 className={`mt-2 font-mono text-2xl font-black tracking-[0.12em] ${debrief.result.safe ? 'text-emerald-300' : 'text-red-300'}`}>{debrief.title}</h2>
                                <p className="mt-2 text-sm text-slate-400">{debrief.outcome}</p>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                                    <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Recipient Antibodies</span>
                                    <span className="mt-2 block font-mono text-sm font-bold text-slate-100">{formatDetailList(debrief.result.details.recipientAntibodies)}</span>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                                    <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Donor Antigens</span>
                                    <span className="mt-2 block font-mono text-sm font-bold text-slate-100">{formatDetailList(debrief.result.details.donorAntigens)}</span>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                                    <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">Conflict Antigen</span>
                                    <span className={`mt-2 block font-mono text-sm font-bold ${debrief.result.details.conflictAntigen ? 'text-red-300' : 'text-emerald-300'}`}>{debrief.result.details.conflictAntigen ?? 'None'}</span>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-sm leading-relaxed text-slate-300">{debrief.result.details.educationalSummary}</p>
                            </div>

                            <button onClick={handleNextCase} className="mt-5 min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 font-mono text-sm font-black uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(16,185,129,0.28)] transition-all hover:bg-emerald-500">
                                NEXT CASE
                            </button>
                        </div>
                    </motion.div>
                ) : gameState.lives <= 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="text-center p-12 border border-red-500/50 rounded-xl bg-red-950/30 backdrop-blur">
                            <h1 className="text-6xl font-black text-white mb-4">SIMULATION FAILED</h1>
                            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded font-bold shadow-lg hover:scale-105 transition-all">RESTART SHIFT</button>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {stage === 'DIAGNOSIS' ? (
                            <motion.div key="diag" initial={{ x: -180, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -180, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 flex flex-col items-center justify-center overflow-x-clip overflow-y-auto px-3 pb-36 pt-6 sm:pb-32">
                                <div className="mb-3 text-center sm:mb-4"><h2 className="font-mono text-lg font-black tracking-[0.2em] text-emerald-300 sm:text-xl">PATIENT #{patient.id}</h2><p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Step 1: Identify Blood Type</p></div>
                                <BloodTestingLab key={patient.id} mode="TRAUMA" targetSample={patient.type} onDiagnose={handleDiagnosis} isDiagnosingLocked={diagnosisLocked} />
                            </motion.div>
                        ) : stage === 'CROSSMATCH' ? (
                            <motion.div key="xmatch" initial={{ x: 180, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 180, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 flex flex-col items-center justify-center overflow-x-clip overflow-y-auto px-3 pb-36 pt-6 sm:pb-32">
                                <div className="mb-4 text-center"><h2 className="flex items-center justify-center gap-2 font-mono text-lg font-black tracking-[0.2em] text-emerald-300 sm:text-xl">PATIENT #{patient.id} <CheckCircle size={16} /></h2><p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Step 2: Crossmatch & Transfuse</p></div>
                                <CrossmatchBench patientType={patient.type} donorType={selectedDonor} phase={crossmatch.phase} result={crossmatch.result} onDrop={handleDrop} onTransfuse={handleTransfusion} onDiscard={() => { setSelectedDonor(null); crossmatch.reset(); }} />
                                {crossmatch.phase === 'DECISION' && crossmatch.result?.safe && <div className="mt-4 text-xs font-mono text-slate-400">Stewardship Bonus: <span className="text-emerald-400 font-bold">+{stewardshipPoints}</span></div>}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                )}
            </div>
            <BloodFridge isOpen={stage === 'CROSSMATCH'} inventory={inventory} onSelect={handleSelectBag} />
        </div>
    );
}
