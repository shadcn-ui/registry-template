"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Input } from "@/registry/mini-app/ui/input";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { Search, User, ExternalLink, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Types based on Neynar API response
export type FarcasterUser = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
  power_badge?: boolean;
  profile?: {
    bio?: {
      text?: string;
    };
  };
  verified_addresses?: {
    eth_addresses?: string[];
  };
};

export type NeynarSearchResponse = {
  result: {
    users: FarcasterUser[];
    next?: {
      cursor: string;
    };
  };
};

type ProfileSearchProps = {
  apiKey: string;
  placeholder?: string;
  variant?: "destructive" | "secondary" | "ghost" | "default";
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  layout?: "horizontal" | "vertical";
  showIcon?: boolean;
  autoSearch?: boolean;
  maxResults?: number;
  searchFunction?: (query: string, apiKey: string, maxResults: number) => Promise<{ users: FarcasterUser[], total: number }>;
  onError?: (error: string) => void;
};

export function ProfileSearch({
  apiKey,
  placeholder = "Search Farcaster users...",
  variant = "default",
  className,
  inputClassName,
  buttonClassName,
  layout = "horizontal",
  showIcon = true,
  autoSearch = false,
  maxResults = 5,
  searchFunction,
  onError,
}: ProfileSearchProps) {
  const [searchInput, setSearchInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<FarcasterUser[]>([]);
  const [totalResults, setTotalResults] = React.useState(0);
  const { sdk, isSDKLoaded } = useMiniAppSdk();

  // Calculate relevance score for sorting
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

  const defaultSearchFunction = async (query: string, apiKey: string, maxResults: number): Promise<{ users: FarcasterUser[], total: number }> => {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${maxResults}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data: NeynarSearchResponse = await response.json();
    
    // Sort by relevance if multiple results
    const sortedUsers = (data.result.users || [])
      .map(user => ({ user, score: calculateRelevanceScore(user, query) }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.user);
    
    return {
      users: sortedUsers,
      total: sortedUsers.length
    };
  };

  const searchUsers = async (query: string) => {
    if (!apiKey.trim()) {
      const errorMsg = "API key is required";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    if (!query.trim()) {
      const errorMsg = "Please enter a search term";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const searchFn = searchFunction || defaultSearchFunction;
      const { users, total } = await searchFn(query, apiKey, maxResults);
      
      setSearchResults(users);
      setTotalResults(total);
      
      if (users.length === 0) {
        const errorMsg = "No users found matching your search";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to search users";
      setError(errorMsg);
      setSearchResults([]);
      setTotalResults(0);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const viewProfile = async (fid: number) => {
    try {
      if (!isSDKLoaded) {
        throw new Error("Farcaster SDK not loaded");
      }
      
      await sdk.actions.viewProfile({ fid });
    } catch (err) {
      console.error("Error viewing profile:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to view profile";
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleSearch = async () => {
    await searchUsers(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchResults([]);
    setTotalResults(0);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setError("");
    
    // Auto-search with debounce
    if (autoSearch && value.length > 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const containerClasses = cn(
    "flex flex-col gap-4 w-full",
    className
  );

  const searchContainerClasses = cn(
    "flex gap-2 w-full",
    layout === "vertical" ? "flex-col" : "flex-row"
  );

  const hasMoreResults = totalResults > maxResults;
  const hiddenResultsCount = totalResults - maxResults;

  return (
    <div className={containerClasses}>
      {/* Search Input */}
      <div className={searchContainerClasses}>
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className={cn(
              "w-full",
              error && "border-red-500",
              inputClassName
            )}
          />
          {searchInput && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={loading}
            className="shrink-0"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        </div>
        
        {/* Clear Button - only show when there's a search term */}
        
        
        <Button
          variant={variant}
          onClick={handleSearch}
          disabled={loading || !searchInput.trim() || !apiKey.trim() || !isSDKLoaded}
          className={cn(
            layout === "vertical" ? "w-full" : "shrink-0",
            buttonClassName
          )}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Searching...
            </>
          ) : (
            <>
              {showIcon && <Search className="h-4 w-4 mr-2" />}
              Search
            </>
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Showing {searchResults.length} of {totalResults} user{totalResults !== 1 ? 's' : ''}
            </div>
            
            {hasMoreResults && (
              <div className="text-xs text-muted-foreground">
                +{hiddenResultsCount} more user{hiddenResultsCount !== 1 ? 's' : ''}...
              </div>
            )}
          </div>
          
          <div className="grid gap-3">
            {searchResults.map((user) => (
              <UserCard
                key={user.fid}
                user={user}
                onClick={() => viewProfile(user.fid)}
              />
            ))}
          </div>
          
          {hasMoreResults && (
            <div className="text-center py-2 text-xs text-muted-foreground border-t border-dashed">
              Showing most relevant results. {hiddenResultsCount} more user{hiddenResultsCount !== 1 ? 's' : ''} found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// User Card Component
type UserCardProps = {
  user: FarcasterUser;
  onClick: () => void;
};

function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {user.pfp_url ? (
          <img
            src={user.pfp_url}
            alt={user.display_name || user.username}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        {/* Name and FID row */}
        <div className="mt-2">
        <div className="flex items-center flex-wrap gap-2">
          <h3 className="font-medium text-xs sm:text-sm truncate flex-1">
            {user.display_name || user.username}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            FID {user.fid}
          </span>
        </div>
        
        {/* Username */}
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          @{user.username}
        </p>
        </div>
        {/* Bio */}
        {user.profile?.bio?.text && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-tight">
            {user.profile.bio.text}
          </p>
        )}
        
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3  mt-2 text-xs text-muted-foreground">
          <span className="whitespace-nowrap">
            {user.follower_count > 999 
              ? `${(user.follower_count / 1000).toFixed(user.follower_count > 99999 ? 0 : 1)}k` 
              : user.follower_count.toLocaleString()
            } followers
          </span>
          <span className="whitespace-nowrap">
            {user.following_count > 999 
              ? `${(user.following_count / 1000).toFixed(user.following_count > 99999 ? 0 : 1)}k` 
              : user.following_count.toLocaleString()
            } following
          </span>
          {user.verified_addresses?.eth_addresses?.length ? (
            <span className="text-green-600 dark:text-green-400 whitespace-nowrap">✓ Verified</span>
          ) : null}
        </div>
      </div>    
    </div>
  );
}