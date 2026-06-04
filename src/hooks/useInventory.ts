import { useCallback, useEffect, useRef, useState } from 'react';
import { ALL_BLOOD_TYPES, type FullBloodType } from '../logic/BloodLogicCore';
import { CrossmatchEngine } from '../logic/CompatibilityCore';

export type Inventory = Record<FullBloodType, number>;
const INITIAL_INV: Inventory = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };

export function useInventory() {
    const [inventory, setInventory] = useState<Inventory>(INITIAL_INV);
    const invRef = useRef<Inventory>(INITIAL_INV);

    useEffect(() => { invRef.current = inventory; }, [inventory]);

    const generateLevelInventory = useCallback((patient: FullBloodType) => {
        const newInv = { ...INITIAL_INV };
        // Guaranteed Solvability: 2 Safe Bags
        const safeTypes = ALL_BLOOD_TYPES.filter(t => CrossmatchEngine.analyze(patient, t).safe);
        newInv[safeTypes[Math.floor(Math.random() * safeTypes.length)]]++;
        newInv[safeTypes[Math.floor(Math.random() * safeTypes.length)]]++;
        // Noise
        for (let i = 0; i < 4; i++) newInv[ALL_BLOOD_TYPES[Math.floor(Math.random() * 8)]]++;
        setInventory(newInv);
    }, []);

    const consumeBag = useCallback((type: FullBloodType): boolean => {
        if (invRef.current[type] <= 0) return false;
        invRef.current = { ...invRef.current, [type]: invRef.current[type] - 1 };
        setInventory(prev => {
            if (prev[type] <= 0) return prev;
            return { ...prev, [type]: prev[type] - 1 };
        });
        return true;
    }, []);

    return { inventory, generateLevelInventory, consumeBag };
}
