'use client'

import React, { ReactNode } from 'react'
import wagmiConfig, { projectId, metadata } from '@/blockchain/config'

import { createWeb3Modal } from '@web3modal/wagmi/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
createWeb3Modal({   
    metadata,
    wagmiConfig,
    projectId,
    themeMode: "light",
    themeVariables: {
        "--w3m-border-radius-master": "3px",
        "--w3m-accent": "#ec50ab"
    }
})

export default function Web3Context({
    children,
    initialState
}: {
    children: ReactNode
    initialState?: State
}) {
    return (
        <WagmiProvider config={wagmiConfig} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}