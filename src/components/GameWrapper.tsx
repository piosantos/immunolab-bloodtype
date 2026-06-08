import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { ALL_BLOOD_TYPES, type FullBloodType } from '../logic/BloodLogicCore';
import { CrossmatchEngine } from '../logic/CompatibilityCore';
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

export default function GameWrapper() {
    const { gameState, submitDiagnosis } = useTraumaMode();
    const { inventory, generateLevelInventory, consumeBag } = useInventory();
    const crossmatch = useCrossmatchSim();

    const [stage, setStage] = useState<'DIAGNOSIS' | 'CROSSMATCH'>('DIAGNOSIS');
    const [patient, setPatient] = useState(() => makePatient(1001));
    const [selectedDonor, setSelectedDonor] = useState<FullBloodType | null>(null);
    const [diagnosisLocked, setDiagnosisLocked] = useState(false);

    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const diagnosisUnlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const transfuseLock = useRef(false);

    // ✅ Checked: Audio System Hook Call
    useHeartMonitor(gameState.isActive, gameState.timeLeft, gameState.lives);

    useEffect(() => {
        return () => {
            if (advanceTimer.current) clearTimeout(advanceTimer.current);
            if (diagnosisUnlockTimer.current) clearTimeout(diagnosisUnlockTimer.current);
        };
    }, []);

    const handleDiagnosis = useCallback((diagnosis: FullBloodType) => {
        if (gameState.lives <= 0 || diagnosisLocked || stage !== 'DIAGNOSIS') return;
        setDiagnosisLocked(true);
        if (diagnosis === patient.type) {
            SoundEngine.init();
            generateLevelInventory(patient.type);
            setStage('CROSSMATCH');
            setSelectedDonor(null);
            crossmatch.reset();
        } else {
            SoundEngine.init();
            SoundEngine.playFlatline();
            submitDiagnosis(false);
            if (diagnosisUnlockTimer.current) clearTimeout(diagnosisUnlockTimer.current);
            diagnosisUnlockTimer.current = setTimeout(() => setDiagnosisLocked(false), 350);
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
        if (transfuseLock.current || !crossmatch.result?.safe || !selectedDonor) return;

        const ok = consumeBag(selectedDonor);
        if (!ok) { crossmatch.reset(); return; }

        transfuseLock.current = true;
        SoundEngine.init();
        SoundEngine.playGlassClink();

        submitDiagnosis(true, stewardshipPoints);

        if (advanceTimer.current) clearTimeout(advanceTimer.current);
        advanceTimer.current = setTimeout(() => {
            setStage('DIAGNOSIS');
            setPatient(prev => makePatient(prev.id + 1));
            setSelectedDonor(null);
            crossmatch.reset();
            transfuseLock.current = false;
            setDiagnosisLocked(false);
        }, 1000);
    }, [consumeBag, crossmatch, selectedDonor, stewardshipPoints, submitDiagnosis]);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-slate-950 text-white">
            <TraumaHUD gameState={gameState} />
            <div className="relative min-h-0 flex-1 overflow-x-clip">
                {gameState.lives <= 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className="text-center p-12 border border-red-500/50 rounded-xl bg-red-950/30 backdrop-blur">
                            <h1 className="text-6xl font-black text-white mb-4">FLATLINE</h1>
                            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded font-bold shadow-lg hover:scale-105 transition-all">RESTART SHIFT</button>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {stage === 'DIAGNOSIS' ? (
                            <motion.div key="diag" initial={{ x: -180, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -180, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 flex flex-col items-center justify-center overflow-x-clip overflow-y-auto px-2 py-6">
                                <div className="mb-3 text-center sm:mb-4"><h2 className="font-mono text-lg font-black tracking-[0.2em] text-emerald-300 sm:text-xl">PATIENT #{patient.id}</h2><p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Step 1: Identify Blood Type</p></div>
                                <BloodTestingLab key={patient.id} mode="TRAUMA" targetSample={patient.type} onDiagnose={handleDiagnosis} isDiagnosingLocked={diagnosisLocked} />
                            </motion.div>
                        ) : (
                            <motion.div key="xmatch" initial={{ x: 180, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 180, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 flex flex-col items-center justify-center overflow-x-clip overflow-y-auto px-3 pb-36 pt-6 sm:pb-32">
                                <div className="mb-4 text-center"><h2 className="flex items-center justify-center gap-2 font-mono text-lg font-black tracking-[0.2em] text-emerald-300 sm:text-xl">PATIENT #{patient.id} <CheckCircle size={16} /></h2><p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">Step 2: Crossmatch & Transfuse</p></div>
                                <CrossmatchBench patientType={patient.type} donorType={selectedDonor} phase={crossmatch.phase} result={crossmatch.result} onDrop={handleDrop} onTransfuse={handleTransfusion} onDiscard={() => { setSelectedDonor(null); crossmatch.reset(); }} />
                                {crossmatch.phase === 'DECISION' && crossmatch.result?.safe && <div className="mt-4 text-xs font-mono text-slate-400">Stewardship Bonus: <span className="text-emerald-400 font-bold">+{stewardshipPoints}</span></div>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
            <BloodFridge isOpen={stage === 'CROSSMATCH'} inventory={inventory} onSelect={handleSelectBag} />
        </div>
    );
}
