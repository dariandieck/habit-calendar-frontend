import {useEffect, useState} from "react";
import {LoadingBar} from "../components/loading/LoadingBar.tsx";

export function LoadingPage() {
    const emojis = ["✨", "🌸", "🦄", "🧸", "🍦", "💫", "💞", "🎀", "👑","💖", "💅", "💗", "🍭", "💟"];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % emojis.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl
                border border-pink-100 text-center">
                <div className="relative mb-8 flex justify-center">
                    <div className="absolute w-24 h-24 bg-pink-200 rounded-full blur-2xl animate-pulse opacity-60">

                    </div>
                    <div
                        key={currentIndex}
                        className="relative text-6xl animate-bounce z-10 transition-all"
                    >
                        {emojis[currentIndex]}
                    </div>
                </div>

                {/* EMOJIS 💖✨🌸🌷🍓🦄🐰🐱🐣🍑🍒🍦🧁🍉💞💌🌈🎀👑💅💗💘🐶🍼
                🍬🍭🫧💟🩷🩰🧸🥰🥺🚰💧💦🌊🥤🔫🚿'😴🛏️🛌💤 */}
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-pink-500 tracking-wide animate-pulse">
                        Einen Moment bitte 🥹
                    </h2>
                    <p className="text-gray-400 text-">
                        🧸 Deine App wird gerade vorbereitet 🌸
                    </p>
                    <p className="text-gray-400 italic text-xs">
                        Manchmal braucht die Datenbank etwas länger :) <br />
                        Es kann helfen die Seite neu zu laden!
                    </p>
                </div>

                <LoadingBar />

                <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300 mt-3 font-medium">
                        Loading...
                </span>
            </div>
        </div>
    );
}