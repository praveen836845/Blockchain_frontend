
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakedBNB is ERC20, Ownable {
    // Mapping to track how much BNB each user deposited
    mapping(address => uint256) public depositedBNB;
    // Mapping to track how much a user deposited to a timestamp
    struct DepositInfo {
    uint256 timestamp;
    uint256 amount;
}
mapping(address => DepositInfo[]) public userDeposits;

    uint256 public totalStaked;

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => StakeInfo[]) public userStakes;
    mapping(address => uint256) public lastStakedAmount;

    uint256 public constant MINIMUM_STAKE = 1e15;
    uint256 public constant UNBONDING_PERIOD = 2 days;

    uint256 public constant ANNUAL_REWARD_RATE = 5;  
    uint256 public constant RATE_DENOMINATOR = 100;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    // Events to log when users deposit or withdraw their BNB
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // Events to log when user stakes or unstakes their token
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsDistributed(address indexed user, uint256 amount);

   constructor() ERC20("Staked BNB", "sBNB" ) Ownable(msg.sender) {}

  
    // Function to deposit BNB and receive sBNB tokens
    function deposit() external payable {
        require(msg.value > 0, "Must send some BNB");
        

        // Mint equivalent amount of sBNB to the user
        _mint(msg.sender, msg.value);

        // Update the deposited amount in the user's account
        depositedBNB[msg.sender] += msg.value;

         userDeposits[msg.sender].push(DepositInfo({
        timestamp: block.timestamp,
        amount: msg.value
    }));
        // Emit the deposit event to log the transaction
        emit Deposit(msg.sender, msg.value);
    }


function getDepositInfo(address user) public view returns (string memory) {
    DepositInfo[] memory deposits = userDeposits[user];
    
    if (deposits.length == 0) {
        return "This address has not made any deposits yet.";
    }
    
    string memory result = "";
    for (uint i = 0; i < deposits.length; i++) {
        result = string(abi.encodePacked(
            result,
            "Deposit ", uint2str(i+1), ": ",
            uint2str(deposits[i].amount), " get SBNB at timestamp ",
            uint2str(deposits[i].timestamp), "\n"
        ));
    }
    
    return result;
}

// Helper function to convert uint to string (same as before)
function uint2str(uint256 _i) internal pure returns (string memory) {
    if (_i == 0) {
        return "0";
    }
    uint256 j = _i;
    uint256 length;
    while (j != 0) {
        length++;
        j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint256 k = length;
    j = _i;
    while (j != 0) {
        bstr[--k] = bytes1(uint8(48 + j % 10));
        j /= 10;
    }
    return string(bstr);
}

    // Function to withdraw the original BNB by burning sBNB tokens
    function withdraw(uint256 _amount) external {
        require(depositedBNB[msg.sender] >= _amount, "Insufficient deposited amount");

        // Burn the sBNB tokens from the user's balance
        _burn(msg.sender, _amount);

        // Reduce the deposited amount in the user's account
        depositedBNB[msg.sender] -= _amount;

        // Transfer the equivalent amount of BNB back to the user
        payable(msg.sender).transfer(_amount);

        // Emit the withdraw event to log the transaction
        emit Withdraw(msg.sender, _amount);
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Cannot stake 0 tokens");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        _transfer(msg.sender, address(this), _amount);
        userStakes[msg.sender].push(StakeInfo({
            amount: _amount,
            timestamp: block.timestamp
        }));
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public {
        require(_amount > 0, "Cannot unstake 0 tokens");
        require(userStakes[msg.sender].length > 0, "No stakes found");

        uint256 i = 0;
        uint256 totalUnstaked = 0;
        while(i < userStakes[msg.sender].length && totalUnstaked < _amount) {
            StakeInfo storage stakeInfo = userStakes[msg.sender][i];
            if(block.timestamp >= stakeInfo.timestamp + UNBONDING_PERIOD) {
                uint256 amountToUnstake = _amount - totalUnstaked < stakeInfo.amount ? 
                                      _amount - totalUnstaked : 
                                      stakeInfo.amount;
            
                totalUnstaked += amountToUnstake;
                stakeInfo.amount -= amountToUnstake;
                if (stakeInfo.amount == 0) {
                    // Remove the stake if it's fully unstaked
                    userStakes[msg.sender][i] = userStakes[msg.sender][userStakes[msg.sender].length - 1];
                    userStakes[msg.sender].pop();
                } else {
                    i++;
                }
            }
            else {
                i++;
            }
        }
        require(totalUnstaked == _amount, "Insufficient unstakable amount");

        uint256 rewards = calculateRewards(msg.sender) - lastStakedAmount[msg.sender];

        lastStakedAmount[msg.sender] += rewards;
        
        // Mint new sBNB tokens as rewards
        _mint(msg.sender, rewards);
        
        emit RewardsDistributed(msg.sender, rewards);

        totalStaked -= totalUnstaked;
        _transfer(address(this), msg.sender, totalUnstaked);

        emit Unstaked(msg.sender, totalUnstaked);
    }

    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender) - lastStakedAmount[msg.sender];
        require(rewards > 0, "No rewards to claim");
        lastStakedAmount[msg.sender] += rewards;
        
        // Mint new sBNB tokens as rewards
        _mint(msg.sender, rewards);
        
        emit RewardsDistributed(msg.sender, rewards);
    }

    function calculateRewards(address _user) public view returns (uint256) {
        uint256 totalRewards = 0;

        for (uint256 i = 0; i < userStakes[_user].length; i++) {
            StakeInfo memory stakeInfo = userStakes[_user][i];
            uint256 stakeDuration = block.timestamp - stakeInfo.timestamp;

            
            
            // Calculate rewards based on stake amount, duration, and fixed annual rate
            uint256 reward = (stakeInfo.amount * ANNUAL_REWARD_RATE * stakeDuration) / (RATE_DENOMINATOR * SECONDS_PER_YEAR);
            
            totalRewards += reward;
        }
        return totalRewards;
    }

    // Function to allow the contract to receive BNB
    receive() external payable {}
}
