"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { AppContextType } from "../types/global";
import { Shift } from "../types/planning";


const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [planning, setPlanning] = useState<Shift[]>()

    return (
            <AppContext.Provider value={{ 
                planning,
                setPlanning
            }}>
                {children}
            </AppContext.Provider>
        );
    }

export const useAppConfig = () => {
    const context = useContext(AppContext);
    
    if (context === undefined) {
        throw new Error("useAppConfig doit être utilisé à l'intérieur d'un AppProvider");
    }
    
    return context;
};
