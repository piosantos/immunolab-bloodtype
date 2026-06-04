export const SCORING_RULES = { BASE_SCORE: 1000, TIME_DECAY: 50, STREAK_MULTIPLIER: 0.2 };

export class TraumaEngine {
    static calculateScore(timeElapsed: number, currentStreak: number): number {
        const timePenalty = timeElapsed * SCORING_RULES.TIME_DECAY;
        const rawScore = SCORING_RULES.BASE_SCORE - timePenalty;
        const multiplier = 1 + (currentStreak * SCORING_RULES.STREAK_MULTIPLIER);
        return Math.max(100, Math.floor(rawScore * multiplier));
    }
}
