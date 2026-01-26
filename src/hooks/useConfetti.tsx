import {useEffect, useRef} from "react";
import confetti from "canvas-confetti";

export const useConfetti = (score: number, thresh_low: number, thresh_high: number, shapes: string[]) => {
    const hasFiredForThisRange = useRef(false);

    useEffect(() => {
        if (!(thresh_low <= score && score <= thresh_high)) {
            hasFiredForThisRange.current = false;
            return;
        }
        if (hasFiredForThisRange.current) return;
        hasFiredForThisRange.current = true;
        const particleCount = 1
        const confettiShapes = shapes.map(shape => confetti.shapeFromText({text: shape, scalar: 7}))
        const duration = 800
        const defaults = { startVelocity: 1, ticks: 300, zIndex: 0, gravity: 1, flat: true, angle: 270 };
        const animationEnd = Date.now() + duration;
        const randomInRange =
            (min: number, max: number) => Math.random() * (max - min) + min;
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            confetti({
                ...defaults,
                particleCount: particleCount,
                shapes: confettiShapes,
                scalar: 3,
                origin: { x: randomInRange(0.0, 1.0), y: randomInRange(0.0, 0.2) }
            });
            confetti({
                ...defaults,
                particleCount: particleCount,
                shapes: confettiShapes,
                scalar: 4,
                origin: { x: randomInRange(0.0, 1.0), y: randomInRange(0.0, 0.2) }
            });

            confetti({
                ...defaults,
                particleCount: particleCount,
                shapes: confettiShapes,
                scalar: 2,
                origin: { x: randomInRange(0.3, 0.7), y: randomInRange(0.0, 0.2) }
            });
            confetti({
                ...defaults,
                particleCount: particleCount,
                shapes: confettiShapes,
                scalar: 5,
                origin: { x: randomInRange(0.3, 0.7), y: randomInRange(0.0, 0.2) }
            });
        }, 100);

        return () => {
            hasFiredForThisRange.current = false;
            clearInterval(interval);
        };
    }, [score, shapes, thresh_high, thresh_low]);
}