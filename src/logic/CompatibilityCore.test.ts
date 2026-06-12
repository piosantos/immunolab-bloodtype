import { describe, expect, it } from 'vitest';
import { ALL_BLOOD_TYPES, type FullBloodType } from './BloodLogicCore';
import { CrossmatchEngine } from './CompatibilityCore';

describe('CrossmatchEngine.analyze', () => {
    it('treats O- as universally safe to donate', () => {
        for (const patientType of ALL_BLOOD_TYPES) {
            const result = CrossmatchEngine.analyze(patientType, 'O-');
            expect(result.safe, `O- donor to ${patientType}`).toBe(true);
            expect(result.details.donorAntigens, `O- donor to ${patientType}`).toEqual([]);
            expect(result.details.conflictAntigen, `O- donor to ${patientType}`).toBeNull();
        }
    });

    it('treats AB+ as universally safe to receive', () => {
        for (const donorType of ALL_BLOOD_TYPES) {
            const result = CrossmatchEngine.analyze('AB+', donorType);
            expect(result.safe, `${donorType} donor to AB+`).toBe(true);
            expect(result.details.recipientAntibodies, `${donorType} donor to AB+`).toEqual([]);
            expect(result.details.conflictAntigen, `${donorType} donor to AB+`).toBeNull();
        }
    });

    it.each([
        ['O-', 'A+', 'A antigen'],
        ['O-', 'B-', 'B antigen'],
        ['O-', 'O+', 'Rh antigen'],
        ['A-', 'A+', 'Rh antigen'],
        ['B+', 'A-', 'A antigen'],
        ['AB-', 'AB+', 'Rh antigen'],
    ] as const)('rejects incompatible %s patient receiving %s donor because of %s', (patientType, donorType, conflict) => {
        const result = CrossmatchEngine.analyze(patientType, donorType);

        expect(result).toMatchObject({
            safe: false,
            quality: 'INCOMPATIBLE',
            reason: expect.stringContaining(conflict.split(' ')[0]),
            details: {
                conflictAntigen: conflict.split(' ')[0],
                educationalSummary: expect.stringContaining('incompatible reaction'),
            },
        });
    });

    it('returns debrief details for a compatible non-exact match', () => {
        expect(CrossmatchEngine.analyze('A+', 'O+')).toMatchObject({
            safe: true,
            quality: 'COMPATIBLE',
            details: {
                recipientAntibodies: ['B'],
                donorAntigens: ['Rh'],
                conflictAntigen: null,
                educationalSummary: expect.stringContaining('do not target'),
            },
        });
    });
});

describe('CrossmatchEngine.getStewardshipScore', () => {
    it('heavily penalizes wasting O- blood on non O- patients', () => {
        const nonONegativePatients = ALL_BLOOD_TYPES.filter((type): type is Exclude<FullBloodType, 'O-'> => type !== 'O-');

        for (const patientType of nonONegativePatients) {
            expect(CrossmatchEngine.analyze(patientType, 'O-').safe, `O- donor to ${patientType}`).toBe(true);
            expect(CrossmatchEngine.getStewardshipScore(patientType, 'O-'), `O- donor to ${patientType}`).toBe(250);
        }

        expect(CrossmatchEngine.getStewardshipScore('O-', 'O-')).toBe(1000);
        expect(CrossmatchEngine.getStewardshipScore('A+', 'O+')).toBe(500);
        expect(CrossmatchEngine.getStewardshipScore('A+', 'O-')).toBeLessThan(
            CrossmatchEngine.getStewardshipScore('A+', 'O+'),
        );
    });
});
