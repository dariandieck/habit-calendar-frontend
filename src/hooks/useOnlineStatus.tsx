import { useEffect, useState } from 'react';

export function useOnlineStatus() {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const goOnline = () => setOnline(true);
        window.addEventListener('online', goOnline);

        const goOffline = () => setOnline(false);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    useEffect(() => {
        console.log(`User is now ${online ? 'online' : 'offline'}`);
    }, [online]);

    return online;
}
