"use client"

import { useState } from "react";
import ClaimRewardButton from "@/components/buttons/ClaimRewardButton"
import StakeForm from "./StakeForm";
import WithdrawForm from "./WithdrawForm";
import { cn } from "@/lib/utils";

const StakingForm = () => {
    const [form, setForm] = useState<'stake' | 'withdraw'>('stake');

    return (
        <div className="w-[300px]">
            <div className="flex items-center justify-center gap-x-2">
                <button type="button" className={cn("rounded-sm bg-white/10 px-2 py-1", form === 'stake' && 'bg-white')} onClick={()=> setForm('stake')}>
                    Stake Token
                </button>
                <button type="button" className={cn("rounded-sm bg-white/10 px-2 py-1", form === 'withdraw' && 'bg-white')} onClick={()=> setForm('withdraw')}>
                    Withdraw Token
                </button>
            </div>
            {
                form === 'stake' ? <StakeForm /> : <WithdrawForm />
            }
            <ClaimRewardButton className="inline-block w-full" type="button" />
        </div>
    )
}
export default StakingForm