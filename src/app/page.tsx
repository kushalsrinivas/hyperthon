"use client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useAccount } from "wagmi";

import { ConnectButton } from "~/components/ConnectButton";
import { useChallenges } from "~/context/challenges";

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

export default function ChallengeDApp() {
  const { address: currentAccount, isConnected } = useAccount();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"public" | "active">("public");

  const { publicChallenges, activeChallenges, addChallenge, joinChallenge } =
    useChallenges();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const challenge: Challenge = {
      id: Date.now(),
      name: formData.get("challengeName") as string,
      duration: Number(formData.get("duration")),
      prizePool: Number(formData.get("prizePool")),
      creator: currentAccount,
      participants: [currentAccount],
      logs: [],
      startDate: new Date(),
      endDate: new Date(
        Date.now() + Number(formData.get("duration")) * 24 * 60 * 60 * 1000,
      ),
    };

    addChallenge(challenge);
    setIsModalOpen(false); // Close the modal after adding the challenge
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Challenge DApp</h1>
          <ConnectButton />
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "public" | "active")}
        >
          <TabsList>
            <TabsTrigger value="public">Public Challenges</TabsTrigger>
            <TabsTrigger value="active">Active Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {publicChallenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-bold">{challenge.name}</h3>
                    <p className="mb-2 text-gray-600">
                      Prize: {challenge.prizePool} ETH
                    </p>
                    <p className="mb-2 text-gray-600">
                      Duration: {challenge.duration} days
                    </p>
                    <p className="mb-4 text-gray-600">
                      Participants: {challenge.participants.length}
                    </p>
                    <Button
                      onClick={() =>
                        joinChallenge(challenge.id, currentAccount!)
                      }
                      variant="outline"
                    >
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeChallenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  onClick={() => router.push(`/challenges/${challenge.id}`)}
                  className="cursor-pointer"
                >
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-lg font-bold">{challenge.name}</h3>
                    <p className="mb-2 text-gray-600">
                      Prize: {challenge.prizePool} ETH
                    </p>
                    <p className="mb-2 text-gray-600">
                      Duration: {challenge.duration} days
                    </p>
                    <p className="mb-4 text-gray-600">
                      Participants: {challenge.participants.length}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Button
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full p-0"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="challengeName">Challenge Name</Label>
                <Input id="challengeName" name="challengeName" required />
              </div>
              <div>
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="prizePool">Prize Pool (ETH)</Label>
                <Input
                  id="prizePool"
                  name="prizePool"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <Button type="submit" variant="default">
                Create Challenge
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
