"use client";

import { StakingContextProvider } from '@/context/StakingContext';
import StakingForm from './StakingForm';
import { useEffect, useRef, useState  , useCallback  } from 'react';
import { ethers } from 'ethers';
import StakedBTCABI from '../../blockchain/config/ABI.json';

const CONTRACT_ADDRESS = '0xCd1B7882fF50772D772995120e8c0f1b4c84fBd4'; // Replace with your contract address

const StakingSection = () => {
  const [time, setTime] = useState('00:00:00:00');
  const [sBNBBalance, setSBNBBalance] = useState<string>('0'); // Store sBNB balance
  const ref = useRef<NodeJS.Timeout>();

  // Countdown Timer
  useEffect(() => {
    function countDown() {
      ref.current = setInterval(() => {
        const currentTime = new Date();
        const endTime = new Date('15 August 2024 09:00 UTC');
        endTime.setHours(9, 0, 0);
        const diffMs = Math.abs(endTime.getTime() - currentTime.getTime());

        // Convert to different time units
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

        setTime(`${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
    }

    countDown();

    return () => {
      clearInterval(ref.current);
    };
  }, []);

  // Fetch sBNB Balance
  const fetchSBNBBalance = useCallback(async () => {
    try {
      // Connect to Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      // Get user address and contract instance
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, StakedBTCABI, signer);

      // Fetch sBNB balance
      const balance = await contract.balanceOf(userAddress);
      const formattedBalance = ethers.utils.formatEther(balance); // Convert balance from Wei to Ether
      setSBNBBalance(balance.toString());
    } catch (error) {
      console.error('Error fetching sBNB balance:', error);
    }
  }, []);

  // Fetch the sBNB balance when the component mounts
  useEffect(() => {
    fetchSBNBBalance();
  }, [fetchSBNBBalance]);

  return (
    <StakingContextProvider>
      <section className='p-3'>
        <h2 className='text-2xl font-semibold'>Stake Your Tokens</h2>
        <div className='flex flex-col-reverse gap-3 p-1 sm:flex-row'>
          {/* Form */}
          <div className='flex flex-1 items-center justify-center'>
            <StakingForm />
          </div>

          {/* Information */}
          <div className='flex flex-1 flex-col items-center justify-center gap-y-3 text-center md:items-start'>
            <div className='w-[200px] rounded-md bg-white p-3'>
              <h4>Total amount stake:</h4>
              <p>200 sBTC</p>
            </div>
            <div className='w-[200px] rounded-md bg-white p-3'>
              <h4>APY:</h4>
              <p>8%</p>
            </div>
            <div className='w-[200px] rounded-md bg-white p-3'>
              <h4>Unbonding Period:</h4>
              <p>2 days</p>
            </div>
            {/* New Section for sBNB Balance */}
            <div className='w-[200px] rounded-md bg-white p-3'>
              <h4>Your sBNB Balance:</h4>
              <p>{sBNBBalance} sBNB</p>
            </div>
          </div>
        </div>
      </section>
    </StakingContextProvider>
  );
};

export default StakingSection;
