import { motion, AnimatePresence } from 'framer-motion';
import { Snowflake } from 'lucide-react';
import { ALL_BLOOD_TYPES, type FullBloodType } from '../logic/BloodLogicCore';
import type { Inventory } from '../hooks/useInventory';

interface FridgeProps { isOpen: boolean; inventory: Inventory; onSelect: (type: FullBloodType) => void; }

export default function BloodFridge({ isOpen, inventory, onSelect }: FridgeProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ y: '100%' }} animate={{ y: isOpen ? 0 : '100%' }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 230 }} className="fixed inset-x-0 bottom-0 z-40 max-w-full overflow-x-clip border-t border-cyan-300/25 bg-slate-950/94 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_60px_rgba(0,0,0,0.58)] backdrop-blur-xl sm:px-5 sm:pt-4 md:px-6">
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent" />
                    <div className="mx-auto flex max-w-5xl min-w-0 items-center gap-3 overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide">
                        <div className="sticky left-0 z-10 flex h-[5.75rem] w-[4.35rem] shrink-0 flex-col items-center justify-center rounded-xl border border-cyan-200/15 bg-slate-950/95 shadow-[10px_0_18px_rgba(2,6,23,0.65)] sm:h-24 sm:w-20">
                            <Snowflake className="mb-1 text-cyan-300 animate-pulse" size={20} />
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200/75">Blood</span>
                            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200/45">Storage</span>
                        </div>
                        {ALL_BLOOD_TYPES.map(type => {
                            const count = inventory[type];
                            const isAvailable = count > 0;
                            return (
                                <button key={type} onClick={() => onSelect(type)} disabled={!isAvailable} className={`group relative flex h-[5.75rem] w-[4.35rem] shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl border transition-all sm:h-24 sm:w-20 ${isAvailable ? 'border-red-300/25 bg-red-950/28 text-red-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-1 hover:border-red-200/55 hover:bg-red-900/40 active:translate-y-0' : 'cursor-not-allowed border-white/[0.06] bg-slate-900/55 text-slate-600 opacity-55 grayscale'}`}>
                                    {isAvailable && <div className="absolute inset-x-2 bottom-2 h-1/2 rounded-b-lg bg-red-500/20 shadow-[inset_0_12px_18px_rgba(248,113,113,0.12)] transition-colors group-hover:bg-red-400/25" />}
                                    <div className="absolute inset-x-2 top-2 h-px bg-white/18" />
                                    <span className={`relative z-10 font-mono text-lg font-black tracking-[0.06em] ${isAvailable ? 'text-red-50' : 'text-slate-600'}`}>{type}</span>
                                    <span className="absolute right-1.5 top-1.5 rounded-md border border-white/10 bg-black/55 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/75">x{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
