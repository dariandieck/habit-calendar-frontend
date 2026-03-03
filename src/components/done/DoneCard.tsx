export function DoneCard() {
    return (
        <div className="flex justify-center items-center p-4 ">
            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl
                border border-pink-100 text-center">
                <div className="text-6xl mb-6 animate-bounce">
                    👑
                </div>

                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-500 mb-4">
                    Geschafft!
                </h2>

                <p className="text-gray-600 leading-relaxed italic">
                    Super gemacht! Du hast deinen Tag heute erfolgreich reflektiert.
                    <br /><br />
                    Warte bis morgen ab :) Dann kannst du wieder bewerten! 💞💫
                </p>

                <div className="mt-8 flex justify-center gap-2 text-pink-800">
                    <span className="animate-pulse [animation-delay:0ms]">✨</span>
                    <span className="animate-pulse [animation-delay:400ms]">🌸</span>
                    <span className="animate-pulse [animation-delay:800ms]">✨</span>
                </div>
            </div>
        </div>
    )
}