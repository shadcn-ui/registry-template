import React from "react";
import { ProfileSearch, type FarcasterUser } from "./profile-search";
import { TestTube } from "lucide-react";
import { calculateRelevanceScore } from "./profile-search";

// Mock data for simulation mode
const mockUsers: FarcasterUser[] = [
  {
    fid: 3,
    username: "dwr",
    display_name: "Dan Romero",
    pfp_url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original",
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
    fid: 376106,
    username: "nik-navdiya",
    display_name: "Nik 🎩",
    pfp_url: "https://wrpcd.net/cdn-cgi/image/anim=false,fit=contain,f=auto,w=336/https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafkreidaldog5lil6ljnrm7kawyusapkcgx63fsseslgnyw4b2gdemoxzy",
    follower_count: 95230,
    following_count: 850,
    power_badge: true,
    profile: {
      bio: {
        text: "Aspiring web3 developer | Exploring AI technology"
      }
    },
    verified_addresses: {
      eth_addresses: ["0x182327170fc284caaa5b1bc3e3878233f529d741"]
    }
  },
  {
    fid: 1214,
    username: "vitalik",
    display_name: "Vitalik Buterin",
    pfp_url: "https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/b663cd63-fecf-4d0f-7f87-0e0b6fd42800/anim=false,fit=contain,f=auto,w=336",
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
     fid: 13596,
    username: "hellno.eth",
    display_name: "hellno the optimist",
    pfp_url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/415baeae-ab4c-4d2f-bccd-3f319e89ec00/original",
    follower_count: 56743,
    following_count: 2091,
    power_badge: true,
    profile: {
      bio: {
        text: "dev + founder | @vibesengineering.eth prev: @onsenbot @herocast"
      }
    }
  },
  
  // Adding more users for better testing
];

// Simulation search function
const simulateSearch = async (query: string, _apiKey: string, maxResults: number): Promise<{ users: FarcasterUser[], total: number }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  console.log(query);
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
  const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
  return (
    <>
    <div className="space-y-4">
      {/* Simulation Mode Banner */}
      {!apiKey && <div className="mb-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
        <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <TestTube className="h-4 w-4" />
          <span className="font-medium">Simulation Mode</span>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Using mock data for testing. Try searching: &quot;vitalik&quot;, &quot;dwr&quot;, &quot;hellno&quot;, &quot;nik&quot;, etc.
        </p>
      </div>}
      
      <ProfileSearch 
        apiKey={apiKey as string}
        searchFunction={!apiKey ? simulateSearch : undefined}
        placeholder="Search for users like 'vitalik', 'dwr', etc..." 
        maxResults={5}
        autoSearch={true}
      />
    </div>
    </>
  );
}