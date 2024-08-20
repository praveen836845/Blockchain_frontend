"use client";
import React, { ComponentProps, useEffect, useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { cn } from "@/lib/utils";
import StakedBTCABI from "../../blockchain/config/ABI.json";

const CONTRACT_ADDRESS = "0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4";

interface ClaimRewardButtonProps extends ComponentProps<"button"> {}

const ClaimRewardButton = ({ className, ...props }: ClaimRewardButtonProps) => {
  const { isConnected, address } = useAccount();
  const [rewardAmount, setRewardAmount] = useState<string>("0");
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  const fetchRewards = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request user accounts and get the signer
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", await signer.getAddress());

      // Create the contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        StakedBTCABI,
        signer
      );

      const rewards = await contract.calculateRewards(address);
      setRewardAmount(ethers.utils.formatEther(rewards));


    } catch (error) {}
  };

  useEffect(() => {
    if (isConnected) {
      fetchRewards();
    }
  }, [isConnected, address]);

  const claimRewards = async () => {
    setIsClaiming(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Request user accounts and get the signer
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      console.log("Account:", await signer.getAddress());

      // Create the contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        StakedBTCABI,
        signer
      );
      const tx = await contract.claimRewards();
      await tx.wait();  // Wait for the transaction to be mined

      console.log("Rewards claimed:", tx);
      fetchRewards();
    } catch (error) {
      console.error("Error claiming rewards:", error);
    }
    finally{
      setIsClaiming(false);
    }
  }

  return (
    <PrimaryButton
      disabled={!isConnected || isClaiming}
      className={cn("disabled:cursor-not-allowed", className)}
      onClick={claimRewards}  // Trigger the claimRewards function on click
      {...props}
    >
      {isClaiming ? "Claiming..." : `Claim Reward - (${rewardAmount} sBNB)`}
    </PrimaryButton>
  );
};

export default ClaimRewardButton;
