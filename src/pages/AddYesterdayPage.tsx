import {useState} from "react";
import {RainbowButton} from "../components/ui/RainbowButton.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {useNavigate} from "react-router-dom";
import {MAIN_PAGE} from "../routes/RouteRedirector.tsx";

export function AddYesterdayPage() {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const { isShowAddYesterdaysEntryPopup, setIsShowAddYesterdaysEntryPopup, setIsYesterdaysMainForm } = useAppDataContext();
    const navigate = useNavigate();

    const onSubmit = (yesPressed: boolean) => {
        if(!yesPressed) {
            setIsShowAddYesterdaysEntryPopup(false);
            return;
        }

        setIsSaving(true);
        setTimeout(async () => {
            setIsShowAddYesterdaysEntryPopup(false);
            setIsYesterdaysMainForm(true);
            navigate(MAIN_PAGE);
            setIsSaving(false);
        }, 2000);

    };

    return (
        <>
            {isShowAddYesterdaysEntryPopup && (
                <div className="page-overlay flex justify-center items-start p-4">
                    <div className="flex justify-center items-baseline-last">
                        <div className="w-full max-w-md bg-white backdrop-blur-xl p-10 rounded-3xl
                        shadow-2xl border border-pink-100 text-center transition-all">

                            {/* Header Bereich */}
                            <div className="mb-8">
                                <div className="text-5xl mb-4 animate-bounce inline-block">📅</div>
                                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-500">
                                    Huch, da fehlt was!
                                </h1>
                                <p className="text-gray-400 italic text-sm mt-3">
                                    Du hast gestern gar keinen Eintrag gemacht 🥺 <br/>
                                    Möchtest du das jetzt schnell nachholen?
                                </p>
                            </div>

                            {/* Button Bereich */}
                            <div className="space-y-4 mt-8">
                                <RainbowButton
                                    isSubmit={false}
                                    text={"Ja gerne ✨"}
                                    actionText={"Jaaaaaaa!"}
                                    actionEmoji={"✨"}
                                    isSaving={isSaving}
                                    onClick={() => onSubmit(true)}
                                />


                                <button
                                    onClick={() => onSubmit(false)}
                                    className="w-full p-4 rounded-xl font-bold text-purple-400 bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-all flex justify-center items-center gap-2"
                                >
                                    Nein
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}