import { useState, useCallback, useEffect, useRef } from 'react';
import { BloodEngine, type FullBloodType } from '../logic/BloodLogicCore';

export type SimPhase = 'IDLE' | 'DRAGGING' | 'DROPPING' | 'REACTING' | 'RESULT';
export type ReagentType = 'Anti-A' | 'Anti-B' | 'Anti-D';
type ReactionResult = Record<ReagentType, boolean | null>;
const EMPTY_RESULTS: ReactionResult = { 'Anti-A': null, 'Anti-B': null, 'Anti-D': null };

export function useBloodSim() {
    const [phase, setPhase] = useState<SimPhase>('IDLE');
    const [selectedSample, setSample] = useState<FullBloodType | null>(null);
    const [activeReagent, setActiveReagent] = useState<ReagentType | null>(null);
    const [results, setResults] = useState<ReactionResult>(EMPTY_RESULTS);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
    useEffect(() => clearTimers, [clearTimers]);

    const dropReagent = useCallback((reagent: ReagentType): boolean => {
        if (!selectedSample || phase === 'DROPPING' || phase === 'REACTING') return false;
        if (results[reagent] !== null) return false;
        clearTimers();
        setPhase('DROPPING');
        setActiveReagent(reagent);
        const dropTimer = setTimeout(() => {
            setPhase('REACTING');
            const reactTimer = setTimeout(() => {
                const clumps = BloodEngine.testReaction(selectedSample, reagent);
                setResults(prev => ({ ...prev, [reagent]: clumps }));
                setPhase('RESULT');
                setActiveReagent(null);
            }, 1500);
            timers.current.push(reactTimer);
        }, 600);
        timers.current.push(dropTimer);
        return true;
    }, [selectedSample, results, phase, clearTimers]);

    const resetSim = useCallback((opts: { preserveSample?: boolean } = {}) => {
        clearTimers();
        setPhase('IDLE');
        setActiveReagent(null);
        setResults(EMPTY_RESULTS);
        if (!opts.preserveSample) setSample(null);
    }, [clearTimers]);

    return { state: { phase, activeReagent, selectedSample, results }, setSample, dropReagent, resetSim };
}
