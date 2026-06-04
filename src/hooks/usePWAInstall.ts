import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setPromptEvent(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const installApp = async () => {
        if (!promptEvent) return;
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === 'accepted') setPromptEvent(null);
    };
    return { isInstallable: !!promptEvent, installApp };
}
