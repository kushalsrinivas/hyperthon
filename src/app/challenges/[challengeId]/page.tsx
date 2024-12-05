"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAccount } from "wagmi"; // Import the useAccount hook from wagmi
import { LaptopMinimalCheck } from "lucide-react";
import Link from "next/link";

interface Log {
  id: number;
  user: string;
  timestamp: Date;
  image: File | null;
  caption: string;
}

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const { address } = useAccount(); // Using wagmi's useAccount hook to get the current account address

  const [logs, setLogs] = useState<Log[]>([]);
  const [leaderboard, setLeaderboard] = useState<Record<string, number>>({});
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (challengeId) {
      console.log("Challenge ID: ", challengeId);
    }
  }, [challengeId]);

  const handleAddLog = () => {
    if (!image || !caption) {
      alert("Please provide both an image and a caption.");
      return;
    }

    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }

    const newLog: Log = {
      id: Date.now(),
      user: address, // Using wallet address from wagmi
      timestamp: new Date(),
      image,
      caption,
    };

    setLogs((prev) => [...prev, newLog]);

    // Update leaderboard
    setLeaderboard((prev) => ({
      ...prev,
      [address]: (prev[address] || 0) + 1,
    }));

    // Reset input fields
    setCaption("");
    setImage(null);
  };

  if (!challengeId) {
    return <div>Loading challenge...</div>; // Show loading message until challengeId is available
  }

  if (!address) {
    return <div>Please connect your wallet.</div>; // Prompt the user to connect wallet if not connected
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Challenge {challengeId}</h1>
      <Link href="/">
        <Button>back</Button>
      </Link>
      {/* Log Entry Form */}
      <Card className="mb-6">
        <CardContent>
          <h2 className="mb-4 text-xl font-bold">Add a Log</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter a caption"
              />
            </div>
            <Button onClick={handleAddLog} variant="default">
              Submit Log
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Layout for Logs */}
      <div className="mb-6">
        <h2 className="mb-4 text-xl font-bold">Logs</h2>
        <div className="space-y-4">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="flex items-start space-x-4">
                <img
                  src={URL.createObjectURL(log.image!)}
                  alt={log.caption}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold">{log.user}</p>
                  <p className="text-sm text-gray-600">
                    {log.timestamp.toLocaleString()}
                  </p>
                  <p className="mt-2">{log.caption}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Leaderboard</h2>
        <Card>
          <CardContent>
            <ol className="list-decimal pl-6">
              {Object.entries(leaderboard)
                .sort(([, a], [, b]) => b - a)
                .map(([user, count], index) => (
                  <li key={user} className="mb-2">
                    <span className="font-bold">{user}</span> - {count} logs
                  </li>
                ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
