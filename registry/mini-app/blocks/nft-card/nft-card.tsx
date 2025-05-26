"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect } from "react";

interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  [key: string]: unknown;
}
import { createPublicClient, http, parseAbi, getAddress, Chain } from "viem";
import * as chains from "viem/chains";

// Base64 placeholder image
const PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YxZjFmMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5GVCBJbWFnZTwvdGV4dD48L3N2Zz4=";

// ERC721 ABI for tokenURI and name functions
const erc721Abi = parseAbi([
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)'
]);

// Get all available chains from viem
const availableChains: Record<string, Chain> = {};
Object.entries(chains).forEach(([name, chain]) => {
  if (typeof chain === 'object' && chain !== null && 'id' in chain) {
    availableChains[name.toLowerCase()] = chain as Chain;
  }
});

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
  networkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "outside";
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
  const [networkName, setNetworkName] = useState<string>(customNetworkName || "");
  const [owner, setOwner] = useState<string | null>(null);

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  };

  const networkPositionClasses = {
    "top-left": "top-0 left-0 rounded-br-md",
    "top-right": "top-0 right-0 rounded-bl-md",
    "bottom-left": "bottom-0 left-0 rounded-tr-md",
    "bottom-right": "bottom-0 right-0 rounded-tl-md",
    "outside": ""
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
      
      setIsLoading(true);
      setError(null);

      try {
        // Skip chain setup if we have customNetworkName
        if (!customNetworkName) {
          // Normalize network name
          const normalizedNetwork = (network || "ethereum").toLowerCase().replace(/[\s-]/g, '');
          
          // Find the chain by name
          let selectedChain: Chain | undefined;
          
          // Try to find exact match first
          if (availableChains[normalizedNetwork]) {
            selectedChain = availableChains[normalizedNetwork];
          } else {
            // Try to find partial match
            const matchingChainName = Object.keys(availableChains).find(
              chainName => chainName.includes(normalizedNetwork) || normalizedNetwork.includes(chainName)
            );
            
            if (matchingChainName) {
              selectedChain = availableChains[matchingChainName];
            }
          }
          
          // Default to mainnet if no match found
          if (!selectedChain) {
            console.warn(`Chain "${network}" not found, defaulting to Ethereum mainnet`);
            selectedChain = chains.mainnet;
            setNetworkName("Ethereum");
          } else {
            setNetworkName(selectedChain.name);
          }
          
          // Create public client for the selected chain
          const client = createPublicClient({
            chain: selectedChain,
            transport: http(),
          });

          console.log(`Fetching NFT data from ${selectedChain.name} for contract ${contractAddress} token ${tokenId}`);

          // Skip title setup if we have customTitle
          if (!customTitle) {
            try {
              // Get contract name
              const name = await client.readContract({
                address: getAddress(contractAddress),
                abi: erc721Abi,
                functionName: 'name',
              }) as string;
              
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
              const ownerAddress = await client.readContract({
                address: getAddress(contractAddress),
                abi: erc721Abi,
                functionName: 'ownerOf',
                args: [BigInt(tokenId)],
              }) as string;
              
              setOwner(ownerAddress);
            } catch (ownerError) {
              console.warn("Could not fetch NFT owner:", ownerError);
            }
          }

          // Get tokenURI
          const tokenURI = await client.readContract({
            address: getAddress(contractAddress),
            abi: erc721Abi,
            functionName: 'tokenURI',
            args: [BigInt(tokenId)],
          }) as string;

          // Process tokenURI to get metadata
          let metadataUrl = tokenURI;
          
          // Handle IPFS URLs
          if (metadataUrl.startsWith('ipfs://')) {
            metadataUrl = metadataUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
          }
          
          // Fetch metadata
          const metadata = await fetch(metadataUrl).then(res => res.json());
          console.log("NFT metadata:", metadata);
          
          // Call onLoad callback if provided
          if (onLoad) {
            onLoad(metadata);
          }
          
          // Get image URL from metadata
          let nftImageUrl = metadata.image;
          
          // Handle IPFS URLs for image
          if (nftImageUrl && nftImageUrl.startsWith('ipfs://')) {
            nftImageUrl = nftImageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
          }

          if (nftImageUrl) {
            setImageUrl(nftImageUrl);
          } else {
            // If no image URL found, use placeholder
            setImageUrl(fallbackImageUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching NFT:", err);
        const error = err instanceof Error ? err : new Error(String(err));
        setError(`Failed to load NFT data: ${error.message}`);
        setImageUrl(fallbackImageUrl);
        
        // Call onError callback if provided
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTData();
  }, [contractAddress, tokenId, network, fallbackImageUrl, customTitle, customNetworkName, showOwner, onLoad, onError]);

  const defaultLoadingComponent = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  const defaultErrorComponent = (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <p className="text-red-500 text-sm text-center px-2">{error}</p>
    </div>
  );

  // Render network badge inside the image
  const renderNetworkBadge = () => {
    if (!showNetwork || !networkName || networkPosition === "outside") return null;
    
    return (
      <div 
        className={cn(
          "absolute bg-black/60 px-2 py-1 text-white text-xs",
          networkPositionClasses[networkPosition],
          networkClassName
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
          titleClassName
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
          <div className={cn("text-xs text-gray-500 dark:text-gray-400", networkClassName)}>
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

  // Create CSS class for width and height
  // Dimension classes will be applied via className

  return (
    <div className={cn(getContainerClasses(), containerClassName)}>
      <div 
        className={cn(
          "relative overflow-hidden",
          roundedClasses[rounded],
          shadow && "shadow-md",
          className
        )}
        style={{ width: `${width}px`, height: `${height}px` }} // Using style prop as a last resort for dynamic dimensions
      >
        {isLoading && (loadingComponent || defaultLoadingComponent)}
        
        {error && (errorComponent || defaultErrorComponent)}
        
        <Image 
          src={imageUrl}
          alt={alt}
          fill={true}
          className={cn(
            "object-" + objectFit,
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