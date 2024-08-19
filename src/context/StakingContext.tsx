"use client";
import { createContext, PropsWithChildren } from "react";

export const StakingContext = createContext<{} | undefined>(undefined)

interface Props extends PropsWithChildren {
    
}

export const StakingContextProvider = ({ children }: Props) => {

    return (
        <StakingContext.Provider value={{}}>
            {children}
        </StakingContext.Provider>
    )
}