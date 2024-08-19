import { ethers } from 'ethers';
import {StakedBTCABI}  from   '../lib/StakedBTC.json'
export const getContract = (provider, contractAddress) => {
    return new ethers.Contract(contractAddress, StakedBTCABI, provider);
}
