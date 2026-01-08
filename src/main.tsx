import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import "./index.css"

createRoot(document.getElementById('root')!).render(
    <div
        className="bg-pink-50 font-sans text-gray-700
            min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
        <StrictMode>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </StrictMode>
    </div>

)