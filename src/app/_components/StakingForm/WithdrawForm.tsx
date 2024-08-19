"use client"
import PrimaryButton from "@/components/buttons/PrimaryButton"
import { FormEvent, useCallback } from "react"
import { useAccount } from "wagmi"


const WithdrawForm = () => {
    const { isConnected } = useAccount()
    const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        const tokens = parseFloat(formData.get('tokens')?.toString() ?? '0')
        if (tokens <= 0) {
            // Validating
        }
    }, [])
    return (
        <form onSubmit={handleSubmit} className="my-2 w-[300px]">
            <input name="tokens" type="number" className="mb-2 w-full rounded-md p-2" placeholder="Unstake your token" />
            <PrimaryButton disabled={!isConnected} type="submit" className="inline-block w-full disabled:cursor-not-allowed">
                Withdraw
            </PrimaryButton>
        </form>
    )
}

export default WithdrawForm