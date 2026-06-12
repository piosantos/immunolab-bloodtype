import { getAntigensForType, type FullBloodType } from './BloodLogicCore';

export interface CrossmatchDetails {
    recipientAntibodies: string[];
    donorAntigens: string[];
    conflictAntigen: string | null;
    educationalSummary: string;
}

export type CrossmatchResult =
    | { safe: true; quality: 'EXACT' | 'COMPATIBLE'; reason: string; details: CrossmatchDetails }
    | { safe: false; quality: 'INCOMPATIBLE'; reason: string; details: CrossmatchDetails };

const PATIENT_ANTIBODIES: Record<FullBloodType, readonly string[]> = {
    'A+': ['B'], 'A-': ['B', 'Rh'],
    'B+': ['A'], 'B-': ['A', 'Rh'],
    'AB+': [], 'AB-': ['Rh'],
    'O+': ['A', 'B'], 'O-': ['A', 'B', 'Rh']
};

export class CrossmatchEngine {
    static analyze(patient: FullBloodType, donor: FullBloodType): CrossmatchResult {
        const recipientAntibodies = [...PATIENT_ANTIBODIES[patient]];
        const donorAntigens = [...getAntigensForType(donor)];
        const conflict = donorAntigens.find(ag => recipientAntibodies.includes(ag)) ?? null;
        const antibodySummary = recipientAntibodies.length > 0 ? recipientAntibodies.join(', ') : 'none';
        const antigenSummary = donorAntigens.length > 0 ? donorAntigens.join(', ') : 'none';
        const baseDetails = {
            recipientAntibodies,
            donorAntigens,
            conflictAntigen: conflict,
        };

        if (conflict !== null) {
            return {
                safe: false,
                quality: 'INCOMPATIBLE',
                reason: `Reaction: Anti-${conflict} attacked Donor ${conflict}`,
                details: {
                    ...baseDetails,
                    educationalSummary: `The recipient has antibodies against ${conflict}, so donor ${conflict} antigen would trigger an incompatible reaction.`,
                },
            };
        }
        return {
            safe: true,
            quality: patient === donor ? 'EXACT' : 'COMPATIBLE',
            reason: 'Compatible',
            details: {
                ...baseDetails,
                educationalSummary: `Compatible match: recipient antibodies (${antibodySummary}) do not target donor antigens (${antigenSummary}).`,
            },
        };
    }

    static getStewardshipScore(patient: FullBloodType, donor: FullBloodType): number {
        const result = this.analyze(patient, donor);
        if (!result.safe) return 0;
        if (patient === donor) return 1000;
        if (donor === 'O-' && patient !== 'O-') return 250;
        return 500;
    }
}
