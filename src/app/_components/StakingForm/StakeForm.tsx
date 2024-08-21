"use client";

import { useAccount } from 'wagmi';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useCallback, useState } from 'react';
import { ethers } from "ethers";
import StakedBTCABI from '../../../blockchain/config/ABI.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CONTRACT_ADDRESS = '0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4';

declare global {
  interface Window {
    ethereum: any;
  }
}

const StakeForm = () => {
    const { isConnected } = useAccount();
    const [tokens, setTokens] = useState<string>("");

    const handleDeposit = useCallback(async () => {
        if (!tokens || parseFloat(tokens) <= 0) {
            toast.warn("Please enter a valid token amount.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);

            const tx = await contract.deposit({
                value: tokens
            });

            await tx.wait();
            toast.success("Tokens deposited successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
            toast.error("Error depositing tokens. Please try again.");
        }
    }, [tokens]);

    const handleStake = useCallback(async () => {
        if (!tokens || parseFloat(tokens) <= 0) {
            toast.warn("Please enter a valid token amount.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);

            const tx = await contract.stake(tokens);
            await tx.wait();
            toast.success("Tokens staked successfully!");
        } catch (error) {
            console.error("Error staking tokens:", error);
            toast.error("Error staking tokens. Please try again.");
        }
    }, [tokens]);

    const handleUnstake = useCallback(async () => {
        if (!tokens || parseFloat(tokens) <= 0) {
            toast.warn("Please enter a valid token amount.");
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);

            const tx = await contract.unstake(tokens);
            await tx.wait();
            toast.success("Tokens unstaked successfully!");
        } catch (error) {
            console.error("Error unstaking tokens:", error);
            toast.error("Error unstaking tokens. Please try again.");
        }
    }, [tokens]);

    return (
        <div className="my-2 w-[300px]">
            <input
                type="number"
                name='tokens'
                className="mb-2 w-full rounded-md p-2"
                placeholder='State amount (in WEI)'
                min="0"
                step="any"
                value={tokens}
                onChange={(e) => setTokens(e.target.value)}
                required
            />
            <PrimaryButton disabled={!isConnected} onClick={handleDeposit} className="inline-block w-full disabled:cursor-not-allowed">
                Buy sBNB
            </PrimaryButton>
            <PrimaryButton disabled={!isConnected} onClick={handleStake} className="inline-block mt-3 w-full disabled:cursor-not-allowed" style={{ backgroundColor: '#FF6347', color: '#fff' }}>
                Stake sBNB
            </PrimaryButton>
            <PrimaryButton disabled={!isConnected} onClick={handleUnstake} className="inline-block mt-3 w-full disabled:cursor-not-allowed" style={{ backgroundColor: '#FF6347', color: '#fff' }}>
                UnStake sBNB
            </PrimaryButton>
            <ToastContainer />
        </div>
    );
}

export default StakeForm;
