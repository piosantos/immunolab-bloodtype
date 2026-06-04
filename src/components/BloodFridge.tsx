import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake } from 'lucide-react';
import { ALL_BLOOD_TYPES, type FullBloodType } from '../logic/BloodLogicCore';
import type { Inventory } from '../hooks/useInventory';

interface FridgeProps { isOpen: boolean; inventory: Inventory; onSelect: (type: FullBloodType) => void; }

export default function BloodFridge({ isOpen, inventory, onSelect }: FridgeProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ y: '100%' }} animate={{ y: isOpen ? 0 : '100%' }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-cyan-500/30 p-4 md:p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="max-w-4xl mx-auto flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-24 border-r border-white/10 mr-4">
                            <Snowflake className="text-cyan-400 mb-2 animate-pulse" />
                            <span className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-widest rotate-[-90deg]">STORAGE</span>
                        </div>
                        {ALL_BLOOD_TYPES.map(type => {
                            const count = inventory[type];
                            const isAvailable = count > 0;
                            return (
                                <button key={type} onClick={() => onSelect(type)} disabled={!isAvailable} className={`relative group flex-shrink-0 w-16 h-24 rounded-lg border flex flex-col items-center justify-center transition-all ${isAvailable ? 'bg-red-950/30 border-red-500/30 hover:bg-red-900/40 hover:border-red-400 hover:scale-105 hover:-translate-y-1' : 'bg-slate-900/50 border-white/5 opacity-50 grayscale cursor-not-allowed'}`}>
                                    {isAvailable && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-red-600/20 rounded-b-lg group-hover:bg-red-500/30 transition-colors" />}
                                    <span className={`text-lg font-black font-mono ${isAvailable ? 'text-red-100' : 'text-slate-600'}`}>{type}</span>
                                    <span className="absolute top-1 right-1 text-[10px] bg-black/50 px-1 rounded text-white/70 font-mono">x{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
