import { describe, expect, it } from 'vitest';
import { ALL_BLOOD_TYPES, BloodEngine, type FullBloodType } from './BloodLogicCore';

type ReagentType = 'Anti-A' | 'Anti-B' | 'Anti-D';

const REAGENTS: readonly ReagentType[] = ['Anti-A', 'Anti-B', 'Anti-D'];

const EXPECTED_REACTIONS: Record<FullBloodType, Record<ReagentType, boolean>> = {
    'A+': { 'Anti-A': true, 'Anti-B': false, 'Anti-D': true },
    'A-': { 'Anti-A': true, 'Anti-B': false, 'Anti-D': false },
    'B+': { 'Anti-A': false, 'Anti-B': true, 'Anti-D': true },
    'B-': { 'Anti-A': false, 'Anti-B': true, 'Anti-D': false },
    'AB+': { 'Anti-A': true, 'Anti-B': true, 'Anti-D': true },
    'AB-': { 'Anti-A': true, 'Anti-B': true, 'Anti-D': false },
    'O+': { 'Anti-A': false, 'Anti-B': false, 'Anti-D': true },
    'O-': { 'Anti-A': false, 'Anti-B': false, 'Anti-D': false },
};

describe('BloodEngine.testReaction', () => {
    it.each(ALL_BLOOD_TYPES)('matches the complete reagent truth table for %s', (bloodType) => {
        for (const reagent of REAGENTS) {
            expect(BloodEngine.testReaction(bloodType, reagent), `${bloodType} with ${reagent}`).toBe(
                EXPECTED_REACTIONS[bloodType][reagent],
            );
        }
    });
});
