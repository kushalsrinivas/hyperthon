import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";

const ChallengeForm = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [challengeFee, setChallengeFee] = useState<string>('');

  const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address
  const contractABI = [
    // Your contract ABI here
    "function createChallenge() external payable",
    "function joinChallenge(uint challengeId) external payable",
    "function withdrawPrize(uint challengeId) external",
  ];

  const handleCreateChallenge = async () => {
    if (!signer || !challengeFee || parseFloat(challengeFee) <= 0) {
      alert("Please provide a valid fee.");
      return;
    }

    try {
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const feeInWei = ethers.utils.parseEther(challengeFee); // Convert fee to Wei

      setCreatingChallenge(true);
      const tx = await contract.createChallenge({ value: feeInWei });
      await tx.wait(); // Wait for the transaction to be mined
      alert("Challenge created successfully!");
    } catch (error) {
      console.error("Error creating challenge", error);
      alert("Error creating challenge");
    } finally {
      setCreatingChallenge(false);
    }
  };

  return (
    <div className="create-challenge-form">
      <h2>Create Challenge</h2>
      <input
        type="number"
        value={challengeFee}
        onChange={(e) => setChallengeFee(e.target.value)}
        placeholder="Enter fee for prize pool"
      />
      <button onClick={handleCreateChallenge} disabled={creatingChallenge}>
        {creatingChallenge ? "Creating..." : "Create Challenge"}
      </button>
    </div>
  );
};

export default ChallengeForm;
