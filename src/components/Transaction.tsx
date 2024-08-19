import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

const Transaction = ({ transaction }: { transaction: { id: number, type: string, amount: number } }) => {
    return (
        <article className='h-[150px] basis-[200px] cursor-pointer rounded-md border-2 p-3 shadow-[#FF66BE] transition-all hover:scale-[1.1] hover:shadow-lg'>
            <Image src="/bnb-logo.svg" alt="bnb-logo" width={26} height={26} />
            <div className='mt-2 flex flex-col items-center gap-y-1'>
                <h5 className='text-md font-semibold'>
                    {transaction.type === "staked" ? "Staked" : transaction.type === "withdraw" ? "WithDrawn" : "Reward Claimed"}
                </h5>
                <p className={cn(transaction.type === "staked" ? "text-green-600" : transaction.type === "withdraw" ? "text-red-600" : "text-orange-500")}>
                    {transaction.type === "staked" ? "+" : transaction.type === "withdraw" ? "-" : ""}
                    {transaction.amount} {" "}
                    {transaction.type === "reward" ? "₹" : "BTC"}
                </p>
            </div>
        </article>
    )
}

export default Transaction