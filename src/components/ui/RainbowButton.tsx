interface RainbowButtonProps {
    isSubmit: boolean,
    isSaving: boolean,
    text: string,
    actionEmoji: string,
    actionText: string,
    onClick?: () => void
}

export function RainbowButton({isSubmit, isSaving, text, actionEmoji, actionText, onClick}: RainbowButtonProps) {
    return (
        <div className="relative group w-full h-[64px] flex items-center justify-center">
            {/* DER REGENBOGEN-KREISEL (Jetzt auch aktiv wenn isSaving wahr ist) */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square 
                        bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)] 
                        ${isSaving ? 'opacity-100 animate-[rainbow-spin_1s_linear_infinite] blur-md' : 'opacity-0 group-hover:opacity-100 group-hover:animate-rainbow-spin'} 
                        transition-all duration-500`}>
                </div>
            </div>

            {/* DER BUTTON */}
            <button
                disabled={isSaving}
                type={isSubmit ? 'submit' : 'button'}
                onClick={onClick}
                className={`relative z-20 overflow-hidden w-[calc(100%-8px)] h-[calc(100%-8px)] 
                        ${isSaving ? 'bg-white text-pink-500' : 'bg-linear-to-r from-pink-400 to-purple-500 text-white'}
                        font-bold rounded-[14px] shadow-lg transition-all duration-500
                        flex items-center justify-center gap-3 overflow-hidden`}
            >
                {isSaving ? (
                    <>
                        <span className="animate-bounce">{actionEmoji}</span>
                        <span className="tracking-widest uppercase text-sm">{actionText}</span>
                        <span className="animate-bounce">{actionEmoji}</span>
                    </>
                ) : (
                    <span>{text}</span>
                )}
            </button>
        </div>
    )
}