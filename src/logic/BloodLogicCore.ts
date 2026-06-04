export const ALL_BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type FullBloodType = typeof ALL_BLOOD_TYPES[number];

export const BLOOD_PROFILES: Record<FullBloodType, readonly string[]> = {
    'A+': ['A', 'Rh'], 'A-': ['A'],
    'B+': ['B', 'Rh'], 'B-': ['B'],
    'AB+': ['A', 'B', 'Rh'], 'AB-': ['A', 'B'],
    'O+': ['Rh'], 'O-': [],
};

export function getAntigensForType(t: FullBloodType): readonly string[] {
    return BLOOD_PROFILES[t];
}

export function isFullBloodType(x: unknown): x is FullBloodType {
    return typeof x === 'string' && (ALL_BLOOD_TYPES as readonly string[]).includes(x);
}

export class BloodEngine {
    static testReaction(sample: FullBloodType, reagent: 'Anti-A' | 'Anti-B' | 'Anti-D'): boolean {
        const antigens = BLOOD_PROFILES[sample];
        const targetAntigen = reagent.replace('Anti-', '').replace('D', 'Rh');
        return antigens.includes(targetAntigen);
    }
}
