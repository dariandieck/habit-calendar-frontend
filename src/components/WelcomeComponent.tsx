export function WelcomeComponent() {
    return (
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-pink-500 mb-6 drop-shadow-sm">
                ✨ Willkommen ✨ zu deinem Daily Habit Kalender 💅
            </h1>
            <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                    In diesem Kalender geht es darum, deine Gewohnheiten zu erfassen,
                    diese täglich zu bewerten und zu reflektieren 🧸🌸
                </p>
                <p className="bg-pink-100/50 p-4 rounded-2xl italic">
                    🦄 Das hilft dir bei deiner Reise, wieder Kontrolle zu erlangen und schlechte Angewohnheiten bleiben zu
                    lassen 👑💅💗 (slay queen)
                </p>
                <p className="font-medium text-pink-400">
                    💌 Welche Habits möchtest du täglich bewerten? 💞
                </p>

                <div className="text-left bg-white p-6 rounded-2xl border border-pink-50 shadow-sm">
                    <p className="font-semibold mb-2 text-purple-400">Beispiele könnten sein:</p>
                    <ol className="list-none space-y-1 ml-2">
                        <li>💧 Genug trinken </li>
                        <li>🦄 <span className="text-purple-500">Nicht</span> an Fingernägeln kauen</li>
                        <li>🍬 Gesund essen / keine Süßigkeiten</li>
                    </ol>
                </div>

                <p className="text-sm text-gray-400 mt-4 px-8">
                    Schreibe genau auf, was die schlechte Gewohnheit ist und vergebe einen Kurznamen (max. 3 Worte).
                </p>
            </div>
        </div>
    );
}