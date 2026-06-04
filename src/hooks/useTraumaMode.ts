import { useState, useEffect, useCallback, useRef } from 'react';
import { TraumaEngine } from '../logic/TraumaEngine';

interface GameState { isActive: boolean; score: number; streak: number; lives: number; timeLeft: number; wave: number; }
const MAX_TIME = 60;

const applyMistake = (prev: GameState): GameState => {
    const newLives = prev.lives - 1;
    return { ...prev, lives: newLives, streak: 0, isActive: newLives > 0, timeLeft: newLives > 0 ? MAX_TIME : 0 };
};

export function useTraumaMode() {
    const [gameState, setGameState] = useState<GameState>({ isActive: true, score: 0, streak: 0, lives: 3, timeLeft: MAX_TIME, wave: 1 });
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMistake = useCallback(() => {
        setGameState(applyMistake);
    }, []);

    useEffect(() => {
        if (!gameState.isActive || gameState.lives <= 0) return;

        timerRef.current = setTimeout(() => {
            setGameState(prev => {
                if (!prev.isActive || prev.lives <= 0) return prev;
                if (prev.timeLeft <= 1) return applyMistake(prev);
                return { ...prev, timeLeft: prev.timeLeft - 1 };
            });
        }, 1000);

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [gameState.isActive, gameState.timeLeft, gameState.lives]);

    const submitDiagnosis = useCallback((isCorrect: boolean, bonusPoints: number = 0) => {
        if (!gameState.isActive) return;
        if (isCorrect) {
            const points = TraumaEngine.calculateScore(MAX_TIME - gameState.timeLeft, gameState.streak);
            setGameState(prev => ({
                ...prev, score: prev.score + points + bonusPoints,
                streak: prev.streak + 1, timeLeft: MAX_TIME, wave: prev.wave + 1
            }));
        } else {
            handleMistake();
        }
    }, [gameState.isActive, gameState.timeLeft, gameState.streak, handleMistake]);

    return { gameState, submitDiagnosis };
}
