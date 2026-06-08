import { describe, expect, it } from 'vitest';
import { ALL_BLOOD_TYPES, type FullBloodType } from './BloodLogicCore';
import { CrossmatchEngine } from './CompatibilityCore';

describe('CrossmatchEngine.analyze', () => {
    it('treats O- as universally safe to donate', () => {
        for (const patientType of ALL_BLOOD_TYPES) {
            expect(CrossmatchEngine.analyze(patientType, 'O-').safe, `O- donor to ${patientType}`).toBe(true);
        }
    });

    it('treats AB+ as universally safe to receive', () => {
        for (const donorType of ALL_BLOOD_TYPES) {
            expect(CrossmatchEngine.analyze('AB+', donorType).safe, `${donorType} donor to AB+`).toBe(true);
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
        expect(CrossmatchEngine.analyze(patientType, donorType)).toMatchObject({
            safe: false,
            quality: 'INCOMPATIBLE',
            reason: expect.stringContaining(conflict.split(' ')[0]),
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
