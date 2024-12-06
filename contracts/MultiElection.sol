// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiElection {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Election {
        string title;
        uint256 startTime;
        uint256 endTime;
        Candidate[] candidates;
        mapping(address => bool) voters;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    address public owner;  // The contract owner address

    event ElectionCreated(uint256 electionId, string title, uint256 startTime, uint256 endTime);
    event Voted(uint256 electionId, uint256 candidateIndex);

    // Modifier to restrict function calls to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    // Constructor to set the owner at deployment
    constructor() {
        owner = msg.sender;
    }

    function createElection(
        string memory title,
        string[] memory candidateNames,
        uint256 startTime,
        uint256 endTime
    ) public onlyOwner {
        require(startTime < endTime, "Start time must be before end time");
        require(candidateNames.length > 0, "Candidates required");

        Election storage newElection = elections[electionCount];
        newElection.title = title;
        newElection.startTime = startTime;
        newElection.endTime = endTime;

        for (uint256 i = 0; i < candidateNames.length; i++) {
            newElection.candidates.push(Candidate({ name: candidateNames[i], voteCount: 0 }));
        }

        emit ElectionCreated(electionCount, title, startTime, endTime);
        electionCount++;
    }

    function vote(uint256 electionId, uint256 candidateIndex) public {
        Election storage election = elections[electionId];

        // Remove the time checks since you said it's being handled in the front-end

        require(!election.voters[msg.sender], "You have already voted");
        require(candidateIndex < election.candidates.length, "Invalid candidate index");

        election.candidates[candidateIndex].voteCount++;
        election.voters[msg.sender] = true;

        emit Voted(electionId, candidateIndex);
    }



    function getCandidates(uint256 electionId) public view returns (Candidate[] memory) {
        return elections[electionId].candidates;
    }

    function getWinner(uint256 electionId) public view returns (string memory winnerName, uint256 winnerVotes) {
        Election storage election = elections[electionId];
        require(block.timestamp > election.endTime, "Election is still ongoing");

        uint256 highestVotes = 0;
        string memory winningCandidate;

        for (uint256 i = 0; i < election.candidates.length; i++) {
            if (election.candidates[i].voteCount > highestVotes) {
                highestVotes = election.candidates[i].voteCount;
                winningCandidate = election.candidates[i].name;
            }
        }

        return (winningCandidate, highestVotes);
    }

    function getElection(uint256 electionId)
        public
        view
        returns (
            string memory title,
            uint256 startTime,
            uint256 endTime,
            Candidate[] memory candidates
        )
    {
        Election storage election = elections[electionId];
        return (
            election.title,
            election.startTime,
            election.endTime,
            election.candidates
        );
    }

    // Additional function to check if the voter has already voted
    function hasVoted(uint256 electionId, address voter) public view returns (bool) {
        Election storage election = elections[electionId];
        return election.voters[voter];
    }
}
