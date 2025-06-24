"use client";

import * as React from "react";
import { NFTMintFlow } from "@/registry/mini-app/blocks/nft-mint-flow/nft-mint-flow";

export function NFTShowcaseDemo({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {showHeader && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">NFT Card + Mint Button</h3>
          <p className="text-sm text-muted-foreground">
            Compose NFTCard and NFTMintFlow for a complete experience
          </p>
        </div>
      )}
      
      <NFTMintFlow
        contractAddress="0x32dd0a7190b5bba94549a0d04659a9258f5b1387"
        tokenId="2"
        network="base"
        chainId={8453}
        provider="manifold"
        manifoldParams={{
          instanceId: "4293509360",
          tokenId: "2"
        }}
        buttonText="Mint with $HIGHER"
        cardSize={350}
      />
      
      {showHeader && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 text-sm">How to use:</h4>
          <pre className="text-xs overflow-x-auto">
            <code>{`// Best practice: Match component widths
<div className="space-y-4 w-[350px]">
  <NFTCard 
    contractAddress="0x..."
    tokenId="1"
    network="base"
    width={350}
    height={350}
  />
  <NFTMintFlow
    contractAddress="0x..."
    chainId={8453}
    buttonText="Mint NFT"
    className="w-full"
  />
</div>

// Alternative: Use consistent container
<div className="max-w-sm space-y-4">
  <NFTCard className="w-full" />
  <NFTMintFlow className="w-full" />
</div>`}</code>
          </pre>
        </div>
      )}
    </div>
  );
}