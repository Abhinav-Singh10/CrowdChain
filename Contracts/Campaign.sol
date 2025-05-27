
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Tier {
    string name;
    uint256 amount; // In Gwei
}

struct Vote {
    uint256 amount;
    string description;
    uint256 startTime;
    uint256 endTime;
    uint256 yesWeight;
    uint256 noWeight;
    VoteStatus status;
}

enum CampaignStatus { Active, Ended, Cancelled }
enum VoteStatus { Active, Approved, Rejected, NoVotes, Eligible }

contract Campaign {
    address public owner;
    string public title;
    string public description;
    uint256 public goalAmount;      // In Gwei
    uint256 public totalAmountRaised; // In Wei
    uint256 public FundingGranted;   // In Wei
    uint256 public startDate;
    uint256 public endDate;
    string public imageUrl;
    Tier[] public tiers;
    CampaignStatus public status;

    mapping(address => uint256) public donations; // In Wei
    address[] public donors;
    Vote[] public votes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event Donated(address donor, uint256 amount);
    event VoteStarted(uint256 voteId, uint256 amount, string description, uint256 endTime);
    event Voted(uint256 voteId, address voter, bool vote, uint256 weight);
    event VoteEnded(uint256 voteId, VoteStatus status, uint256 yesWeight, uint256 noWeight);
    event FundsReleased(address owner, uint256 amount);
    event CampaignCancelled(address owner);

    constructor(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _endDate,
        string memory _imageUrl,
        Tier[] memory _tiers
    ) {
        require(_owner != address(0), "Invalid owner");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_endDate > block.timestamp, "End date must be in the future");
        require(_endDate <= block.timestamp + 365 days, "End date too far");
        require(bytes(_imageUrl).length > 0, "Image URL cannot be empty");
        require(_tiers.length > 0 && _tiers.length <= 10, "1-10 tiers required");

        for (uint256 i = 0; i < _tiers.length; i++) {
            require(bytes(_tiers[i].name).length > 0, "Tier name cannot be empty");
            require(_tiers[i].amount > 0, "Tier amount must be greater than 0");
            require(_tiers[i].amount <= _goalAmount, "Tier amount exceeds goal");
            for (uint256 j = i + 1; j < _tiers.length; j++) {
                require(
                    keccak256(abi.encodePacked(_tiers[i].name)) !=
                    keccak256(abi.encodePacked(_tiers[j].name)),
                    "Duplicate tier names"
                );
            }
        }

        owner = _owner;
        title = _title;
        description = _description;
        goalAmount = _goalAmount;
        startDate = block.timestamp;
        endDate = _endDate;
        imageUrl = _imageUrl;
        status = CampaignStatus.Active;
        for (uint256 i = 0; i < _tiers.length; i++) {
            tiers.push(_tiers[i]);
        }
    }

    function cancelCampaign() public {
        require(msg.sender == owner, "Only owner can cancel");
        require(status == CampaignStatus.Active, "Campaign not active");
        status = CampaignStatus.Cancelled;
        emit CampaignCancelled(owner);
    }

    function updateStatus() public {
        if (status == CampaignStatus.Active && block.timestamp > endDate) {
            status = CampaignStatus.Ended;
        }
    }

    function donate() public payable {
        require(status == CampaignStatus.Active, "Campaign not active");
        require(msg.value > 0, "Must donate something");

        bool validTier = false;
        for (uint256 i = 0; i < tiers.length; i++) {
            if (msg.value == tiers[i].amount * 1e9) {
                validTier = true;
                break;
            }
        }
        require(validTier, "Donation must match a tier amount");

        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        donations[msg.sender] += msg.value;
        totalAmountRaised += msg.value;

        emit Donated(msg.sender, msg.value);
    }

    function startVote(uint256 _amount, string memory _description) public {
        require(msg.sender == owner, "Only owner can start vote");
        require(status != CampaignStatus.Cancelled, "Campaign cancelled");
        require(_amount > 0 && _amount <= address(this).balance, "Invalid amount");
        require(isVoteEligible(), "Vote not allowed");

        for (uint256 i = 0; i < votes.length; i++) {
            require(votes[i].status != VoteStatus.Active, "Active vote exists");
        }

        updateStatus();

        uint256 voteEndTime;
        if (status == CampaignStatus.Active) {
            // TESTING ONLY: Use minutes
            // For production: block.timestamp + 1 days, block.timestamp + 7 days
            voteEndTime = min(
                max(endDate, block.timestamp + 1 minutes),
                block.timestamp + 7 minutes
            );
        } else {
            // TESTING ONLY: 3 minutes
            // For production: block.timestamp + 3 days
            voteEndTime = block.timestamp + 3 minutes;
        }

        votes.push(Vote({
            amount: _amount,
            description: _description,
            startTime: block.timestamp,
            endTime: voteEndTime,
            yesWeight: 0,
            noWeight: 0,
            status: VoteStatus.Active
        }));

        emit VoteStarted(votes.length - 1, _amount, _description, voteEndTime);
    }

    function vote(uint256 _voteId, bool _voteYes) public {
        updateStatus();
        require(status != CampaignStatus.Cancelled, "Campaign cancelled");
        require(_voteId < votes.length, "Invalid vote ID");
        Vote storage currentVote = votes[_voteId];
        require(currentVote.status == VoteStatus.Active, "Vote not active");
        require(block.timestamp <= currentVote.endTime, "Voting period ended");
        require(donations[msg.sender] > 0, "Only donors can vote");
        require(!hasVoted[_voteId][msg.sender], "Already voted");

        uint256 weight = donations[msg.sender];
        hasVoted[_voteId][msg.sender] = true;
        if (_voteYes) {
            currentVote.yesWeight += weight;
        } else {
            currentVote.noWeight += weight;
        }

        emit Voted(_voteId, msg.sender, _voteYes, weight);
    }

    function finalizeVote(uint256 _voteId) public {
        updateStatus();
        require(status != CampaignStatus.Cancelled, "Campaign cancelled");
        require(_voteId < votes.length, "Invalid vote ID");
        Vote storage currentVote = votes[_voteId];
        require(currentVote.status == VoteStatus.Active, "Vote not active");
        require(block.timestamp > currentVote.endTime, "Voting still active");

        if (currentVote.yesWeight + currentVote.noWeight == 0) {
            currentVote.status = VoteStatus.NoVotes;
        } else if (currentVote.yesWeight > currentVote.noWeight) {
            currentVote.status = VoteStatus.Approved;
            FundingGranted += currentVote.amount;
            payable(owner).transfer(currentVote.amount);
            emit FundsReleased(owner, currentVote.amount);
        } else {
            currentVote.status = VoteStatus.Rejected;
        }

        emit VoteEnded(_voteId, currentVote.status, currentVote.yesWeight, currentVote.noWeight);
    }

    function getCurrentVoteStatus() public view returns (VoteStatus) {
        if (votes.length > 0 && votes[votes.length - 1].status == VoteStatus.Active) {
            return VoteStatus.Active;
        }
        if (isVoteEligible()) {
            return VoteStatus.Eligible;
        }
        if (votes.length == 0) {
            return VoteStatus.NoVotes;
        }
        return votes[votes.length - 1].status;
    }

    function getCurrentVoteId() public view returns (uint256) {
        require(votes.length > 0, "No votes exist");
        uint256 voteId = votes.length - 1;
        require(votes[voteId].status == VoteStatus.Active, "No active vote");
        return voteId;
    }

    function isVoteEligible() public view returns (bool) {
        return status != CampaignStatus.Cancelled &&
               FundingGranted < totalAmountRaised &&
               address(this).balance > 0;
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function getTiersCount() public view returns (uint256) {
        return tiers.length;
    }

    function getVotesCount() public view returns (uint256) {
        return votes.length;
    }

    function getTotalDonors() public view returns (uint256) {
        return donors.length;
    }

    function getTier(uint256 index) public view returns (string memory name, uint256 amount) {
        require(index < tiers.length, "Invalid tier index");
        Tier memory tier = tiers[index];
        return (tier.name, tier.amount);
    }

    function getAllTiers() public view returns (Tier[] memory) {
        return tiers;
    }

    // Added function to fetch all donors
    function getAllDonors() public view returns (address[] memory) {
        return donors;
    }
}
