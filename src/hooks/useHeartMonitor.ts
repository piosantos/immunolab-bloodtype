import { useEffect, useRef } from 'react';
import { SoundEngine } from '../logic/SoundEngine';

export function useHeartMonitor(isActive: boolean, timeLeft: number, lives: number) {
    const prevLives = useRef(lives);
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        if (prevLives.current > 0 && lives === 0) {
            SoundEngine.init();
            SoundEngine.playFlatline();
        }
        prevLives.current = lives;
    }, [lives]);

    useEffect(() => {
        if (!isActive || lives <= 0) return;
        SoundEngine.init();

        let timerId: ReturnType<typeof setTimeout> | null = null;
        const tick = () => {
            const currentLimit = timeLeftRef.current;
            const urgency = Math.max(0, (60 - currentLimit) / 60);
            const interval = 1000 - (urgency * 600);

            // ✅ FIX: Wake up audio context on every beat
            SoundEngine.init();
            SoundEngine.playHeartbeat(urgency);

            timerId = setTimeout(tick, interval);
        };

        tick();
        return () => { if (timerId) clearTimeout(timerId); };
    }, [isActive, lives]);
}
