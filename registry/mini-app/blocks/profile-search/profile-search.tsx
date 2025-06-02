"use client";

import * as React from "react";
import { Button } from "@/registry/mini-app/ui/button";
import { Input } from "@/registry/mini-app/ui/input";
import { useMiniAppSdk } from "@/registry/mini-app/hooks/use-miniapp-sdk";
import { Search, User, Users, X } from "lucide-react";
import { formatLargeNumber } from "@/registry/mini-app/lib/text-utils";

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
  searchFunction?: (
    query: string,
    apiKey: string,
    maxResults: number,
    cursor?: string,
  ) => Promise<{ users: FarcasterUser[]; nextCursor?: string }>;
  userCardComponent?: React.ComponentType<UserCardProps>;
  onError?: (error: string) => void;
  onClick?: (user: FarcasterUser) => void;
};

export const calculateRelevanceScore = (
  user: FarcasterUser,
  query: string,
): number => {
  const lowerQuery = query.toLowerCase();
  const username = user.username.toLowerCase();
  const displayName = user.display_name.toLowerCase();

  let score = 0;

  // Exact matches get highest score
  if (username === lowerQuery || username === `${lowerQuery}.eth`)
    score += 1000;
  else if (username.startsWith(lowerQuery)) score += 600;
  else if (username.includes(lowerQuery)) score += 500;

  // make these else ifs:
  if (displayName === lowerQuery) score += 500;
  else if (displayName.startsWith(lowerQuery)) score += 500;
  else if (displayName.includes(lowerQuery)) score += 400;

  // FID match
  if (user.fid.toString() === query) score += 950;

  // Bonus for shorter usernames (more relevant for short queries)
  if (username.includes(lowerQuery)) {
    score += Math.max(0, 100 - username.length);
  }

  if (user.verified_addresses?.eth_addresses?.length) score += 30;

  // Bonus for follower count (logarithmic to avoid overwhelming)
  score += Math.log(user.follower_count + 1) * 10;

  return score;
};

export function ProfileSearch({
  apiKey,
  onClick,
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
  userCardComponent: CustomUserCard,
  onError,
}: ProfileSearchProps) {
  const [searchInput, setSearchInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<FarcasterUser[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | undefined>();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const debounceRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const { sdk, isSDKLoaded, isMiniApp } = useMiniAppSdk();
  const defaultSearchFunction = async (
    query: string,
    apiKey: string,
    maxResults: number,
    cursor?: string,
  ): Promise<{
    users: FarcasterUser[];
    nextCursor?: string;
  }> => {
    let url = `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(query)}&limit=${maxResults}`;
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        api_key: apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const data: NeynarSearchResponse = await response.json();

    // Sort by relevance if multiple results (only for first page to maintain API order for subsequent pages)
    const users = !cursor
      ? (data.result.users || [])
          .map((user) => ({
            user,
            score: calculateRelevanceScore(user, query),
          }))
          .sort((a, b) => b.score - a.score)
          .map((item) => item.user)
      : data.result.users || [];

    return {
      users,
      nextCursor: data.result.next?.cursor,
    };
  };

  const searchUsers = async (query: string, loadMore = false) => {
    if (!searchFunction && !apiKey.trim()) {
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
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setLoading(true);
        setSearchResults([]);
        setNextCursor(undefined);
      }
      setError("");

      const searchFn = searchFunction || defaultSearchFunction;
      const cursor = loadMore ? nextCursor : undefined;

      const { users, nextCursor: newCursor } = await searchFn(
        query,
        apiKey,
        maxResults,
        cursor,
      );

      if (loadMore) {
        setSearchResults((prev) => [...prev, ...users]);
      } else {
        setSearchResults(users);
      }

      setNextCursor(newCursor);

      if (!loadMore && users.length === 0) {
        const errorMsg = "No users found matching your search";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      console.error("Error searching users:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to search users";
      setError(errorMsg);
      if (!loadMore) {
        setSearchResults([]);
        setNextCursor(undefined);
      }
      onError?.(errorMsg);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const viewProfile = async (username: string, fid: number) => {
    try {
      if (isMiniApp) {
        await sdk.actions.viewProfile({ fid });
      } else {
        window.open(`https://farcaster.xyz/${username}`, "_blank");
      }
    } catch (err) {
      console.error("Error viewing profile:", err);
      const errorMsg =
        err instanceof Error ? err.message : "Failed to view profile";
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
    setNextCursor(undefined);
    setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInput(value);
    setError("");

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value === "") {
      setSearchResults([]);
      setNextCursor(undefined);
      return;
    }

    // Auto-search with debounce
    if (autoSearch && value.length > 2) {
      debounceRef.current = setTimeout(() => {
        searchUsers(value);
      }, 500);
    }
  };

  const containerClasses = cn("flex flex-col gap-4 w-full", className);

  const searchContainerClasses = cn(
    "flex gap-2 w-full",
    layout === "vertical" ? "flex-col" : "flex-row",
  );

  const hasMoreResults = !!nextCursor;

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
            onKeyDown={handleKeyPress}
            className={cn("w-full", error && "border-red-500", inputClassName)}
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
          disabled={loading || !searchInput.trim() || !isSDKLoaded}
          className={cn(
            layout === "vertical" ? "w-full" : "shrink-0",
            buttonClassName,
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
              Showing {searchResults.length} user
              {searchResults.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="grid gap-3">
            {searchResults.map((user) => {
              const UserCardComponent = CustomUserCard || UserCard;
              return (
                <UserCardComponent
                  key={user.fid}
                  user={user}
                  onClick={() => {
                    console.log("User clicked:", user, isSDKLoaded);
                    if (onClick) {
                      onClick(user);
                    } else {
                      viewProfile(user.username, user.fid);
                    }
                  }}
                />
              );
            })}
          </div>

          {hasMoreResults && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => searchUsers(searchInput, true)}
                disabled={isLoadingMore || loading}
                className="w-full sm:w-auto"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Loading more...
                  </>
                ) : (
                  <>Load More</>
                )}
              </Button>
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
      className="p-2 sm:p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors group"
    >
      {/* Top row with avatar, name, and FID */}
      <div className="flex gap-2 sm:gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0 mt-[3px]">
          {user.pfp_url ? (
            <img
              src={user.pfp_url}
              alt={user.display_name || user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Name and FID */}
        <div className="flex-1 min-w-0">
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
      </div>

      {/* Bio */}
      {user.profile?.bio?.text && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-tight ml-12 sm:ml-15">
          {user.profile.bio.text}
        </p>
      )}

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground ml-12 sm:ml-15">
        <span className="whitespace-nowrap">
          {formatLargeNumber(user.follower_count)} followers
        </span>
        <span className="whitespace-nowrap">
          {formatLargeNumber(user.following_count)} following
        </span>
      </div>
    </div>
  );
}
