// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";

struct CampaignDetails {
    address campaignAddress;
    address owner;
    string title;
    uint256 goalAmount;    // In Gwei
    uint256 totalAmountRaised; // In Wei
    CampaignStatus status;
    VoteStatus voteStatus;
    bool voteEligible;
}

contract CampaignFactory {
    address[] public campaigns;
    mapping(address => address[]) public userCampaigns;

    event CampaignCreated(address campaignAddress, address owner, string title);

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _endDate,
        string memory _imageUrl,
        Tier[] memory _tiers
    ) public {
        Campaign newCampaign = new Campaign(
            msg.sender,
            _title,
            _description,
            _goalAmount,
            _endDate,
            _imageUrl,
            _tiers
        );
        address campaignAddress = address(newCampaign);
        campaigns.push(campaignAddress);
        userCampaigns[msg.sender].push(campaignAddress);
        emit CampaignCreated(campaignAddress, msg.sender, _title);
    }

    function totalCampaigns() public view returns (uint256) {
        return campaigns.length;
    }

    function getAllCampaigns() public view returns (CampaignDetails[] memory) {
        return getCampaignsInRange(0, campaigns.length);
    }

    function getUserCampaigns(address _user) public view returns (CampaignDetails[] memory) {
        address[] memory userCampaignList = userCampaigns[_user];
        CampaignDetails[] memory details = new CampaignDetails[](userCampaignList.length);
        for (uint256 i = 0; i < userCampaignList.length; i++) {
            details[i] = getCampaignDetails(userCampaignList[i]);
        }
        return details;
    }

    function getVoteEligibleCampaigns(address _user) public view returns (CampaignDetails[] memory) {
        address[] memory userCampaignList = userCampaigns[_user];
        CampaignDetails[] memory details = new CampaignDetails[](userCampaignList.length > 50 ? 50 : userCampaignList.length);
        uint256 index = 0;
        for (uint256 i = 0; i < userCampaignList.length && index < details.length; i++) {
            Campaign campaign = Campaign(userCampaignList[i]);
            if (campaign.isVoteEligible()) {
                details[index] = getCampaignDetails(userCampaignList[i]);
                index++;
            }
        }
        if (index < details.length) {
            assembly {
                mstore(details, index)
            }
        }
        return details;
    }

    function getCampaignsInRange(uint256 start, uint256 end) public view returns (CampaignDetails[] memory) {
        require(end >= start && end <= campaigns.length, "Invalid range");
        CampaignDetails[] memory details = new CampaignDetails[](end - start);
        for (uint256 i = start; i < end; i++) {
            details[i - start] = getCampaignDetails(campaigns[i]);
        }
        return details;
    }

    function getCampaignDetails(address campaignAddr) private view returns (CampaignDetails memory) {
        Campaign campaign = Campaign(campaignAddr);
        return CampaignDetails({
            campaignAddress: campaignAddr,
            owner: campaign.owner(),
            title: campaign.title(),
            goalAmount: campaign.goalAmount(),
            totalAmountRaised: campaign.totalAmountRaised(),
            status: campaign.status(),
            voteStatus: campaign.getCurrentVoteStatus(),
            voteEligible: campaign.isVoteEligible()
        });
    }

    function getCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}