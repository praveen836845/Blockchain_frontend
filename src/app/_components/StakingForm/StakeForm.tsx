"use client";

import { useAccount } from 'wagmi';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { FormEvent, useCallback } from 'react';
import { ethers } from "ethers";
import StakedBTCABI from '../../../blockchain/config/ABI.json'; // Adjust the import path as needed

const CONTRACT_ADDRESS = '0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4'; // Replace with your actual contract address

const StakeForm = () => {
    const { isConnected } = useAccount();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(e.currentTarget);
        const tokens = parseFloat(formData.get('tokens')?.toString() ?? '0');

        if (tokens <= 0) {
            console.log("Please enter a valid token amount.");
            return;
        }

        try {
            // Use Web3Provider instead of BrowserProvider
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            // Request user accounts and get the signer
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            console.log("Account:", await signer.getAddress());

            // Create the contract instance
            const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);
            // console.log(contract);

            console.log("Submitting stake request..." , tokens);

            // Call the deposit function with the appropriate token amount
            // const tx = await contract.deposit(parseInt(tokens.toString(), 18)); // Adjust decimals as needed
            const  tx  = await contract.deposit({
                value: tokens  // Sending 0.1 BNB (in wei)
              });

              
            await tx.wait(); // Wait for the transaction to be mined
            const userAddress = await signer.getAddress();
           const sBNBBalance = await contract.balanceOf(userAddress);
           console.log('User sBNB Balance After Deposit:', sBNBBalance  , ethers.utils.formatEther(sBNBBalance));


            console.log("Tokens staked successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="my-2 w-[300px]">
            <input
                type="number"
                name='tokens'
                className="mb-2 w-full rounded-md p-2"
                placeholder='Stake your WBTC Token'
                min="0"
                step="any" // Allows fractional values
                required
            />
            <PrimaryButton disabled={!isConnected} type="submit" className="inline-block w-full disabled:cursor-not-allowed">
                Deposit
            </PrimaryButton>
        </form>
        
    );
}

export default StakeForm;
