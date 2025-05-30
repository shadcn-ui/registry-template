import React from "react";
import { ProfileSearch, type FarcasterUser } from "./profile-search";
import { TestTube, Key, ExternalLink } from "lucide-react";
import { Input } from "@/registry/mini-app/ui/input";

// Mock data for simulation mode
const mockUsers: FarcasterUser[] = [
  {
    fid: 3,
    username: "dwr",
    display_name: "Dan Romero",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAAcHTteZqUMlzGjXuSQqNNTtu5PWGa7SzNNjFm1npjpWdw%3Ds96-c",
    follower_count: 185420,
    following_count: 1205,
    power_badge: true,
    profile: {
      bio: {
        text: "Building Farcaster 🍇"
      }
    },
    verified_addresses: {
      eth_addresses: ["0x5a927ac639636e534b678e81768ca19e2c6280b7"]
    }
  },
  {
    fid: 2,
    username: "varunsrin",
    display_name: "Varun Srinivasan",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2F8Dx6jdQ.jpg",
    follower_count: 95230,
    following_count: 850,
    power_badge: true,
    profile: {
      bio: {
        text: "Working on Farcaster and Hubble"
      }
    },
    verified_addresses: {
      eth_addresses: ["0x182327170fc284caaa5b1bc3e3878233f529d741"]
    }
  },
  {
    fid: 6841,
    username: "vit",
    display_name: "Tony D'Addeo",
    pfp_url: "https://i.imgur.com/dMoIan7.jpg",
    follower_count: 12450,
    following_count: 420,
    power_badge: false,
    profile: {
      bio: {
        text: "Building @warpcast and @farcaster, new dad, like making food"
      }
    },
    verified_addresses: {
      eth_addresses: ["0x123..."]
    }
  },
  {
    fid: 1214,
    username: "vitalik",
    display_name: "Vitalik Buterin",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FOJMVp6F.jpg",
    follower_count: 324150,
    following_count: 95,
    power_badge: true,
    profile: {
      bio: {
        text: "Ethereum co-founder, crypto researcher, and dog lover 🐕"
      }
    },
    verified_addresses: {
      eth_addresses: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]
    }
  },
  {
    fid: 9152,
    username: "warpcast",
    display_name: "Warpcast",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FQnF7N6P.png",
    follower_count: 89340,
    following_count: 12,
    power_badge: true,
    profile: {
      bio: {
        text: "A Farcaster client. Made by @merkle-manufactory"
      }
    }
  },
  {
    fid: 1689,
    username: "jessepollak",
    display_name: "Jesse Pollak",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FaDOZEwv.jpg",
    follower_count: 45120,
    following_count: 1205,
    power_badge: true,
    profile: {
      bio: {
        text: "Building @base at @coinbase. Previously @coinbase wallet."
      }
    },
    verified_addresses: {
      eth_addresses: ["0x123..."]
    }
  },
  // Adding more users for better testing
  {
    fid: 8742,
    username: "v",
    display_name: "V",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FExample1.jpg",
    follower_count: 5200,
    following_count: 320,
    power_badge: false,
    profile: {
      bio: {
        text: "Short username test user"
      }
    }
  },
  {
    fid: 8743,
    username: "vm",
    display_name: "VM",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FExample2.jpg",
    follower_count: 3200,
    following_count: 180,
    power_badge: false,
    profile: {
      bio: {
        text: "Two char username"
      }
    }
  },
  {
    fid: 8744,
    username: "victor",
    display_name: "Victor",
    pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https%3A%2F%2Fi.imgur.com%2FExample3.jpg",
    follower_count: 8900,
    following_count: 450,
    power_badge: false,
    profile: {
      bio: {
        text: "Six char username test"
      }
    }
  }
];

// Calculate relevance score for sorting (copied from main component)
const calculateRelevanceScore = (user: FarcasterUser, query: string): number => {
  const lowerQuery = query.toLowerCase();
  const username = user.username.toLowerCase();
  const displayName = user.display_name.toLowerCase();
  const bio = user.profile?.bio?.text?.toLowerCase() || "";
  
  let score = 0;
  
  // Exact matches get highest score
  if (username === lowerQuery) score += 1000;
  if (displayName === lowerQuery) score += 900;
  
  // Username starts with query gets high score
  if (username.startsWith(lowerQuery)) score += 800;
  if (displayName.startsWith(lowerQuery)) score += 700;
  
  // Username contains query
  if (username.includes(lowerQuery)) score += 600;
  if (displayName.includes(lowerQuery)) score += 500;
  
  // Bio contains query
  if (bio.includes(lowerQuery)) score += 300;
  
  // FID match
  if (user.fid.toString() === query) score += 950;
  
  // Bonus for shorter usernames (more relevant for short queries)
  if (username.includes(lowerQuery)) {
    score += Math.max(0, 100 - username.length);
  }
  
  // Bonus for power badge and verification
  if (user.power_badge) score += 50;
  if (user.verified_addresses?.eth_addresses?.length) score += 30;
  
  // Bonus for follower count (logarithmic to avoid overwhelming)
  score += Math.log10(user.follower_count + 1) * 10;
  
  return score;
};

// Simulation search function
const simulateSearch = async (query: string, _apiKey: string, maxResults: number): Promise<{ users: FarcasterUser[], total: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  const lowerQuery = query.toLowerCase();
  
  // Filter all matching users
  const allMatches = mockUsers.filter(user => 
    user.username.toLowerCase().includes(lowerQuery) ||
    user.display_name.toLowerCase().includes(lowerQuery) ||
    user.fid.toString().includes(query) ||
    (user.profile?.bio?.text?.toLowerCase().includes(lowerQuery))
  );
  
  // Sort by relevance score
  const sortedMatches = allMatches
    .map(user => ({ user, score: calculateRelevanceScore(user, query) }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.user);
  
  // Return top results and total count
  return {
    users: sortedMatches.slice(0, maxResults),
    total: sortedMatches.length
  };
};

// Demo wrapper with simulation mode
export function ProfileSearchSimulationDemo() {
  return (
    <div className="space-y-4">
      {/* Simulation Mode Banner */}
      <div className="mb-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <TestTube className="h-4 w-4" />
          <span className="font-medium">Simulation Mode</span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Using mock data for testing. Try searching: "v", "vitalik", "dwr", "warpcast", "jesse", etc.
        </p>
      </div>
      
      <ProfileSearch 
        apiKey="demo-key" // Dummy key for simulation
        searchFunction={simulateSearch}
        placeholder="Search for users like 'vitalik', 'dwr', etc..." 
        maxResults={5}
        autoSearch={true}
      />
    </div>
  );
}

// Demo wrapper with API key input
export function ProfileSearchApiDemo() {
  const [apiKey, setApiKey] = React.useState("");

  return (
    <div className="space-y-4">
      {/* API Key Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Key className="h-4 w-4" />
          Neynar API Key
        </label>
        <Input
          type="password"
          placeholder="Enter your Neynar API key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mb-2">
          Get your free API key at{" "}
          <a 
            href="https://neynar.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            neynar.com <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
      
      <ProfileSearch 
        apiKey={apiKey}
        placeholder="Search for users like 'vitalik', 'dwr', etc..." 
        maxResults={5}
      />
    </div>
  );
}