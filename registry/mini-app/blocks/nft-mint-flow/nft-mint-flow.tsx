"use client";

import * as React from "react";
import { NFTCard } from "@/registry/mini-app/blocks/nft-card/nft-card";
import { NFTMintButton } from "@/registry/mini-app/blocks/nft-mint-flow/nft-mint-button";

interface NFTMintPageProps {
  contractAddress: `0x${string}`;
  tokenId: string;
  network?: string;
  chainId: 1 | 8453;
  provider?: "manifold" | "opensea" | "zora" | "generic";
  manifoldParams?: {
    instanceId?: string;
    tokenId?: string;
  };
  buttonText?: string;
  cardSize?: number;
}

/**
 * NFT Mint Page - Complete NFT display and minting experience
 * 
 * This component combines NFTCard for preview and NFTMintFlow for minting
 * in a properly aligned vertical layout.
 * 
 * @example
 * ```tsx
 * <NFTMintPage
 *   contractAddress="0x32dd0a7190b5bba94549a0d04659a9258f5b1387"
 *   tokenId="2"
 *   network="base"
 *   chainId={8453}
 *   provider="manifold"
 *   manifoldParams={{
 *     instanceId: "4293509360",
 *     tokenId: "2"
 *   }}
 * />
 * ```
 */
export function NFTMintFlow({
  contractAddress,
  tokenId,
  network = "ethereum",
  chainId,
  provider,
  manifoldParams,
  buttonText = "Mint NFT",
  cardSize = 350,
}: NFTMintPageProps) {
  return (
    <div 
      className="space-y-4 mx-auto"
      style={{ width: `${cardSize}px` }}
    >
      <NFTCard 
        contractAddress={contractAddress}
        tokenId={tokenId}
        network={network}
        width={cardSize}
        height={cardSize}
        rounded="xl"
        shadow={true}
        showTitle={true}
        showNetwork={true}
        titlePosition="outside"
        networkPosition="outside"
      />
      
      <NFTMintButton
        contractAddress={contractAddress}
        chainId={chainId}
        provider={provider}
        manifoldParams={manifoldParams}
        buttonText={buttonText}
        variant="default"
        size="lg"
        className="w-full"
      />
    </div>
  );
}