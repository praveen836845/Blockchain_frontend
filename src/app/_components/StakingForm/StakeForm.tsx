"use client";

import { useAccount } from 'wagmi';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { FormEvent, useCallback, useState } from 'react';
import { ethers } from "ethers";
import StakedBTCABI from '../../../blockchain/config/ABI.json'; // Adjust the import path as needed

const CONTRACT_ADDRESS = '0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4'; // Replace with your actual contract address 

declare global {
    interface Window {
      ethereum: any;
    }
  }


const StakeForm = () => {
    const { isConnected } = useAccount();
    const [tokens, setTokens] = useState<string>(""); 

    const handleDeposit = useCallback(async () => {
        // e.preventDefault(); // Prevent default form submission

        // const formData = new FormData(e.currentTarget);
        // const tokens = parseFloat(formData.get('tokens')?.toString() ?? '0');

        if (!tokens || parseFloat(tokens) <= 0) {
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

            console.log("Submitting deposit request...", tokens.toString());
            // const tokenAmount = ethers.utils.parseUnits(tokens, 18);

            // Call the deposit function with the appropriate token amount
            // const tx = await contract.deposit(parseInt(tokens.toString(), 18)); // Adjust decimals as needed
            const  tx  = await contract.deposit({
                value: tokens  // Sending 0.1 BNB (in wei)
              });

              
            await tx.wait(); // Wait for the transaction to be mined
            setTimeout(async () => {
                try {
                    const userAddress = await signer.getAddress();
                    const sBNBBalance = await contract.balanceOf(userAddress);
                    console.log('User sBNB Balance After Deposit:', sBNBBalance, ethers.utils.formatEther(sBNBBalance));
                } catch (error) {
                    console.error("Error retrieving balance:", error);
                }
            }, 1000); 
            console.log("Tokens deposited successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
        }
    }, [tokens]);

    const handleStake = useCallback(async () => {
        if (!tokens || parseFloat(tokens) <= 0) {
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

            console.log("Submitting stake request...", tokens);
            // const tokenAmount = ethers.utils.parseUnits(tokens, 18);

            // Call the stake function with the appropriate token amount
            const tx = await contract.stake(ethers.utils.parseEther(tokens.toString()));

            await tx.wait(); // Wait for the transaction to be mined
            console.log("Tokens staked successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
        }
    }

    ,[tokens]);

    const handleUnstake = useCallback(async () => {
        if (!tokens || parseFloat(tokens) <= 0) {
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

            console.log("Submitting unstake request...", tokens);
            // const tokenAmount = ethers.utils.parseUnits(tokens, 18);

            // Call the stake function with the appropriate token amount
            const tx = await contract.unstake(ethers.utils.parseEther(tokens.toString()));

            await tx.wait(); // Wait for the transaction to be mined
            console.log("Tokens unstaked successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
        }
    }
    ,[tokens]);


    return (
        <div className="my-2 w-[300px]">
            <input
                type="number"
                name='tokens'
                className="mb-2 w-full rounded-md p-2"
                placeholder='State amount (in WEI)'
                min="0"
                step="any" // Allows fractional values
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                required
            />
            <PrimaryButton disabled={!isConnected} onClick={handleDeposit}  className="inline-block w-full disabled:cursor-not-allowed">
                Buy sBNB
            </PrimaryButton>
            <PrimaryButton disabled={!isConnected} onClick={handleStake} className="inline-block mt-3 w-full disabled:cursor-not-allowed" style={{ backgroundColor: '#FF6347', color: '#fff' }}>
                Stake sBNB
            </PrimaryButton>
            <PrimaryButton disabled={!isConnected} onClick={handleUnstake} className="inline-block mt-3 w-full disabled:cursor-not-allowed" style={{ backgroundColor: '#FF6347', color: '#fff' }}>
                UnStake sBNB
            </PrimaryButton>
        </div>
        
    );
}

export default StakeForm;
