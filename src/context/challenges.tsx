"use client";
import React, { createContext, useContext, useState } from "react";

interface Challenge {
  id: number;
  name: string;
  duration: number;
  prizePool: number;
  creator: string;
  participants: string[];
  logs: {
    user: string;
    timestamp: Date;
    content: string;
  }[];
  startDate: Date;
  endDate: Date;
}

interface ChallengesContextValue {
  publicChallenges: Challenge[];
  activeChallenges: Challenge[];
  addChallenge: (challenge: Challenge) => void;
  joinChallenge: (challengeId: number, user: string) => void;
}

const ChallengesContext = createContext<ChallengesContextValue | undefined>(
  undefined,
);

export const ChallengesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [publicChallenges, setPublicChallenges] = useState<Challenge[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  const addChallenge = (challenge: Challenge) => {
    setPublicChallenges((prev) => [...prev, challenge]);
  };
  const joinChallenge = (challengeId: number, user: string) => {
    // Step 1: Update publicChallenges
    setPublicChallenges((prev) => {
      return prev.map((challenge) =>
        challenge.id === challengeId && !challenge.participants.includes(user)
          ? {
              ...challenge,
              participants: [...challenge.participants, user],
            }
          : challenge,
      );
    });

    // Step 2: Update activeChallenges by checking if the challenge is not already in the list
    setActiveChallenges((prev) => {
      // Find the challenge in the public challenges that was just updated
      const updatedChallenge = publicChallenges.find(
        (challenge) => challenge.id === challengeId,
      );

      // If challenge exists and user is part of it, add it to activeChallenges
      if (updatedChallenge && updatedChallenge.participants.includes(user)) {
        if (!prev.some((ch) => ch.id === updatedChallenge.id)) {
          return [...prev, updatedChallenge];
        }
      }

      return prev;
    });
  };

  return (
    <ChallengesContext.Provider
      value={{
        publicChallenges,
        activeChallenges,
        addChallenge,
        joinChallenge,
      }}
    >
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengesProvider");
  }
  return context;
};
