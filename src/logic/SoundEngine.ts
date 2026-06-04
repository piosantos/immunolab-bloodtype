let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

interface WebKitAudioWindow extends Window {
    webkitAudioContext?: typeof AudioContext;
}

const getContext = () => {
    if (typeof window === 'undefined') return null;
    if (!audioCtx) {
        const AudioContextCtor = window.AudioContext || (window as WebKitAudioWindow).webkitAudioContext;
        if (!AudioContextCtor) return null;
        audioCtx = new AudioContextCtor();
        const compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
        compressor.ratio.setValueAtTime(12, audioCtx.currentTime);

        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.5; // 🔉 REVERTED: Original quieter volume

        masterGain.connect(compressor);
        compressor.connect(audioCtx.destination);
    }
    return { ctx: audioCtx, master: masterGain! };
};

export const SoundEngine = {
    init: () => {
        const core = getContext();
        if (core && core.ctx.state === 'suspended') core.ctx.resume();
    },

    playGlassClink: () => {
        const core = getContext();
        if (!core) return;
        const { ctx, master } = core;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.5);
    },

    playHeartbeat: (urgency: number) => {
        const core = getContext();
        if (!core) return;
        const { ctx, master } = core;
        const t = ctx.currentTime;

        // 🔉 REVERTED: Original 60Hz Base Frequency
        const baseFreq = 60 + (urgency * 30);
        const spacing = 0.15 - (urgency * 0.05);

        const playThump = (time: number, freq: number, vol: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.1);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(vol, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
            osc.connect(gain);
            gain.connect(master);
            osc.start(time);
            osc.stop(time + 0.2);
        };

        // 🔉 REVERTED: Original Thump Volumes (0.4 / 0.3)
        playThump(t, baseFreq, 0.4);
        playThump(t + spacing, baseFreq * 1.2, 0.3);
    },

    playFlatline: () => {
        const core = getContext();
        if (!core) return;
        const { ctx, master } = core;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 3);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 3.1);
    }
};
