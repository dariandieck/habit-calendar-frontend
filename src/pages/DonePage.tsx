import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {DoneCard} from "../components/done/DoneCard.tsx";
import {GoToHabitSummaryCard} from "../components/ui/GoToHabitSummaryCard.tsx";

export function DonePage() {
    const { isUserLoggedIn } = useAuthContext();
    const { isYesterdaysMainForm } = useAppDataContext();

    useEffect(() => {
        if (!isUserLoggedIn) return;

        const duration = 4000
        const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 0};
        const animationEnd = Date.now() + duration;
        const randomInRange =
            (min: number, max: number) => Math.random() * (max - min) + min;
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Zwei Feuerwerke gleichzeitig von links und rechts unten
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);


        return () => {clearInterval(interval);};
    }, [isUserLoggedIn, isYesterdaysMainForm]);


    return (
        <>
            <DoneCard/>
            <GoToHabitSummaryCard small={true}/>
        </>
    );
}