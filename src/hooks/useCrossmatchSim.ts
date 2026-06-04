import { useCallback, useEffect, useRef, useState } from 'react';
import type { FullBloodType } from '../logic/BloodLogicCore';
import { CrossmatchEngine, type CrossmatchResult } from '../logic/CompatibilityCore';
import { SoundEngine } from '../logic/SoundEngine';

export type BenchPhase = 'TESTING' | 'ANALYSIS' | 'DECISION';

export function useCrossmatchSim() {
    const [phase, setPhase] = useState<BenchPhase>('TESTING');
    const [result, setResult] = useState<CrossmatchResult | null>(null);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const runId = useRef(0);

    const clearTimers = useCallback(() => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const reset = useCallback(() => {
        runId.current++;
        clearTimers();
        setPhase('TESTING');
        setResult(null);
    }, [clearTimers]);

    const begin = useCallback((patient: FullBloodType, donor: FullBloodType) => {
        setPhase('ANALYSIS');
        setResult(null);
        runId.current++;
        const currentRun = runId.current;

        clearTimers();
        SoundEngine.init();
        SoundEngine.playGlassClink();

        const dropTimer = setTimeout(() => {
            if (runId.current !== currentRun) return;
            const reactTimer = setTimeout(() => {
                if (runId.current !== currentRun) return;
                const res = CrossmatchEngine.analyze(patient, donor);
                setResult(res);
                setPhase('DECISION');
                if (!res.safe) { SoundEngine.init(); SoundEngine.playFlatline(); }
            }, 1500);
            timers.current.push(reactTimer);
        }, 600);
        timers.current.push(dropTimer);
    }, [clearTimers]);

    return { phase, result, begin, reset };
}
