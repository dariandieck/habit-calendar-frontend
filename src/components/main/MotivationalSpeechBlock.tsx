interface MotivationalSpeechBlockProps {
    motivationalSpeech: string
}

export function MotivationalSpeechBlock({motivationalSpeech}: MotivationalSpeechBlockProps) {
    return (
        <div
            className="mt-12 p-6 bg-linear-to-br from-purple-100/50 to-pink-100/50 rounded-2xl border border-white shadow-inner">
            <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
                💭 Und noch ein motivierender Spruch für dich:
            </h3>
            <p className="italic text-gray-600 leading-relaxed">
                "{motivationalSpeech}"
            </p>
        </div>
    )
}