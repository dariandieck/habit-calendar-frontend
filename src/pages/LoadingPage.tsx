import {useEffect, useState} from "react";

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
                    <div className="absolute w-24 h-24 bg-pink-200 rounded-full blur-2xl animate-pulse opacity-60"></div>
                    <div
                        key={currentIndex}
                        className="relative text-6xl animate-bounce z-10 transition-all"
                    >
                        {emojis[currentIndex]}
                    </div>
                </div>

                {/* EMOJIS 💖✨🌸🌷🍓🦄🐰🐱🐣🍑🍒🍦🧁🍉💞💌🌈🎀👑💅💗💘🐶🍼🍬🍭🫧💟🩷🩰🧸🥰🥺🚰💧💦🌊🥤🔫🚿'😴🛏️🛌💤 */}
                <div className="text-center space-y-3">
                    <h2 className="text-3xl font-bold text-pink-500 tracking-wide animate-pulse">
                        Einen Moment bitte 🥹
                    </h2>
                    <p className="text-gray-400 text-">
                        🧸 Deine App wird gerade vorbereitet 🌸
                    </p>
                    <p className="text-gray-400 italic text-sm">
                        Manchmal braucht die Datenbank etwas länger :)
                    </p>
                </div>

                <div className="mt-8 w-48 h-1.5 bg-pink-100 rounded-full overflow-hidden m-auto">
                    <div className="h-full bg-linear-to-r from-pink-300 to-purple-300 w-1/2
                        rounded-full animate-[shimmer_2s_infinite] origin-left"></div>
                </div>

                <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300 mt-3 font-medium">
                        Loading...
                </span>
            </div>
        </div>
    );
}