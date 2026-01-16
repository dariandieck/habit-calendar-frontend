import type {LoginData} from "../types/loginData.ts";
import {login} from "../services/api.service.ts";
import {useAuthContext} from "../context/AuthContext.tsx";
import {LoginInputForm} from "../components/login/LoginInputForm.tsx";
import type {TokenData} from "../types/tokenData.ts";

export function LoginPage() {
    const { setTokenData } = useAuthContext();

    const handleLogin = async (loginData: LoginData) => {
        try {
            const loginResponse: TokenData = await login(loginData)
            if (loginResponse.success) {
                localStorage.setItem("access_token", loginResponse.access_token);
                localStorage.setItem("exp", loginResponse.expire);
                console.log("User logged in!");
                setTokenData(loginResponse);
            } else {
                console.log(`Could not login. Reason: ${loginResponse.message}`);
                alert(`Konnte nicht anmelden: ${loginResponse.message}`);
            }
        } catch (error) {
            console.log(`Exception while logging in. Error: ${error}`);
            alert(`Konnte nicht anmelden: ${error}`);
        }
    };

    return (
        <div className="login-overlay flex justify-center items-start">
            <div className="flex justify-center items-baseline-last p-4">
                <div
                    className="w-full max-w-md bg-white backdrop-blur-xl p-10 rounded-3xl
                    shadow-2xl border border-pink-100 text-center">

                    {/* Header Bereich */}
                    <div className="mb-8">
                        <div className="text-5xl mb-4 animate-bounce inline-block">🔒</div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-500">
                            Schön, dass du da bist!
                        </h1>
                        <p className="text-gray-400 italic text-sm mt-2">
                            Zuerst musst du dich anmelden (ist sicherer 💅)
                        </p>
                    </div>

                    <LoginInputForm handleLogin={handleLogin}
                    />

                    <p className="mt-8 text-xs text-gray-400 italic">
                        Passwort vergessen? Frag einfach deinen Lieblings-Schmari 🧸
                    </p>
                </div>
            </div>
        </div>
    );
}