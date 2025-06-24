"use client";

import { cn } from "@/registry/mini-app/lib/utils";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  image_url?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  image_details?: {
    bytes?: number;
    format?: string;
    sha256?: string;
    width?: number;
    height?: number;
  };
  [key: string]: unknown;
}
import { getAddress, type Address } from "viem";
import { 
  findChainByName, 
  getPublicClient 
} from "@/registry/mini-app/lib/chains";
import { 
  ERC721_ABI, 
  ipfsToHttp 
} from "@/registry/mini-app/lib/nft-standards";
import { 
  getTokenURIWithManifoldSupport 
} from "@/registry/mini-app/lib/manifold-utils";

// Base64 placeholder image
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5GVCBJbWFnZTwvdGV4dD48L3N2Zz4=";


type NFTCardProps = {
  contractAddress: string;
  tokenId: string;
  network?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow?: boolean;
  objectFit?: "contain" | "cover" | "fill";
  fallbackImageUrl?: string;
  showTitle?: boolean;
  showNetwork?: boolean;
  titlePosition?: "top" | "bottom" | "outside";
  networkPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "outside";
  customTitle?: string;
  customNetworkName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  imageProps?: React.ComponentProps<typeof Image>;
  titleClassName?: string;
  networkClassName?: string;
  showOwner?: boolean;
  onLoad?: (metadata: NFTMetadata) => void;
  onError?: (error: Error) => void;
  layout?: "compact" | "card" | "detailed";
  containerClassName?: string;
};

export function NFTCard({
  contractAddress,
  tokenId,
  network = "ethereum", // Default to Ethereum mainnet
  alt = "NFT Image",
  className = "",
  width = 300,
  height = 300,
  rounded = "md",
  shadow = true,
  objectFit = "cover",
  fallbackImageUrl = PLACEHOLDER_IMAGE,
  showTitle = true,
  showNetwork = true,
  titlePosition = "outside",
  networkPosition = "top-right",
  customTitle,
  customNetworkName,
  loadingComponent,
  errorComponent,
  imageProps,
  titleClassName = "",
  networkClassName = "",
  showOwner = false,
  onLoad,
  onError,
  layout = "card",
  containerClassName = "",
}: NFTCardProps) {
  const [imageUrl, setImageUrl] = useState<string>(fallbackImageUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(customTitle || null);
  const [networkName, setNetworkName] = useState<string>(
    customNetworkName || "",
  );
  const [owner, setOwner] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const networkPositionClasses = {
    "top-left": "top-0 left-0 rounded-br-md",
    "top-right": "top-0 right-0 rounded-bl-md",
    "bottom-left": "bottom-0 left-0 rounded-tr-md",
    "bottom-right": "bottom-0 right-0 rounded-tl-md",
    outside: "",
  };

  useEffect(() => {
    if (customTitle) {
      setTitle(customTitle);
    }

    if (customNetworkName) {
      setNetworkName(customNetworkName);
    }
  }, [customTitle, customNetworkName]);

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!contractAddress || !tokenId) return;
      
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsLoading(true);
      setError(null);

      try {
        // Skip chain setup if we have customNetworkName
        if (!customNetworkName) {
          // Find the chain by name using shared utility
          const selectedChain = findChainByName(network || "ethereum");
          
          if (!selectedChain) {
            console.warn(
              `Chain "${network}" not found, defaulting to Ethereum mainnet`,
            );
            setNetworkName("Ethereum");
          } else {
            setNetworkName(selectedChain.name);
          }

          // Create public client using shared utility
          const client = getPublicClient(selectedChain?.id || 1);

          console.log(
            `Fetching NFT data from ${selectedChain?.name || 'Ethereum'} for contract ${contractAddress} token ${tokenId}`,
          );

          // Skip title setup if we have customTitle
          if (!customTitle) {
            try {
              // Get contract name
              const name = (await client.readContract({
                address: getAddress(contractAddress),
                abi: ERC721_ABI.name,
                functionName: "name",
              })) as string;

              // Set title
              setTitle(`${name} #${tokenId}`);
            } catch (nameError) {
              console.warn("Could not fetch NFT name:", nameError);
              setTitle(`NFT #${tokenId}`);
            }
          }

          // Get owner if requested
          if (showOwner) {
            try {
              const ownerAddress = (await client.readContract({
                address: getAddress(contractAddress),
                abi: ERC721_ABI.ownerOf,
                functionName: "ownerOf",
                args: [BigInt(tokenId)],
              })) as string;

              setOwner(ownerAddress);
            } catch (ownerError) {
              console.warn("Could not fetch NFT owner:", ownerError);
            }
          }

          // Get tokenURI with automatic Manifold support
          let metadataUrl = await getTokenURIWithManifoldSupport(
            client,
            getAddress(contractAddress) as Address,
            tokenId
          );

          // Handle IPFS URLs using shared utility
          metadataUrl = ipfsToHttp(metadataUrl);

          // Fetch metadata with abort signal
          const response = await fetch(metadataUrl, {
            signal: abortController.signal
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.status}`);
          }
          
          const fetchedMetadata = await response.json();
          console.log("NFT metadata:", fetchedMetadata);
          
          // Store metadata in state
          setMetadata(fetchedMetadata);

          // Call onLoad callback if provided
          if (onLoad) {
            onLoad(fetchedMetadata);
          }

          // Get image URL from metadata
          let nftImageUrl = fetchedMetadata.image || fetchedMetadata.image_url;

          // Handle IPFS URLs for image using shared utility
          if (nftImageUrl) {
            nftImageUrl = ipfsToHttp(nftImageUrl);
          }

          if (nftImageUrl) {
            setImageUrl(nftImageUrl);
          } else {
            // If no image URL found, use placeholder
            setImageUrl(fallbackImageUrl);
          }
        }
      } catch (err) {
        // Don't update state if request was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('NFT data fetch was cancelled');
          return;
        }
        
        console.error("Error fetching NFT:", err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(`Failed to load NFT data: ${error.message}`);
        setImageUrl(fallbackImageUrl);

        // Call onError callback if provided
        if (onError) {
          onError(error);
        }
      } finally {
        // Only update loading state if this request wasn't aborted
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchNFTData();
    
    // Cleanup function to abort request if component unmounts or deps change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    contractAddress,
    tokenId,
    network,
    fallbackImageUrl,
    customTitle,
    customNetworkName,
    showOwner,
    onLoad,
    onError,
  ]);

  const defaultLoadingComponent = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-300 dark:bg-gray-700">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
    </div>
  );

  const defaultErrorComponent = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <p className="text-red-500 text-sm text-center px-2">{error}</p>
    </div>
  );

  // Render network badge inside the image
  const renderNetworkBadge = () => {
    if (!showNetwork || !networkName || networkPosition === "outside")
      return null;

    return (
      <div
        className={cn(
          "absolute bg-black/60 px-2 py-1 text-white text-xs",
          networkPositionClasses[networkPosition],
          networkClassName,
        )}
      >
        {networkName}
      </div>
    );
  };

  // Render title inside the image
  const renderInnerTitle = () => {
    if (!showTitle || !title || titlePosition === "outside") return null;

    return (
      <div
        className={cn(
          "absolute left-0 right-0 bg-black/60 p-2 text-white text-sm truncate",
          titlePosition === "top" ? "top-0" : "bottom-0",
          titleClassName,
        )}
      >
        {title}
        {showOwner && owner && (
          <div className="text-xs opacity-70 truncate">
            Owner: {owner.substring(0, 6)}...{owner.substring(owner.length - 4)}
          </div>
        )}
      </div>
    );
  };

  // Render outside information (title, network, owner)
  const renderOutsideInfo = () => {
    if (
      (!showTitle || !title) &&
      (!showNetwork || !networkName || networkPosition !== "outside") &&
      (!showOwner || !owner || titlePosition !== "outside")
    ) {
      return null;
    }

    return (
      <div className="mt-2">
        {showTitle && title && titlePosition === "outside" && (
          <div className={cn("text-sm font-medium truncate", titleClassName)}>
            {title}
          </div>
        )}

        {showNetwork && networkName && networkPosition === "outside" && (
          <div
            className={cn(
              "text-xs text-gray-500 dark:text-gray-400",
              networkClassName,
            )}
          >
            Network: {networkName}
          </div>
        )}

        {showOwner && owner && titlePosition === "outside" && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
            Owner: {owner.substring(0, 6)}...{owner.substring(owner.length - 4)}
          </div>
        )}
      </div>
    );
  };

  // Apply different layouts
  const getContainerClasses = () => {
    switch (layout) {
      case "compact":
        return "inline-block";
      case "detailed":
        return "flex flex-col overflow-hidden";
      case "card":
      default:
        return "";
    }
  };

  // Calculate display dimensions that preserve aspect ratio
  const getDisplayDimensions = () => {
    const maxWidth = width || 300;
    const maxHeight = height || 300;
    
    // Check if we have image_details with dimensions
    if (metadata?.image_details?.width && metadata?.image_details?.height) {
      const originalAspectRatio = metadata.image_details.width / metadata.image_details.height;
      
      // Scale to fit within bounds while preserving aspect ratio
      const widthBasedHeight = maxWidth / originalAspectRatio;
      const heightBasedWidth = maxHeight * originalAspectRatio;
      
      if (widthBasedHeight <= maxHeight) {
        // Width is the limiting factor
        return { 
          width: maxWidth, 
          height: Math.round(widthBasedHeight),
          useContain: true // Use contain to show full image
        };
      } else {
        // Height is the limiting factor
        return { 
          width: Math.round(heightBasedWidth), 
          height: maxHeight,
          useContain: true
        };
      }
    }
    
    // No image_details, use provided dimensions
    return { width: maxWidth, height: maxHeight, useContain: false };
  };

  const displayDimensions = getDisplayDimensions();

  return (
    <div className={cn(getContainerClasses(), containerClassName)}>
      <div
        className={cn(
          "relative overflow-hidden",
          roundedClasses[rounded],
          shadow && "shadow-md",
          className,
        )}
        style={{ 
          width: `${displayDimensions.width}px`, 
          height: `${displayDimensions.height}px` 
        }}
      >
        {isLoading && (loadingComponent || defaultLoadingComponent)}

        {error && (errorComponent || defaultErrorComponent)}

        <Image
          src={imageUrl}
          alt={alt}
          fill={true}
          className={cn(
            displayDimensions.useContain ? "object-contain" : `object-${objectFit}`,
            isLoading && "opacity-0"
          )}
          unoptimized={true}
          onError={() => setImageUrl(PLACEHOLDER_IMAGE)}
          {...imageProps}
        />

        {renderInnerTitle()}
        {renderNetworkBadge()}
      </div>

      {renderOutsideInfo()}
    </div>
  );
}
