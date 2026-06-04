import { getAntigensForType, type FullBloodType } from './BloodLogicCore';

export type CrossmatchResult =
    | { safe: true; quality: 'EXACT' | 'COMPATIBLE'; reason: string }
    | { safe: false; quality: 'INCOMPATIBLE'; reason: string };

const PATIENT_ANTIBODIES: Record<FullBloodType, readonly string[]> = {
    'A+': ['B'], 'A-': ['B', 'Rh'],
    'B+': ['A'], 'B-': ['A', 'Rh'],
    'AB+': [], 'AB-': ['Rh'],
    'O+': ['A', 'B'], 'O-': ['A', 'B', 'Rh']
};

export class CrossmatchEngine {
    static analyze(patient: FullBloodType, donor: FullBloodType): CrossmatchResult {
        const antibodies = PATIENT_ANTIBODIES[patient];
        const donorAntigens = getAntigensForType(donor);
        const conflict = donorAntigens.find(ag => antibodies.includes(ag));

        if (conflict) {
            return { safe: false, quality: 'INCOMPATIBLE', reason: `Reaction: Anti-${conflict} attacked Donor ${conflict}` };
        }
        return { safe: true, quality: patient === donor ? 'EXACT' : 'COMPATIBLE', reason: 'Compatible' };
    }

    static getStewardshipScore(patient: FullBloodType, donor: FullBloodType): number {
        const result = this.analyze(patient, donor);
        if (!result.safe) return 0;
        if (patient === donor) return 1000;
        if (donor === 'O-' && patient !== 'O-') return 250;
        return 500;
    }
}
