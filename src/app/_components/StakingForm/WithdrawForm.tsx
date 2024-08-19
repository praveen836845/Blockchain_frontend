"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import { FormEvent, useCallback } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import StakedBTCABI from '../../../blockchain/config/ABI.json'; // Adjust path as needed

const CONTRACT_ADDRESS = '0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4'; // Replace with your actual contract address

const WithdrawForm = () => {
    const { isConnected } = useAccount();

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const tokens = parseFloat(formData.get('tokens')?.toString() ?? '0');

        if (tokens <= 0) {
            console.log("Please enter a valid token amount.");
            return;
        }

        try {
            // Initialize ethers.js provider and signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            // Create the contract instance
            const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);

            // Convert the token amount to Wei (if required)
            // const amountInWei = ethers.utils.parseEther(tokens.toString());

            // Call the withdraw function from the contract
            const tx = await contract.withdraw(tokens);
            console.log("checking why this is happening" , tx);

            // Wait for the transaction to be mined
            await tx.wait();

            // Log the success
            console.log("Tokens unstaked successfully!");

            // Optionally, fetch and log the user's updated balance
            const userAddress = await signer.getAddress();
            const sBNBBalance = await contract.balanceOf(userAddress);
            console.log('Updated sBNB Balance:', ethers.utils.formatEther(sBNBBalance));

        } catch (error) {
            console.error("Error unstaking tokens:", error);
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="my-2 w-[300px]">
            <input
                name="tokens"
                type="number"
                className="mb-2 w-full rounded-md p-2"
                placeholder="Unstake your tokens"
                min="0"
                step="any"
                required
            />
            <PrimaryButton disabled={!isConnected} type="submit" className="inline-block w-full disabled:cursor-not-allowed">
                Withdraw
            </PrimaryButton>
        </form>
    );
};

export default WithdrawForm;
