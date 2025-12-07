"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import LoginForm from "./ui/LoginForm";

// ========================================
// 1. CREATE THE BOX (Context)
// ========================================
// This is the "global variable" container
// It holds: isOpen state + openLogin function + closeLogin function

interface ModalContextType {
    isLoginOpen: boolean;
    openLogin: () => void;
    closeLogin: () => void;
}

// Create the box with default empty values
const ModalContext = createContext<ModalContextType | null>(null);

// ========================================
// 2. THE PROVIDER - Puts stuff IN the box
// ========================================
// Wrap your app with this. It provides the actual values.

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    return (
        <ModalContext.Provider value={{ isLoginOpen, openLogin, closeLogin }}>
            {children}

            {/* The modal renders HERE, at the top level */}
            {isLoginOpen && <LoginForm onClose={closeLogin} />}
        </ModalContext.Provider>
    );
}

// ========================================
// 3. HOOK TO GET STUFF OUT - useModal()
// ========================================
// Call this from ANY component to get openLogin(), closeLogin()

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within ModalProvider");
    }
    return context;
}
